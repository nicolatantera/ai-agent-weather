import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamSSE } from "hono/streaming";
import { MESSAGE_STATUSES } from "../../shared/statuses";
import { geocode } from "./ai/tools/geocode";
import { forecast } from "./ai/tools/forecast";
import { createWorkersAI } from "workers-ai-provider";
import { stepCountIs, generateText, ToolSet, ModelMessage } from "ai";
import { getSystemRules } from "./ai/utils";

// a simple way to handle the history of the chat between the user and the agent, used by the AI agent
let messages: ModelMessage[] = [];

// store in memory the history of messages using a pair of <id: string, message: string>
const history = new Map<string, string>();

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use("/*", cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// TEST API to test if the geocode tool is working correctly
app.get("/api/test/geocode", async (c) => {
  const q = c.req.query("q");
  if (!q) return c.text("Missing q", 400);

  if (!geocode.execute) {
    throw new Error("geocode tool missing execute()");
  }

  const response = await geocode.execute({ location: q }, { toolCallId: "", messages: [] });

  return c.json(response);
});

// TEST API to test if the forecast tool is working correctly
app.get("/api/test/forecast", async (c) => {
  const lat = Number(c.req.query("lat"));
  const lon = Number(c.req.query("lon"));
  const userMessage = c.req.query("message");

  if (isNaN(lat) || isNaN(lon)) return c.text("Invalid coords", 400);
  if (!userMessage) return c.text("Missing message", 400);

  if (!forecast.execute) {
    throw new Error("forecast tool missing execute()");
  }

  const response = await forecast.execute({ lat, lon, userMessage }, { toolCallId: "", messages: [] });

  return c.json(response);
});

// Initial POST API the frontend calls to retrieve the id related to the message, for the SSE connection
app.post("/api/chat", async (c) => {
  const { message } = await c.req.json();
  const id = crypto.randomUUID(); // generate a random ID to associate to the related message

  history.set(id, message); // adding to the history the map of the id generated with the recently sent user message

  // update the history of messages used by the ai agent with the latest user message
  messages.push({ role: "user", content: message });

  return c.json({ id });
});

// API to handle the stream of text from the AI agent
app.get("/api/chat/stream", async (c) => {
  // Setup SSE header
  c.header("Content-Type", "text/event-stream");
  c.header("Cache-Control", "no-cache");
  c.header("Connection", "keep-alive");

  const id = c.req.query("id");
  //console.log("id: ", id);
  if (!id) return c.text("Invalid request", 400);

  const userMessage = history.get(id); // retrieve the message from the history given the ID previously generated
  if (!userMessage) return c.text("Invalid request", 400);

  //console.log("user message: ", userMessage); // debug user message

  // SSE streaming
  return streamSSE(c, async (stream) => {
    // first return the status of the message as "PENDING"
    await stream.writeSSE({ event: "status", data: MESSAGE_STATUSES.PENDING });

    try {
      // get the data from the AI agent
      const workersai = createWorkersAI({ binding: c.env.AI });
      const model = workersai("@cf/ibm-granite/granite-4.0-h-micro");

      const tools = {
        geocode: geocode, // geocode tool to get coordinates (location → lat/lon).
        forecast: forecast, // forecast tool using lat/lon coordinates + user message to get real weather data.
      } satisfies ToolSet;

      // generate the text response with the AI and the two Tools
      const result = await generateText({
        model: model,
        /* prompt: userMessage, */
        system: getSystemRules(),
        messages: messages,
        toolChoice: "required",
        tools: tools,
        stopWhen: stepCountIs(15),
      });

      //console.log(JSON.stringify(result));

      // When the AI agent has the response ready, the status is set to "IN_TRANSIT"
      await stream.writeSSE({
        data: MESSAGE_STATUSES.IN_TRANSIT,
        event: "status",
      });

      // For each chunk of the text, add it to the stream
      for await (const chunk of result.text) {
        await stream.writeSSE({ event: "token", data: chunk });
        await stream.sleep(5); // only used to generate a 'writing' delay feeling
      }

      // update the history of messages used by the ai agent with the latest agent message
      messages.push({ role: "assistant", content: result.text });

      // In the end set the status to "SUCCESS"
      await stream.writeSSE({
        event: "status",
        data: MESSAGE_STATUSES.SUCCESS,
      });

      // Close the stream
      await stream.close();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("AI error:", errorMsg);

      // In case of error, stream the error status "ERROR" and the error message
      await stream.writeSSE({ event: "status", data: MESSAGE_STATUSES.ERROR });
      await stream.writeSSE({ event: "token", data: `Error: ${errorMsg}` });
      // update the history of messages used by the ai agent with the latest agent error message
      messages.push({ role: "assistant", content: `Error: ${errorMsg}` });
      await stream.close(); // Finally close the stream
    }
  });
});

export default app;

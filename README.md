# AI-Weather-Agent

A friendly chatbot that gives weather forecasts based on natural language queries (e.g. “Do I need an umbrella tomorrow in Milan?”).
Built with:




## 🧰 Tech Stack

### Backend
- Cloudflare Workers
- Hono
- Vercel AI SDK

### Frontend
- Next.js
- React
- Tailwind CSS

### Extra
- Streaming: server-sent events (SSE)
- External APIs: free geocoding and weather APIs




## 🚀 Features

- Accepts plain-language questions about weather (location + date / date range).
- Resolves location to coordinates using `geocode` tool (via free public API).
- Fetches forecast using `forecast` tool (via free weather API).
- Streams partial responses in real time via SSE, so the UI updates progressively.
- Handles fallback: asks for location if missing, returns error if tools or API fail.
- Supports day-by-day natural-language weather report (no bullet-lists).




## 🧪 Usage

- Type a message like:
```txt
"What’s the weather this weekend in Oslo?"
"Do I need an umbrella tomorrow in Rome?"
"What's the weather like in New York?"
```

- If location or date is missing, the bot will ask for clarification.
- On successful fetch: a day-by-day forecast appears in the chat.
- On error (invalid location, API error, network issue): user sees a polite error message in the chat.



## 🔧 Running Locally

Clone the repository by either:

### 1. Clone Repository

```bash
# Clone repository
git clone https://github.com/nicolatantera/ai-agent-weather.git

# Otherwise by downloading the zip file directly from Github
```


### 2. Install dependencies

```bash
# Install dependencies -> frontend
cd frontend
npm install
```
```bash
# Install dependencies -> backend
cd ../backend
npm install
```


### 3. Start a local dev environment

```bash
# Open two terminals, one for backend:
cd backend
npm run dev

# One for frontend:
cd frontend
npm run dev
```

Open up a web browser to the url `http://localhost:3000` and Enjoy!

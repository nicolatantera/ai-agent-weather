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




## 🔧 Running Locally
```bash
# Clone repository
git clone https://github.com/nicolatantera/ai-agent-weather.git
cd ai-weather-agent

# Install dependencies (frontend & backend)
cd frontend && npm install
cd .. && cd backend && npm install

# Start local dev environments
# For both backend and frontend:
npm run dev

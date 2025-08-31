# Chatbot DeepSeek - Streaming (Next.js)

Project template: Next.js app with streaming responses from DeepSeek (or OpenAI-compatible API),
typing indicator, and ready to deploy on Vercel.

## Files
- `app/page.js` - Frontend chat UI (streaming & typing indicator)
- `app/api/chat/route.js` - Serverless API route that forwards streaming responses
- `components/TypingDots.js` - Typing indicator component
- `.env.example` - Example env variables

## Setup
1. Copy `.env.example` -> `.env.local` and set `DEEPSEEK_API_KEY`.
2. Install dependencies:
   ```
   npm install
   ```
3. Run dev:
   ```
   npm run dev
   ```
4. Deploy to Vercel (connect repo and add Environment Variable `DEEPSEEK_API_KEY`).

## Notes
- The backend forwards streaming tokens as `text/plain` to the client.
- Adjust the DeepSeek API endpoint/model if needed.

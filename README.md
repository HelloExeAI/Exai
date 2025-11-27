# EXEAI - AI Executive Assistant

EXEAI is a next-generation, AI-powered Executive Assistant designed to solve the #1 problem professionals face: **FORGETTING**.

## Features

- 🤖 AI-powered note parsing and task suggestions
- 🎙️ Voice recording with automatic transcription (Whisper API)
- 📝 Roam-style note-taking with slash commands
- ✅ Smart task management with priority and follow-ups
- 📊 Daily/Weekly AI-generated summaries
- 🌤️ Weather-integrated clock widget
- 📅 Calendar integration (coming soon)
- 💰 Expense tracking and categorization

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **AI:** OpenAI GPT-4 & Whisper
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account (for PostgreSQL database)
- OpenAI API key
- OpenWeather API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/exeai.git
cd exeai
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file with your credentials:
```env
DATABASE_URL="your_supabase_connection_string"
NEXTAUTH_URL="http://localhost:3002"
NEXTAUTH_SECRET="your_secret_here"
OPENAI_API_KEY="your_openai_key"
OPENWEATHER_API_KEY="your_weather_key"
```

4. Push database schema:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3002](http://localhost:3002) in your browser.

## Deployment

This app is optimized for Vercel deployment. See [DEPLOYMENT.md](./DEPLOYMENT.md) for details.

## License

Proprietary - All rights reserved

## Contact

Built by Farooq - [Your Contact Info]
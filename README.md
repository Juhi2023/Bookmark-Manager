# Bookmark Manager

A modern, real-time bookmark manager built with Next.js 15, Supabase, and Tailwind CSS.


## Features

- Google Authentication 
- Add & Delete bookmarks
- Real-time sync
- Production ready — Deployed on Vercel

## 🚀 Live Demo

**[https://bookmark-manager-juhi.vercel.app](https://bookmark-manager-juhi.vercel.app)**


## 🛠️ Tech Stack
- Next.js
- React
- Supabase
- Tailwind CSS
- Vercel

## 🏗️ Project Structure

```
bookmark-manager/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main app (auth + bookmarks UI)
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css            # Global styles
│   │   └── auth/
│   │       ├── callback/
│   │           └── route.ts       # OAuth callback handler

│   ├── lib/
│   │   ├── supabase-browser-client.ts     # Browser client
│   │   └── supabase-server-client.ts     # Server client for SSR
│   ├── middleware.ts               # Session refresh middleware
│   └── components/                # (optional) reusable components
├── supabase/
│   └── schema.sql                 # Database schema + RLS policies
├── public/                        # Static assets
├── .env.local.example             # Environment variables template
├── README.md                      # This file
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A [Supabase](https://supabase.com) account
- A [Google Cloud](https://console.cloud.google.com) account (for OAuth)

### 1. Clone the Repository

```bash
git clone https://github.com/Aazen45v/bookmark-manager.git
cd bookmark-manager
npm install
```

### 2. Supabase Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **"New Project"**
3. Enter:
   - **Name:** `bookmark-manager`
   - **Password:** Generate and save a strong password
4. Wait for project creation (~1 minute)

#### Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and run the contents of `supabase/schema.sql`:

```sql
-- Create bookmarks table with Row Level Security (RLS)
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies for user data isolation
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);
```

#### Enable Google Auth

1. Go to **Authentication** → **Providers** → **Google**
2. Toggle **Enable Google** to ON

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the **Google+ API** or **People API**
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Configure:
   - **Application type:** Web application
   - **Name:** `bookmark-manager`
   - **Authorized redirect URI:**
     ```
     https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/auth/v1/callback
     ```
6. Copy **Client ID** and **Client Secret**
7. Paste them in Supabase **Authentication** → **Google** settings

### 4. Enable Realtime

1. In Supabase Dashboard, go to **Database** → **Replication**
2. Enable replication for the `bookmarks` table

### 5. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> **Important:** For production deployment on Vercel, add these variables in your Vercel project settings under Environment Variables.

### 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)


## 📝 Database Schema

```sql
Table: bookmarks
- id: UUID (PRIMARY KEY)
- user_id: UUID (REFERENCES auth.users)
- url: TEXT (NOT NULL)
- title: TEXT (NOT NULL)
- created_at: TIMESTAMP WITH TIME ZONE
```

### RLS Policies

| Operation | Policy |
|-----------|--------|
| SELECT | User can only view own bookmarks |
| INSERT | User can only insert their own bookmarks |
| DELETE | User can only delete their own bookmarks |
# Grammer Cricket Club AI Manager

A static frontend app for cricket club operations with:

- email signup/login via Supabase
- clubs, players, venues, matches, and users
- home and away XI management
- captain, vice captain, and wicketkeeper roles
- result tracking tied to the saved match XI
- AI-style match and result poster generation
- Vercel-ready static deployment

## Project Files

- `index.html` - app shell and UI
- `style.css` - styling
- `app.js` - frontend logic
- `supabase.js` - Supabase client and SQL schema
- `config.js` - runtime Supabase config
- `vercel.json` - Vercel static deployment config

## Before Deployment

### 1. Set Supabase Config

Edit `config.js`:

```js
window.APP_CONFIG = {
  SUPABASE_URL: 'https://YOUR_PROJECT.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_PUBLISHABLE_KEY',
};
```

Use the Supabase publishable key, not the secret key.

### 2. Run The Supabase Schema

Open `supabase.js`, copy the SQL inside the `schemaSQL` string, and run it in the Supabase SQL Editor.

This creates:

- `profiles`
- `teams`
- `players`
- `venues`
- `matches`
- `lineups`
- `results`
- storage buckets and policies

### 3. Configure Supabase Auth URL

In Supabase:

- `Authentication` -> `URL Configuration`
- set `Site URL` to your final Vercel URL

Example:

- `https://grammer-cricket-club-ai-manager.vercel.app`

## Deploy To Vercel

### Option A: Vercel CLI

From this folder:

```powershell
vercel
vercel --prod
```

### Option B: GitHub Import

1. Push this project to a GitHub repository
2. In Vercel, click `Add New...` -> `Project`
3. Import the repository
4. Framework preset: `Other`
5. Build command: leave empty
6. Output directory: leave empty
7. Deploy

## Testing Checklist

After deployment:

1. Sign up
2. Confirm email if confirmation is enabled
3. Log in
4. Create a club
5. Create players
6. Create a venue
7. Create a match
8. Build home and away XI
9. Save a result
10. Generate posters

## Important Notes

- This is a static frontend app
- Supabase publishable key is safe for browser use
- Never put your Supabase secret key into `config.js`

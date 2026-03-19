# Grammer Cricket Club AI Manager

A full-stack-style cricket club management web app built with:

- Vanilla HTML, CSS, and JavaScript
- Supabase Auth, Database, and API
- HTML poster generation with PNG download

## Features

- Email login, signup, logout, and password reset
- Admin and user access levels
- Saved clubs with logos
- Saved venues/grounds with addresses and multiple images
- Saved players linked to clubs
- Match creation from saved clubs and grounds
- Playing XI management with weekly player availability rules
- Result entry with:
  - scores
  - winner
  - summary
  - player of the match
  - best scorer
  - player spotlight styles
- Match posters with:
  - 5 generated themes
  - venue picture selection
  - sponsor images
  - saved social links
- Result posters with:
  - sponsor images
  - saved social links
  - player of the match and best scorer spotlight cards

## Project Files

- `index.html` - app UI
- `style.css` - styling and poster themes
- `app.js` - main frontend logic
- `supabase.js` - Supabase client setup and SQL schema
- `config.js` - runtime Supabase config
- `vercel.json` - static deployment config
- `DEPLOY-VERCEL.md` - Vercel deployment guide

## Local Setup

### 1. Configure Supabase

Edit `config.js`:

```js
window.APP_CONFIG = {
  SUPABASE_URL: 'https://YOUR_PROJECT.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_PUBLISHABLE_KEY',
};
```

Use the Supabase publishable key only. Do not use the secret service-role key in this frontend app.

### 2. Run the SQL Schema

Open `supabase.js`, copy the `schemaSQL` string, and run it in the Supabase SQL Editor.

This creates the app tables including:

- `profiles`
- `teams`
- `venues`
- `players`
- `social_links`
- `matches`
- `lineups`
- `results`

### 3. Open the App

Open `index.html` in your browser after updating `config.js`.

## Deploy to Vercel

Use the guide in `DEPLOY-VERCEL.md`.

Quick version:

1. Push this repo to GitHub
2. Import it into Vercel
3. Framework preset: `Other`
4. Leave build/output settings empty
5. Deploy

Then update Supabase Auth settings:

- `Authentication` -> `URL Configuration`
- set your Vercel production URL as the `Site URL`

## Notes

- This is a browser-based app using Supabase directly from the frontend
- Local image uploads used in result posters work in the current browser session
- True AI image editing or outfit conversion is not connected yet and would require an external image API

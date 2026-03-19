# Deploy To Vercel

## 1. Update Supabase Config

Open `config.js` and set:

```js
window.APP_CONFIG = {
  SUPABASE_URL: 'https://YOUR_PROJECT.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_PUBLISHABLE_KEY',
};
```

Do not use your Supabase secret key in this frontend app.

## 2. Run The Supabase Schema

Open `supabase.js`, copy the SQL inside `schemaSQL`, and run it in the Supabase SQL Editor.

## 3. Deploy On Vercel

### Option A: Import Project
- Push this project to GitHub
- In Vercel, click `Add New...` -> `Project`
- Import the repository
- Framework preset: `Other`
- Root directory: this project folder
- Build command: leave empty
- Output directory: leave empty
- Deploy

### Option B: Drag And Drop
- Zip the project folder
- In Vercel, create a new static deployment and upload it

## 4. Set Supabase Auth URLs

In Supabase `Authentication` -> `URL Configuration`:
- `Site URL` = your Vercel production URL
- Add the same Vercel URL to redirect URLs if needed

Example:
- `https://your-project-name.vercel.app`

## 5. Test

- Sign up
- Confirm email if enabled
- Log in
- Create club, players, venue, match
- Set home and away XI
- Save result

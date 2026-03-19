# Deploy To Vercel

## 1. Update Supabase Config

Edit `config.js`:

```js
window.APP_CONFIG = {
  SUPABASE_URL: 'https://YOUR_PROJECT.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_PUBLISHABLE_KEY',
};
```

Use the Supabase publishable key only.

## 2. Run the Supabase Schema

Open `supabase.js`, copy the `schemaSQL` string, and run it in the Supabase SQL Editor.

## 3. Import Into Vercel

1. Open Vercel
2. Click `Add New...` -> `Project`
3. Import this GitHub repository
4. Framework preset: `Other`
5. Root directory: project root
6. Build command: leave empty
7. Output directory: leave empty
8. Deploy

## 4. Set Supabase Auth URLs

In Supabase:

1. Open `Authentication` -> `URL Configuration`
2. Set `Site URL` to your Vercel production URL
3. Add the same URL to redirect URLs if needed

Example:

- `https://your-project-name.vercel.app`

## 5. Test After Deploy

1. Sign up
2. Log in
3. Create clubs, venues, and players
4. Create a match
5. Build a lineup
6. Save a result
7. Generate match and result posters

## Important

- This is a static frontend deployment
- Never place a Supabase secret key in `config.js`

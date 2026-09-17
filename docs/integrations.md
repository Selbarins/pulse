# Vercel + Supabase Integration Instructions

Follow these steps once. After that, every `git push` to `main` deploys automatically.

---

## 1. Supabase Project

1. Go to [https://supabase.com](https://supabase.com) → New Project.
2. Name it `pulse`, choose a region close to you, set a strong DB password (save it).
3. Wait for the project to finish provisioning.
4. In **Project Settings → API**:
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret)
5. (Optional but recommended) Install Supabase CLI locally:
   ```bash
   npm install -g supabase
   supabase login
   supabase link --project-ref <your-project-ref>
   ```
6. Apply migrations when ready:
   ```bash
   supabase db push
   ```
   or paste the SQL from `supabase/migrations/` into the SQL Editor.

---

## 2. Auth (single user)

1. In Supabase Dashboard → **Authentication → Providers**.
2. Enable Email (or Magic Link). Disable public sign-ups if you want (only you will create the account).
3. Create your user via the dashboard or the first login flow.
4. Later you can add Row Level Security (RLS) policies so only your `auth.uid()` can read/write rows.

---

## 3. Vercel Project

1. Go to [https://vercel.com](https://vercel.com) → Add New → Project.
2. Import the GitHub repo `Selbarins/pulse`.
3. Framework Preset: **Next.js** (auto-detected).
4. Root Directory: leave blank.
5. Environment Variables — add these three:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | from Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | from Supabase (server-only) |

6. Deploy. Vercel will give you a `*.vercel.app` URL.
7. (Optional) Add a custom domain later.

---

## 4. Local Development

```bash
git clone https://github.com/Selbarins/pulse.git
cd pulse
cp .env.example .env.local
# fill the three variables
npm install
npm run dev
```

Open http://localhost:3000.

---

## 5. Daily Workflow

- Edit code → commit → push to `main` → Vercel rebuilds in ~30 s.
- Schema changes → new file under `supabase/migrations/` → `supabase db push` (or run in SQL Editor).
- Never commit `.env.local` or the service-role key.

---

## 6. Future hardening (when ready)

- Enable RLS on every table.
- Restrict service-role usage to API routes only.
- Add a simple middleware that redirects unauthenticated users to `/login`.
- Generate TypeScript types:
  ```bash
  npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
  ```

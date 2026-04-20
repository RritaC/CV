# Private portfolio metrics – research (not implemented)

Ways to add metrics that **only you** can see, without exposing them to visitors:

---

## 1. **Analytics dashboard (separate login)**

Use a privacy-friendly analytics tool that only you access:

- **Plausible** or **Fathom** – no cookies, GDPR-friendly; you log in to their dashboard to see page views, referrers, countries, devices. Add their script to your site; data is visible only in your account.
- **Google Analytics 4** – create a property and only share the dashboard with yourself; use a minimal/cookieless setup if you care about privacy.
- **Netlify Analytics** (if you host on Netlify) – traffic stats visible only in the Netlify dashboard for your site.

**Pros:** No code for “hiding” metrics; they’re just in a separate product.  
**Cons:** Usually paid (or limits) for detailed data.

---

## 2. **Secret URL or query parameter**

Create a second page (e.g. `yoursite.com/stats` or `yoursite.com?key=your-secret`) that only you know. That page shows a simple dashboard (e.g. “Page views: X”) fed by:

- The same analytics tool (embed or link to Plausible/GA), or
- Your own backend that logs visits and only returns data when the secret key is present.

**Pros:** Full control; you’re the only one who opens that URL.  
**Cons:** You need a backend or serverless function to store/count events if you want custom metrics.

---

## 3. **Backend + auth (only you logged in)**

Store events (e.g. “portfolio page view”, “link click”) in a database or logging service. Build a small “admin” or “stats” page that:

- Requires login (password or OAuth).
- Only you have the credentials.
- Shows tables/charts of visits, clicks, etc.

**Pros:** Fully private, flexible metrics.  
**Cons:** Requires backend, auth, and hosting (e.g. Vercel + serverless + DB, or a small app).

---

## 4. **Client-side logging to a private endpoint**

Send anonymized events (e.g. “portfolio opened”, “project X clicked”) from the browser to a serverless function or backend you control. No UI for metrics on the public site; you view data in a spreadsheet, DB dashboard, or a private stats page (with secret URL or login as above).

**Pros:** You see exactly what you care about (e.g. which portfolio links get clicks).  
**Cons:** Need to build the endpoint and somewhere to view the data.

---

## Free options (only you see the data)

- **Google Analytics 4** – Free. Create a property, add the script to your site, and only you (or people you invite) can log in to the GA dashboard. No cost.
- **Netlify Analytics** – Free on some Netlify plans. If your site is on Netlify, check your plan; traffic stats are only in your Netlify dashboard.
- **Umami** – Open source, free to self-host (e.g. on Railway, Render, or a VPS). You host it and you’re the only one with access. No cookies, lightweight.
- **Simple backend + spreadsheet** – Free tier of Vercel/Netlify serverless + Airtable/Google Sheets: log a “visit” or “click” event; only you open the sheet or a secret stats page.

---

## Recommendation (free-first)

- **Easiest free option:** **Google Analytics 4**. Free, you’re the only one who logs in to the dashboard; nothing is shown on the site.
- **If you’re on Netlify:** Check **Netlify Analytics** on your plan; same idea, dashboard-only.
- **No cookies / self-hosted:** **Umami** (self-host for free); only you have the login.

No implementation was added to the project; the above is research only.

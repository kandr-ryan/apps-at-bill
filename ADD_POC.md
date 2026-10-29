# Adding a New POC to the Monorepo

All POCs share the same Firebase project (`rlibbey-pocs`) and git repo (`kandr-ryan/pocs`). Each gets its own Firebase Hosting site with a unique subdomain (e.g., `your-poc.web.app`).

## Quick reference

| Item | Value |
|------|-------|
| Firebase project | `rlibbey-pocs` |
| Firebase console | https://console.firebase.google.com/project/rlibbey-pocs/overview |
| GitHub repo | https://github.com/kandr-ryan/pocs |
| Monorepo root | `~/Apps/pocs/` |
| Existing POCs | `ai-localization` → https://ai-localization-poc.web.app |

---

## Step-by-step

### 1. Move the project into the monorepo

From the `Apps/` directory, move your project folder into `pocs/`:

```bash
cd ~/Apps
mv <your-project> pocs/<your-project>
```

The monorepo structure should look like:

```
pocs/
├── .gitignore
├── firebase.json
├── .firebaserc
├── firestore.rules
├── functions/
├── ai-localization/          <-- existing POC
├── <your-project>/           <-- new POC
│   ├── package.json
│   ├── src/
│   └── ...
```

### 2. Verify the build works

```bash
cd ~/Apps/pocs/<your-project>
npm install
npm run build
```

Make sure static output lands in the expected directory (see framework notes below).

### 3. Create a Firebase Hosting site

Pick a globally unique site ID -- it becomes the `*.web.app` subdomain:

```bash
cd ~/Apps/pocs
firebase hosting:sites:create <site-id> --project rlibbey-pocs
```

### 4. Apply the deploy target

```bash
firebase target:apply hosting <target-name> <site-id> --project rlibbey-pocs
```

Use the same value for `<target-name>` and `<site-id>` to keep things simple. This auto-updates `.firebaserc`.

### 5. Add a hosting entry to firebase.json

Open `firebase.json` and add a new object to the `hosting` array:

```json
{
  "target": "<target-name>",
  "public": "<your-project>/<build-output-dir>",
  "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
  "rewrites": [
    { "source": "**", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "**/*.@(js|css|svg|png|jpg|jpeg|gif|webp|woff2)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "index.html",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }
      ]
    }
  ]
}
```

Replace `<build-output-dir>` with the framework's output directory (see table below).

Remove the `rewrites` block if the app does **not** use client-side routing.

### 6. Build and deploy

```bash
cd <your-project> && npm run build && cd ..
firebase deploy --only hosting:<target-name>
```

Your POC is now live at `https://<site-id>.web.app`.

### 7. Commit and push

```bash
cd ~/Apps/pocs
git add .
git commit -m "Add <your-project> POC"
git push
```

---

## Framework-specific notes

| Framework | Build command | Output directory | Extra config needed |
|-----------|--------------|------------------|---------------------|
| **Vite / React** | `npm run build` | `dist` | None |
| **Next.js** | `npm run build` | `out` | Must enable static export (see below) |
| **Angular** | `npm run build` | `dist/<project-name>` | None (check `angular.json` → `outputPath`) |
| **Create React App** | `npm run build` | `build` | None |

### Next.js: enable static export

Firebase Hosting serves static files only. Next.js defaults to server-side rendering, so you must configure it for static export.

In `next.config.ts` (or `next.config.js`):

```typescript
const nextConfig = {
  output: 'export',
  // If the app is NOT at the root of its domain, set basePath:
  // basePath: '/sub-path',
}
export default nextConfig
```

After adding `output: 'export'`, `npm run build` will produce an `out/` directory instead of `.next/`. Use `out` as the `public` path in `firebase.json`.

**Note:** Static export does not support Next.js features that require a server: API routes, middleware, ISR, server components with dynamic data, `getServerSideProps`. If your app uses these, you'd need Firebase Cloud Run instead (not covered here).

### Angular: find the output path

Check `angular.json` → `projects.<name>.architect.build.options.outputPath`. It's typically `dist/<project-name>`. The `public` path in `firebase.json` should point there:

```
"public": "bill-kyc/kyc-app/dist/kyc-app"
```

If the Angular project lives in a subfolder (e.g., `bill-kyc/kyc-app/`), run the build from that subfolder:

```bash
cd bill-kyc/kyc-app && npm install && npm run build && cd ../..
```

---

## Re-deploying after changes

```bash
cd <your-project> && npm run build && cd ..
firebase deploy --only hosting:<target-name>
git add . && git commit -m "Update <your-project>" && git push
```

## Deploying all POCs at once

```bash
firebase deploy --only hosting
```

---

## Pending POCs

| Project | Source | Framework | Suggested site ID | Build output |
|---------|--------|-----------|-------------------|--------------|
| app-automation | `~/Apps/app-automation` | Next.js | `app-automation-poc` | `out` (after static export) |
| bill-kyc | `~/Apps/bill-kyc` | Angular (in `kyc-app/` subfolder) | `bill-kyc-poc` | `kyc-app/dist/kyc-app` |

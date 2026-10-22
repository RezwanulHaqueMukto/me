# Rezwanul Haque — Portfolio

A responsive developer portfolio built from scratch with React, Vite, and plain CSS. Project descriptions, project screenshots, certificate links, experience, and professional contact links were carried over from the supplied HTML portfolio demo and reorganized into a new component structure and visual system.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`.

## Deploy to GitHub Pages

1. Create a GitHub repository for this project.
2. In `vite.config.js`, make sure `base` matches the repository name, including leading and trailing slashes. For a repository named `rez-portfolio`, use `base: '/rez-portfolio/'`. For a GitHub user/organization site named `USERNAME.github.io`, use `base: '/'`.
3. Add the included workflow `.github/workflows/deploy.yml` (already configured) and push the project to the repository's default branch.
4. In GitHub, open **Settings → Pages** and choose **GitHub Actions** as the build and deployment source.
5. Wait for the workflow to finish; the deployed URL will appear in the Pages settings.

## Before publishing

- Confirm the exact experience dates and wording.
- Verify that every client project is okay to show publicly.
- Check the project URLs and certificate credentials.
- Replace the illustrated portrait if you'd prefer a current professional photo.
- Update `base` if the repository name changes.

## Accessibility and responsive behavior

- Mobile navigation with keyboard Escape support and correct `aria-expanded` state.
- Skip-to-content link, visible focus states, semantic landmarks, and descriptive image alt text.
- Responsive layouts for narrow phones, tablets, laptops, and large screens.
- Reduced-motion preferences are respected.
- Project cards support category filtering and text search.

## Stack

- React
- Vite
- Plain CSS (no utility or component framework)
- GitHub Actions for deployment

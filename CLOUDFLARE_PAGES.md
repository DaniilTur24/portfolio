# Cloudflare Pages deployment

This repository is a static website. It does not need a Node.js server in production.

## Cloudflare Pages settings

- Production branch: `main`
- Build command: `exit 0`
- Build output directory: `.`

## Custom domain

Attach `turovskiy.dev` in **Workers & Pages → portfolio → Custom domains**. The domain is already served through Cloudflare, so activate it in Pages before replacing its existing DNS origin.

## Cutover checklist

1. Create the Pages project from this GitHub repository and confirm the generated `pages.dev` URL works.
2. Open the home page and every portfolio case-study page on the preview URL.
3. Attach `turovskiy.dev` in Pages and wait for it to become active.
4. Verify HTTPS, images, navigation and the contact links on the custom domain.
5. Only then remove the Railway custom domain and retire its service.

Git-connected Pages builds a preview for pull requests and deploys `main` to production.

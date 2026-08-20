# Heart & Soul Signature Mums — Owner-Editable Website

This version has a real CMS admin panel at `/admin/`. The business owner can edit prices, homepage text, policies, rush fees, promo codes, and gallery photos without editing HTML or JavaScript.

## Why this setup uses GitHub login
Netlify's Git Gateway is deprecated for new configurations. This package uses Decap CMS's GitHub backend instead. Each website editor should have a GitHub account and be added as a collaborator with write access to the site repository.

## One-time setup

1. Create a free GitHub repository named `heart-and-soul-mums`.
2. Upload every file/folder in this package to the repository's `main` branch.
3. Open `admin/config.yml` in GitHub and replace `YOUR_GITHUB_USERNAME/heart-and-soul-mums` with the real repository path. Commit the change.
4. In Netlify, create/import a site **from Git** and choose that GitHub repository. Do not use manual drag-and-drop for the CMS version.
5. In GitHub: Settings → Developer settings → OAuth Apps → New OAuth App. Use:
   - Homepage URL: your Netlify/custom website URL
   - Authorization callback URL: `https://api.netlify.com/auth/done`
6. Copy the GitHub OAuth Client ID and Client Secret.
7. In Netlify: Project configuration → Access & security → OAuth → Install provider → GitHub. Paste the Client ID and Client Secret.
8. Add your grandmother/sister as GitHub repository collaborators (GitHub repo → Settings → Collaborators). They need write access.
9. Visit `https://YOUR-SITE/admin/` and choose Login with GitHub.

## Editing the website afterward

Go to `/admin/` → Heart & Soul Website Settings → Edit. Change a price, add a promo code, upload gallery photos, etc. Click Save/Publish. Decap commits the change to GitHub and Netlify automatically deploys the updated website.

## Important handoff rule if you ever sell a site
Transfer the GitHub repo, Netlify project, domain, payment processor account, database/order system, and any email account used by the website. Then the buyer truly controls the site.

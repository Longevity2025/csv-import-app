# How to Deploy Your App to GitHub Pages 

## Step 1: Create the Workflow File on GitHub

1. Go to your repository: https://github.com/Longevity2025/csv-import-app

2. Click **"Add file"** → **"Create new file"**

3. In the filename box, type exactly: `.github/workflows/deploy.yml`
   (This will automatically create the folders)

4. Copy and paste this entire content into the file:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

5. Click **"Commit changes"**

## Step 2: Enable GitHub Pages

1. In your repository, go to **Settings** (top menu)

2. Click **"Pages"** in the left sidebar

3. Under **"Source"**, select **"GitHub Actions"** from the dropdown

4. Click **Save**

## Step 3: Trigger Deployment

The workflow will run automatically after you commit the file. You can check progress:

1. Go to the **"Actions"** tab in your repository
2. You'll see the workflow running
3. Once complete (green checkmark), your site will be live at:

**https://longevity2025.github.io/csv-import-app/**

---

That's it! Any future changes you push to the main branch will automatically redeploy.

# Instructions to Add This App to Your GitHub Repository

## Overview
You have a monorepo structure with multiple apps as subdirectories. This guide shows you how to add your third app to the existing `mobility-age-app` repository.

## Steps

### 1. Navigate to your local repository folder
Open Terminal/Command Prompt and go to where you cloned `mobility-age-app`:

```bash
cd path/to/mobility-age-app
```

### 2. Create a new folder for this app
Choose a descriptive name (e.g., `csv-import-app` or `data-manager`):

```bash
mkdir csv-import-app
cd csv-import-app
```

### 3. Copy all files from Bolt
Download your Bolt project as a ZIP:
- In Bolt, click the menu (top-right)
- Select "Download as ZIP"
- Extract the ZIP
- Copy ALL contents into your `csv-import-app` folder

### 4. Add the `.env` file
Create a `.env` file inside `csv-import-app/` with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**IMPORTANT:** Make sure `.env` is in your `.gitignore` (it should already be there)

### 5. Commit and push

```bash
cd ..  # Go back to repository root
git add csv-import-app/
git commit -m "Add CSV import app"
git push origin main
```

## Result
Your repository will now have three apps:
- `mobility-age/`
- `ymca-3mst/`
- `csv-import-app/` (or whatever you named it)

Each app can be deployed independently from its own subdirectory.

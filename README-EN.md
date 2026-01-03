[![banner](/docs/banner.png)](https://tmoji.org)

# TMOJI WEB (Frontend)

> An image translation service that preserves original font styles

### [Visit the TMOJI Website](https://tmoji.org)

![Demo Preview](./docs/example.gif)

#### [TMOJI Server API Documentation](https://api.tmoji.org/docs)

#### [TMOJI UI/UX Design (Figma)](https://www.figma.com/design/JvbYnuSH3OT1lQWxcJpusq/TMOJI?node-id=67-2&t=VsGnnqBIsh5wtLi5-1)

- This repository contains the frontend implementation of TMOJI, an image translation service that preserves original font styles.


# Requirements

```bash
vscode
node.js 22.19.0
pnpm 10.15.1
```

# How to start

If pnpm is not installed, install it globally using npm:

```bash
npm i -g pnpm
```
This project uses **pnpm** as the package manager.

Install the required dependencies:

```bash
pnpm i
```

Run the project using the commands below:

```bash
# Run in development mode
pnpm dev

# Build the project
# The built files will be located in the @/dist directory
pnpm build

# Preview the production build
pnpm serve

```

# Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

# Linting & Formatting

This project uses [ESlint](https://eslint.org/) and [Prettier](https://prettier.io/) for linting and formatting.
ESLint configuration is managed using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint).

Available commands:
```bash
pnpm lint
pnpm format
pnpm check
```

# Routing

Routing is handled using [TanStack Router](https://tanstack.com/router).
- File-based routing
- Routes are managed under `src/routes`
- New routes can be added by creating files or folders in this directory

# Data Fetching

This project uses React Query (TanStack Query) for server communication.

- `useQuery` is used for data fetching (e.g., GET)
- `useMutation` is used for data modification (e.g., POST, PATCH)

For more details, refer to the official documentation:
[React Query Documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

# Project Structure

```bash
📁 .github/workflows        # GitHub Actions workflows
📁 .husky                   # Git hooks for linting & formatting
📁 .tanstack                # Auto-managed TanStack Router files
📁 .vscode                  # VS Code configuration
📁 dist                     # Build output directory
📁 docs                     # Documentation assets
📁 node_modules             # Installed dependencies
📁 public                   # Static assets (Vite)
📁 src
 ├ 📁 api                   # API hooks and interfaces
 ├ 📁 assets                # Icons and images
 ├ 📁 components            # Shared components
 ├ 📁 constants             # Shared constants
 ├ 📁 integrations          # TanStack Query configuration
 ├ 📁 routes                # Route definitions (pages)
 ├ 📁 utils                 # Shared hooks and utilities
 ├ 📄 main.tsx              # Application entry point
 ├ 📄 reportWebVitals.ts
 ├ 📄 routeTree.gen.ts
 └ 📄 styles.css            # Global styles
📄 .cta.json
📄 .env                     # Environment variables
📄 .gitignore
📄 .prettierignore
📄 eslint.config.js         # ESLint configuration
📄 index.html               # Root HTML file
📄 package.json
📄 pnpm-lock.yaml
📄 prettierrc.cjs           # Prettier configuration
📄 README.md

```

# Environment Variables
``` bash
# .env

VITE_API_URL=YOUR_BE_SERVER_URL # https://api.tmoji.org
```

# CI/CD
This project is automatically deployed using **GitHub Actions**.
See `.github/workflows/deploy.yml` for details.

When a pull request is merged from `main` to `prod`, GitHub Actions will:
1. Build the project
2. Upload the build output to an **AWS S3 bucket**
3. Invalidate the **AWS CloudFront cache** to update the deployed website

TMOJI Related Repositories
> Detailed implementations for each component can be found in the repositories below.

<table>
  <thead>
    <tr>
      <th>Category</th>
      <th>Repository</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3">Text Transformation Models</td>
      <td><a href='https://github.com/PNU-CSE-Graduation-TMOJI/TextCtrl-Translate'>TextCtrl-Translate</a></td>
      <td>Fine-tuned text transformation model optimized for Korean</td>
    </tr>
    <tr>
      <td><a href='https://github.com/PNU-CSE-Graduation-TMOJI/ko_trocr_tr'>ko-trocr-tr</a></td>
      <td>Korean OCR model required for TextCtrl</td>
    </tr>
    <tr>
      <td><a href='https://github.com/PNU-CSE-Graduation-TMOJI/SRNet-Datagen_kr'>SRNet-Datagen (ko)</a></td>
      <td>Dataset generator for TextCtrl training</td>
    </tr>
    <tr>
      <td rowspan="2">Web Services</td>
      <td><a href='https://github.com/PNU-CSE-Graduation-TMOJI/tmoji-web'>TMOJI Web (Frontend)</a></td>
      <td>TMOJI frontend</td>
    </tr>
    <tr>
      <td><a href='https://github.com/PNU-CSE-Graduation-TMOJI/tmoji-server'>TMOJI Server (Backend)</a></td>
      <td>TMOJI backend</td>
    </tr>
  </tbody>
</table>

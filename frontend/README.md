# COVID-19 Detection Frontend

A Next.js frontend application for uploading X-ray images and detecting COVID-19 using the FastAPI backend.

## Features

- 🖼️ Image upload with preview
- 🔍 COVID-19 detection from chest X-ray images
- 📱 Responsive design
- ⚡ Fast and modern UI
- 🎨 Styled with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

By default, the app uses the deployed API at `https://covid-19-detection-1d3l.onrender.com`.

To use a local API, create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx         # Main page component (with Tailwind CSS)
│   └── globals.css      # Global styles with Tailwind directives
├── package.json
├── tsconfig.json
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
└── next.config.js
```


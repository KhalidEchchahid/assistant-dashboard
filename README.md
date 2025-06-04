# AI Assistant Dashboard

## 🚀 Overview

The AI Assistant Dashboard is a web application designed to manage and configure AI-powered voice assistants for your websites. It provides a user-friendly interface to add websites, manage data sources, monitor processing status, and integrate the AI assistant into your web pages. This dashboard complements the backend Voice Assistant Action Execution System, allowing for seamless control over the AI's knowledge base and behavior.

## ✨ Features

### Dashboard & Website Management

- **Secure Authentication:** Sign in with Google or GitHub.
- **Dashboard Overview:** At-a-glance view of total websites, system status, and API health.
- **Website Creation:** Easily add new websites by providing a name and domain.
- **Website Listing:** View, search, and manage all connected websites.
- **Individual Website View:** Detailed overview of each website, including status, data source count, processing status, and creation date.
- **Website Specific Settings:** Configure and manage settings for each website.
- **Delete Websites:** Remove websites and their associated configurations.

### Data Source Management

- **Multiple Data Source Types:** Add content to your AI assistant via URL, sitemap, file upload (PDF, JSON, TXT, Markdown), or custom text input.
- **Data Source Listing:** View all data sources for a specific website, including type, source, status (completed, error, processing, pending), and creation date.
- **Error Reporting:** Clear error messages for data source processing failures.
- **Delete Data Sources:** Remove individual data sources.

### AI Assistant Integration & Configuration

- **Website Scanning:** Initiate scans for websites to gather content (details available in `backend.md`).
- **Scanned Pages Overview:** View pages scanned for a website, their status, and any errors.
- **Embed Code Generation:** Get JavaScript, React, iFrame, and API code snippets to integrate the AI assistant chat widget or functionality into your website.
- **Customization Insights:** Information on theme options, positioning, and sizing for the chat widget.
- **API Key Management:** View and regenerate API keys for secure access to the AI assistant.
- **API Usage Information:** Details on API rate limits and example requests.

### Backend System (Refer to `backend.md` for full details)

- **Comprehensive Website Analysis:** Extracts data using Playwright.
- **RAG Storage & Querying:** Stores and retrieves website data for intelligent responses.
- **Natural Language Intent Processing:** Converts user intents to actionable commands.
- **Action Execution:** Enables the AI assistant to perform actions like clicks, typing, scrolling, and form interactions on web pages via `postMessage` communication.

### User Account & Application Settings

- **Account Information:** View user email, authentication provider, account type, and ID.
- **Preferences:** Customize dashboard experience (e.g., email notifications, dark mode).

## 🛠️ Tech Stack

### Frontend (Dashboard)

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Authentication:** NextAuth.js (Google & GitHub providers)
- **API Communication:** Custom API client (`apiClient`) for Next.js route handlers
- **State Management:** React Context API (for Auth, Sidebar), React Hooks (`useState`, `useEffect`)
- **UI Components:** Custom components built with shadcn/ui primitives (Cards, Tables, Dialogs, Forms, etc.)

### Backend (Voice Assistant - see `backend.md`)

- **Language:** Python 3.8+
- **Core Libraries:** LiveKit Agents, Playwright, LlamaIndex (RAG), OpenAI
- **Communication:** `postMessage` for frontend-backend interaction on the host webpage.
- **Data Storage:** Persistent RAG data storage.

## 📁 Project Structure (Dashboard - `app` directory)

```
/client-dahsboard
├── app/
│   ├── (auth)/                 # Authentication related pages (login, success)
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── success/page.tsx
│   ├── api/                    # Next.js API route handlers
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── data-sources/
│   │   │   ├── [id]/route.ts
│   │   │   └── route.ts
│   │   └── websites/
│   │       ├── [id]/
│   │       │   ├── data/route.ts
│   │       │   ├── data-sources/page.tsx
│   │       │   ├── embed/page.tsx
│   │       │   ├── page.tsx
│   │       │   ├── scan/
│   │       │   │   ├── page.tsx
│   │       │   │   └── route.ts (Note: POST for scan, GET for scanned-pages)
│   │       │   ├── scanned-pages/route.ts
│   │       │   ├── settings/page.tsx
│   │       │   └── sources/route.ts (Alias for data-sources)
│   │       ├── new/page.tsx
│   │       └── route.ts
│   ├── dashboard/              # Main dashboard layout and pages
│   │   ├── api-keys/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Dashboard home
│   │   ├── settings/page.tsx
│   │   └── websites/
│   │       ├── [id]/...       # Dynamic routes for individual website management
│   │       ├── new/page.tsx
│   │       └── page.tsx       # Websites list
│   ├── debug/page.tsx          # Authentication debug page
│   ├── test-db/page.tsx        # Database setup testing page
│   ├── globals.css
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing/Home page
├── components/                 # Reusable UI components
│   ├── Layout/                 # Layout specific components (header, sidebar)
│   ├── ui/                     # shadcn/ui components
│   ├── add-data-source-button.tsx
│   ├── api-key-section.tsx
│   ├── api-keys-list.tsx
│   ├── auth-debug.tsx
│   ├── dashboard-cards.tsx
│   ├── dashboard-header.tsx
│   ├── data-sources-list.tsx
│   ├── embed-code-section.tsx
│   ├── home-page.tsx
│   ├── login-form.tsx
│   ├── logo.tsx
│   ├── mode-toggle.tsx
│   ├── new-website-form.tsx
│   ├── notifications.tsx
│   ├── search.tsx
│   ├── settings-form.tsx
│   ├── theme-provider.tsx
│   ├── user-nav.tsx
│   ├── website-header.tsx
│   ├── website-overview.tsx
│   ├── website-scanner.tsx
│   ├── website-settings.tsx
│   ├── website-tabs.tsx
│   ├── websites-list.tsx
│   └── websites-page.tsx
├── auth.ts                     # NextAuth.js configuration
├── contexts/                   # React Context providers (e.g., auth-context.tsx)
├── hooks/                      # Custom React hooks (e.g., use-toast.ts)
├── lib/                        # Libraries, helpers, and core logic
│   ├── actions/                # Server actions for database interactions
│   │   ├── data-sources.ts
│   │   ├── logout.ts
│   │   └── websites.ts
│   ├── api-client.ts           # API client for frontend-backend communication
│   ├── api.ts                  # (Potentially another API client or helper, check usage)
│   ├── db/                     # Database related files (schema, drizzle, migrations)
│   │   ├── drizzle.ts
│   │   ├── index.ts
│   │   ├── init.ts
│   │   └── schema.ts
│   └── utils.ts                # Utility functions (e.g., cn for classnames)
├── public/                     # Static assets
├── backend.md                  # Backend system documentation
└── README.md                   # This file
```

For backend file structure and details, please refer to `backend.md`.

## ⚙️ Setup and Installation

### Prerequisites

- Node.js (version recommended by Next.js, typically latest LTS)
- npm, yarn, or pnpm
- Python 3.8+ (for the backend system)
- OpenAI API Key
- LiveKit URL, API Key, and Secret (for the backend voice assistant)
- A PostgreSQL database (or other Drizzle-compatible database)

### Environment Variables

Create a `.env.local` file in the root of the `client-dahsboard` directory with the following variables:

```env
# NextAuth.js
AUTH_SECRET="your-very-secret-string-for-nextauth" # Generate a strong secret
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# Database (Drizzle ORM)
POSTGRES_URL="postgresql://user:password@host:port/database"
POSTGRES_HOST="your-db-host"
POSTGRES_USER="your-db-user"
POSTGRES_PASSWORD="your-db-password"
POSTGRES_DATABASE="your-db-name"

# Backend API (if different from dashboard or for widget.js)
NEXT_PUBLIC_API_URL="http://localhost:3000/api" # Or your deployed backend API URL

# OpenAI (for backend system)
OPENAI_API_KEY="your_openai_api_key_here"

# LiveKit (for backend system)
LIVEKIT_URL="your_livekit_url"
LIVEKIT_API_KEY="your_livekit_api_key"
LIVEKIT_API_SECRET="your_livekit_api_secret"
```

**Note:** Ensure the `AUTH_SECRET` is a long, random string. You can generate one using `openssl rand -hex 32`.

### Installation (Dashboard)

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd client-dahsboard
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```
3.  **Set up the database:**

    - Ensure your PostgreSQL server is running and accessible.
    - Update the `POSTGRES_*` variables in `.env.local`.
    - Initialize the database schema using Drizzle ORM. You might need to run migrations:
      ```bash
      npx drizzle-kit generate:pg # To generate migration files based on schema changes
      npx drizzle-kit push:pg     # To push schema changes to the database (for development)
      # or apply migrations if you have a migration script
      ```
    - You can test the database setup by navigating to `/test-db` in your browser after starting the dev server.

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    The application should now be running on `http://localhost:3000`.

### Installation (Backend Voice Assistant)

Refer to the `Installation & Setup` section in `backend.md`.

## 📡 API Routes (Next.js Backend)

The dashboard uses Next.js API routes to handle backend operations. These are located in `app/api/`.

- **Authentication:**
  - `GET /api/auth/[...nextauth]`
  - `POST /api/auth/[...nextauth]` (Handles NextAuth.js operations)
- **Data Sources:**
  - `POST /api/data-sources`: Upload a new data source.
  - `DELETE /api/data-sources/{id}`: Delete a specific data source.
  - `GET /api/websites/{websiteId}/sources`: Get all data sources for a website (alias for `GET /api/websites/{websiteId}/data-sources`).
  - `GET /api/websites/{websiteId}/data-sources`: Get all data sources for a website.
- **Websites:**
  - `GET /api/websites`: Get a list of all websites.
  - `POST /api/websites`: Create a new website.
  - `GET /api/websites/{id}/data`: Get analytical data for a specific website.
  - `POST /api/websites/{id}/scan`: Initiate a scan for a specific website.
  - `GET /api/websites/{id}/scanned-pages`: Get the scanned pages for a specific website.

## 🎨 Frontend Components

The frontend is built using a rich set of reusable components, primarily from `shadcn/ui` and custom-built components found in the `/components` directory. Key components include:

- **Layout:** `DashboardLayout`, `DashboardHeader`, `DashboardSidebar`
- **Dashboard Specific:** `DashboardCards`, `WebsitesList`, `ApiKeysList`
- **Website Specific:** `WebsiteHeader`, `WebsiteTabs`, `DataSourcesList`, `EmbedCodeSection`, `WebsiteScanner`, `WebsiteSettings`
- **Forms & Inputs:** `NewWebsiteForm`, `SettingsForm`, `AddDataSourceButton`
- **Authentication:** `LoginForm`, `AuthDebug` (for development)
- **UI Primitives (`components/ui`):** Button, Card, Dialog, Input, Table, Tabs, DropdownMenu, Skeleton, etc.

## 🔐 Authentication

Authentication is handled by NextAuth.js, supporting:

- Google OAuth
- GitHub OAuth

Session management and protected routes are implemented in `app/dashboard/layout.tsx` and through NextAuth.js middleware/callbacks defined in `auth.ts`.

## ☁️ Deployment

To deploy the Next.js dashboard:

1.  Ensure all environment variables are correctly set in your deployment environment.
2.  Build the application:
    ```bash
    npm run build
    # or
    yarn build
    # or
    pnpm build
    ```
3.  Start the production server:
    `bash
    npm run start
    # or
    yarn start
    # or
    pnpm start
    `Consider platforms like Vercel (from the creators of Next.js) or Netlify for easy deployment of Next.js applications. For the backend Python system, refer to`backend.md` for deployment considerations.

## 🐛 Troubleshooting

- **Authentication Issues:**
  - Double-check your `AUTH_SECRET`, `AUTH_GOOGLE_ID/SECRET`, and `AUTH_GITHUB_ID/SECRET` environment variables.
  - Ensure the callback URLs are correctly configured in your Google Cloud Console and GitHub OAuth App settings.
  - Use the `/debug` page for insights into the auth state.
- **Database Connection:**
  - Verify your `POSTGRES_URL` or individual `POSTGRES_*` variables are correct and your database server is accessible.
  - Check database logs for any connection errors.
  - Use the `/test-db` page to verify table creation and connectivity.
- **API Route Errors:**
  - Check the browser's developer console for network errors.
  - Inspect the terminal output of your Next.js development server for backend errors.
- **Data Source Processing Failures:**
  - Check the `Data Sources` list for specific error messages.
  - Ensure the backend Python services (Playwright, RAG manager) are running correctly and have access to necessary resources (e.g., internet for fetching URLs, correct file paths).

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the existing style and includes tests where applicable.
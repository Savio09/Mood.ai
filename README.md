# Mood Journal Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Overview

The Mood Journal Application is designed to help users track their mood and journal entries over time. It provides features for creating, updating, and analyzing journal entries. The application uses AI to analyze the content of journal entries and provide insights such as mood, summary, and subject.

## Features

- **User Authentication**: Secure user authentication using Clerk.
- **Journal Entries**: Create, update, and view journal entries.
- **AI Analysis**: Analyze journal entries using OpenAI to provide insights such as mood, summary, and subject.
- **Autosave**: Automatically save journal entries as users type.
- **Responsive Design**: A responsive and user-friendly interface.

## Folder Structure

- **app/**: Contains the main application code.
  - **(dashboard)**: Contains the dashboard-related pages.
    - **journal**: Contains pages for viewing and editing journal entries.
  - **api**: Contains API routes for handling journal entries.
  - **fonts**: Contains custom fonts used in the application.
  - **globals.css**: Global CSS styles.
  - **layout.tsx**: Main layout component.
  - **new-user**: Contains the page for new user setup.
  - **page.tsx**: Home page of the application.
  - **sign-in**: Contains the sign-in page.
  - **sign-up**: Contains the sign-up page.
- **components/**: Contains reusable UI components.
  - **Editor.tsx**: Editor component for journal entries.
  - **EntryCard.tsx**: Component for displaying a journal entry card.
  - **NewEntryCard.tsx**: Component for creating a new journal entry.
- **utils/**: Contains utility functions and modules.
  - **ai.ts**: AI analysis functions.
  - **api.ts**: API utility functions.
  - **auth.ts**: Authentication utility functions.
  - **db.ts**: Database utility functions.
- **prisma/**: Contains Prisma schema and migration files.
- **public/**: Contains public assets such as images and fonts.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered applications.
- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Prisma**: An ORM for interacting with the database.
- **Clerk**: A user management and authentication service.
- **OpenAI**: AI models for analyzing journal entries.
- **PostgreSQL**: A relational database used for storing data.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

More details about the site will be coming out soon so stay tuned!

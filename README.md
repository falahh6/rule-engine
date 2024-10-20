# Rule Engine

This project is built using Next.js 14 and Prisma with Neon DB.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v16.8.0 or later)
- npm or yarn
- Prisma CLI

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/falahh6/rule-engine.git
   cd rule-engine
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Setup Prisma with Neon DB

1. Create a `.env` file at the root of the project and add your Neon DB connection string:

   ```env
   DATABASE_URL="your_neon_db_connection_string"
   ```

2. Initialize Prisma:

   ```bash
   npx prisma init
   ```

3. Generate Prisma Client:

   ```bash
   npx prisma generate
   ```

4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

### Running the Development Server

1. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Learn More

To learn more about Next.js and Prisma, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Prisma Documentation](https://www.prisma.io/docs) - learn about Prisma features and API.

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com/). Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Live Deployment

You can view the live deployment at [rule-engine-falah.vercel.app](https://rule-engine-falah.vercel.app).

# LocalHunt

A Next.js application for discovering local vendors and small businesses in your area.

## Features

- MongoDB for data storage
- NextAuth.js for authentication
- Role-based access (Users, Vendors, Admins)
- Interactive maps with Google Maps API
- Modern UI with Tailwind CSS and shadcn/ui

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```properties
   # Auth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-32-character-secret-key # Change in production

   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/localhunt

   # Google Maps
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Testing

Run unit tests with:
```bash
npm test
```

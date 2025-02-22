// NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
// CLERK_SECRET_KEY=your_secret_key 

import { createClerkClient } from "@clerk/nextjs/server";

export const clerkClient = createClerkClient({
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
});
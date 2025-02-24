# TimeIt

TimeIt is a cutting-edge web application that allows users to create and share digital time capsules. Store your cherished memories, photos, and videos, and set them to unlock at specific future dates. It's a unique platform for preserving and sharing moments with friends, family, or the world.


Check out our Video design on Canva:
[TimeIt Design System](https://www.canva.com/design/DAGf951_oRA/eJCC9ci2nloYFE4_S1Xzsg/edit?utm_content=DAGf951_oRA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)





## 🚀 Features

- **Digital Time Capsules**: Create time capsules with photos, videos, and descriptions.
- **Location Tagging**: Add location context to your memories using Google Maps integration.
- **Scheduled Unlocking**: Set future dates for when your capsules become accessible.
- **Group Sharing**: Create and manage groups to share memories with specific people.
- **Progress Tracking**: Visual progress bars show time remaining until capsule unlocking.
- **Upcoming Events**: Track your soon-to-unlock capsules.
- **Private/Public Groups**: Flexibility to create both private and public sharing groups.

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Maps Integration**: Google Maps Places API


## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB instance
- Google Maps API key
- Clerk account for authentication

## 🌟 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vivek005001/TimeIt.git
   cd TimeCapsuleConn
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```plaintext
   MONGODB_URI=your_mongodb_uri
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   CLERK_SECRET_KEY=your_clerk_frontend_api
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   GEMINI_API_KEY=your_gemini_api_key
   
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000` to see the app in action.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.



## 📞 Contact

For any inquiries or support, please contact [vivekaggarwal569@example.com](mailto:vivekaggarwal569@example.com).

---

Enjoy creating and sharing your digital time capsules with TimeCapsuleConn! 🎉


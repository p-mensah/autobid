<div align="center">
<img width="1200" height="475" alt="AutoBid Banner" src="aut.png" />
</div>

# AutoBid - AI-Powered Auction Platform

AutoBid is a modern, feature-rich auction platform built with React, TypeScript, and Vite. This application provides a comprehensive marketplace for users to browse, bid on, and sell items through an intuitive web interface.

## 🚀 Features

### For All Users
- **Browse Auctions**: Explore all active auctions with real-time bidding
- **Watchlist Management**: Save favorite auctions for easy access
- **User Profiles**: Complete profile management and settings
- **Bid History**: Track all your bidding activity
- **Seller Profiles**: View seller information and ratings
- **AI Integration**: Powered by Google Gemini for enhanced user experience

### For Sellers
- **Create Auctions**: Easy auction creation with rich media support
- **My Listings**: Manage all your active and past auctions
- **Auction Analytics**: Track performance and engagement

### For Administrators
- **Admin Dashboard**: Comprehensive management interface
- **Auction Moderation**: Review and manage all auctions
- **User Management**: Monitor and manage user accounts

### For Super Administrators
- **Executive Dashboard**: High-level analytics and system overview
- **System Configuration**: Full platform management capabilities
- **Advanced Analytics**: Deep insights into platform performance

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Routing**: React Router v7
- **UI Components**: Custom components with Lucide React icons
- **Charts**: Recharts for data visualization
- **AI Integration**: Google Gemini API
- **Styling**: CSS-in-JS with responsive design

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd autobid
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

Build the application for production deployment:

```bash
npm run build
```

### 5. Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```
autobid/
├── components/           # Reusable UI components
│   ├── Layout.tsx       # Main application layout
│   ├── Loading.tsx      # Loading spinner component
│   └── StarRating.tsx   # Star rating component
├── pages/               # Page components
│   ├── Dashboard.tsx    # Browse auctions page
│   ├── UserOverview.tsx # User dashboard
│   ├── AdminDashboard.tsx
│   ├── SuperAdminDashboard.tsx
│   ├── AuctionDetails.tsx
│   ├── CreateAuction.tsx
│   ├── Login.tsx
│   ├── Watchlist.tsx
│   ├── Wallet.tsx
│   ├── MyBids.tsx
│   ├── MyListings.tsx
│   ├── Settings.tsx
│   ├── SupportCenter.tsx
│   ├── SellerProfile.tsx
│   └── [other pages...]
├── services/            # API services
│   └── geminiService.ts # AI integration service
├── App.tsx              # Main application component
├── index.html           # HTML entry point
├── index.tsx            # TypeScript entry point
├── constants.ts         # Application constants
├── types.ts            # TypeScript type definitions
├── vite.config.ts      # Vite configuration
└── package.json        # Project dependencies
```

## 🔧 Configuration

### Environment Variables

- `GEMINI_API_KEY`: Required for AI features and Gemini API integration

### Development Configuration

The project uses Vite for fast development builds. Key features include:
- Hot module replacement
- TypeScript support out of the box
- Fast build times
- Development server with proxy support

## 🎨 User Roles

The application supports multiple user roles with different permissions:

1. **Regular Users**: Browse, bid, create auctions, manage profiles
2. **Administrators**: Manage auctions, moderate content, user management
3. **Super Administrators**: Full system access, executive dashboards, advanced analytics

## 📱 Browser Support

AutoBid supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔒 Security

- Secure API key management through environment variables
- Input validation and sanitization
- Secure routing with role-based access control

## 🚀 Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Set the `GEMINI_API_KEY` environment variable in Vercel dashboard
3. Deploy with default settings

### Netlify

1. Connect your repository to Netlify
2. Add `GEMINI_API_KEY` as an environment variable
3. Set build command to `npm run build` and publish directory to `dist`

### Custom Server

1. Build the application: `npm run build`
2. Serve the `dist` directory with your preferred web server
3. Ensure environment variables are properly configured

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [Support Center](/support) in the application
- Review the [Help](/help) documentation
- Contact the development team

## 🙏 Acknowledgments

- Built with React and TypeScript
- Powered by Google Gemini AI
- Icons provided by Lucide React
- Charts powered by Recharts

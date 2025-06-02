# 🚀 TaskBoard – Web3 Task Management Application

A modern, responsive task management app built with **Next.js**, featuring **Web3 wallet authentication**, **IndexedDB storage**, and a stunning **hero-style UI with glassmorphism**.

---

## ✨ Features

- 🔐 **Web3 Authentication**: Connect with MetaMask or any Web3 wallet via **Ethers.js**
- 📱 **Responsive Design**: Optimized for both desktop and mobile
- 💾 **Client-side Storage**: Tasks saved securely in the browser using **IndexedDB**
- 👤 **Random Profile Avatars**: Generated using the **Picsum API**
- 🧊 **Modern UI**: Beautiful glassmorphism effects with a hero-style layout
- ✅ **Task Management**: Create, edit, delete, and move tasks between statuses
- 🚦 **Priority Levels**: Assign High, Medium, or Low priority with color-coded labels
- ⚡ **Real-time Updates**: Drag-and-drop feel for instant task status changes

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 19
- **Styling**: Tailwind CSS with custom gradients and animations
- **Web3**: Ethers.js for wallet integration
- **Database**: IndexedDB for client-side task storage
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

---

## 📱 Screenshots

The application includes:

- **Login Page**: Web3 wallet connection with a hero background
- **Task Dashboard**: Three-column Kanban board (To Do, In Progress, Completed)
- **Task Modal**: Create/edit tasks with priority and status selection

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or any Web3 wallet extension

### Installation

Clone the repository:

```bash
git clone <your-repo-url>
cd taskboard-nextjs
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

---

## 📦 Building for Production

```bash
npm run build
npm start
```

---

## 🌐 Deployment Guide

### Deploy to Vercel (Recommended)

Install Vercel CLI:

```bash
npm i -g vercel
```

Deploy your app:

```bash
vercel
```

Follow the CLI prompts to:

- Link your GitHub repository
- Configure project settings
- Deploy!

### Alternative: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Configure build settings (auto-detected for Next.js)
5. Deploy!

### Deploy to Netlify

Build the project:

```bash
npm run build
```

Deploy the `out` folder to Netlify and add this to `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Deploy to Firebase Hosting

Install Firebase CLI:

```bash
npm install -g firebase-tools
```

Initialize Firebase:

```bash
firebase init hosting
```

Build and deploy:

```bash
npm run build
firebase deploy
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_APP_NAME=TaskBoard
NEXT_PUBLIC_APP_DESCRIPTION=Web3 Task Management Application
```

---

## 💅 Tailwind Configuration

The project uses custom Tailwind CSS configurations for:

- Gradient animations
- Glassmorphism effects
- Custom color schemes
- Responsive breakpoints

---

## 📊 Database Schema

**Tasks Collection (IndexedDB)**

```javascript
{
  id: string,
  title: string,
  description: string,
  status: 'todo' | 'in-progress' | 'completed',
  priority: 'low' | 'medium' | 'high',
  userAddress: string
}
```

---

## 📄 License

MIT License. Feel free to fork, contribute, and improve the project!

---

## 🙌 Contributions

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 💬 Contact

For questions or collaboration, feel free to open an issue or reach out directly.
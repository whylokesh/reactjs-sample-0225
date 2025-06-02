# 🚀 TaskBoard – Web3 Task Management Application

🔗 **Live Demo**: [https://reactjs-sample-0225-xslu.vercel.app/](https://reactjs-sample-0225-xslu.vercel.app/)  
🎥 **Video Demo**: [Watch on Loom](https://www.loom.com/share/fe3029dff4524736ac820c21966f5529?sid=87bbbef9-51cc-41eb-9721-370396c71bd8)


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
  ![image](https://github.com/user-attachments/assets/e32dccda-d23f-4543-a2a7-4f622f6209fb)

- **Task Dashboard**: Three-column Kanban board (To Do, In Progress, Completed)
  ![image](https://github.com/user-attachments/assets/cda407db-4c92-4c82-94e2-894adeb97274)

- **Task Modal**: Create/edit tasks with priority and status selection
  ![image](https://github.com/user-attachments/assets/4e27e3c5-da24-484f-81c2-08e2e71ea14d)


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

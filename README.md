# 🚀 Interactive Question Management Sheet

A premium, single-page web application designed for developers to manage their coding preparation efficiently. Inspired by the **Codolio** aesthetic, this tool provides a seamless experience for organizing topics, sub-topics, and questions with a modern SaaS-style interface.

![Branding](/home/cheeku1855/.gemini/antigravity/brain/df6fa45e-784b-4bf5-903f-cfddde47c38d/verify_branding.webp)

## ✨ Features

### 🛠 Core Functionality

- **Full CRUD Support**: Create, Edit, and Delete Topics, Sub-topics, and Questions.
- **Dynamic Reordering**: First-class Drag & Drop support for Topics, Sub-topics, and Questions using `@hello-pangea/dnd`.
- **Smart Progress Tracking**: Real-time progress bars and "X% Solved" indicators.
- **Search System**: Instantly find questions or topics across the entire sheet.

### 🎨 Premium UI/UX (Bonus)

- **SaaS Aesthetic**: Built with Tailwind CSS 4.0, featuring glassmorphism, smooth transitions, and a clean layout.
- **Official Brand Iconography**: Direct integration of official logos for **LeetCode**, **GeeksForGeeks**, **YouTube**, and **Coding Ninjas**.
- **Smart Link Detection**: The app automatically detects the platform from URLs and displays the corresponding brand logo.
- **Dark & Light Mode**: Seamless theme switching with persistent user preference.
- **Typography & Branding**: Professional "DM Sans" font and custom Codolio branding.

### ⚙️ Technical Excellence

- **React 19**: Utilizing the latest React features for performance.
- **Zustand**: Clean, centralized state management for all operations.
- **API Integrated**: Populates initial data from the official Codolio Striver SDE Sheet endpoint.
- **Data Integrity**: Implements cascading deletions and reference management for sub-topics.

## 🛠 Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite 7](https://vite.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State**: [Zustand](https://zustand-demo.pmnd.rs/)
- **D&D**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- **Icons**: [Lucide React](https://lucide.dev/) + Custom SVGs

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd question-management-sheet
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run in development mode**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📋 Usage Note

- **Dragging**: Use the grip handle `::` to move items.
- **Editing**: Click the edit icon or directly on a name (for sub-topics) to rename.
- **Saving**: All changes are handled in the local session; for a full backend implementation, sync the Zustand store with the provided API.

---

Built with ❤️ for better coding preparation.

# 🚀 Interactive Question Management Sheet  
**Internship Assignment Submission – Codolio**

A modern, single-page web application built as part of the Codolio Internship Assignment.  
This project enables users to manage coding preparation sheets with hierarchical topics, sub-topics, and questions, featuring full CRUD operations, drag-and-drop reordering, and a premium SaaS-style user experience.

The application follows all functional and technical requirements mentioned in the assignment document and includes additional enhancements for better usability.

---

## 🔗 Live Demo  
🌐 **Application:** https://codolio-sheet.vercel.app  

---

## 📌 Assignment Objective

The goal of this project was to design and implement an interactive web application that allows users to:

- Organize questions under Topics and Sub-topics  
- Perform Create, Read, Update, and Delete (CRUD) operations  
- Reorder elements using drag and drop  
- Maintain a clean and intuitive user interface  
- Implement proper state management  
- Integrate sample data using API endpoints  

This project fulfills all the above objectives.

---

## ✨ Features

### 🛠 Core Functionality
- ✅ **Full CRUD Support**  
  Create, Edit, and Delete Topics, Sub-topics, and Questions.

- ✅ **Hierarchical Structure**  
  Topics → Sub-topics → Questions.

- ✅ **Drag & Drop Reordering**  
  Reorder Topics, Sub-topics, and Questions using `@hello-pangea/dnd`.

- ✅ **API Integration**  
  Initial data is fetched from the official Codolio endpoint.

- ✅ **State Management**  
  Centralized state handling using Zustand.

---

### 📊 Productivity Enhancements (Bonus Features)
- 📈 **Progress Tracking**  
  Real-time progress bar and solved percentage.

- 🔍 **Global Search**  
  Search across all topics and questions instantly.

- 🧠 **Smart Link Detection**  
  Automatically detects coding platforms and displays official logos.

- 🌙 **Dark & Light Mode**  
  Theme preference is saved for better user experience.

---

### 📱 Mobile Responsiveness
Built with a **Mobile-First Design** approach:

- Adaptive layouts for small screens  
- Optimized question view on mobile  
- Touch-friendly components  
- Responsive header and statistics layout  

Ensures smooth usage across desktops, tablets, and smartphones.

---

### 🎨 UI / UX Design
- ✨ Inspired by Codolio’s interface  
- 🎨 Tailwind CSS 4.0 styling  
- 💎 Glassmorphism effects and smooth transitions  
- 🖋️ Professional typography using DM Sans  
- 📌 Official platform icons (LeetCode, GFG, YouTube, Coding Ninjas)

---

## ⚙️ Technical Implementation

### Architecture
- Single Page Application (SPA)  
- Component-based React architecture  
- Centralized state using Zustand  
- Modular UI design  

### Data Handling
- API-based initial data population  
- Cascading deletions  
- Reference management between entities  
- Local state persistence  

### Drag & Drop
- Implemented using `@hello-pangea/dnd`  
- Supports nested reordering  

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| State Management | Zustand |
| Drag & Drop | @hello-pangea/dnd |
| Icons | Lucide React + Custom SVGs |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)  
- npm / yarn  

---

### Installation & Setup

#### 1️⃣ Clone the repository
```bash
git clone <repository-url>
cd question-management-sheet
npm install
npm run dev
```
---

### ❤️Built with passion and love for learning.
~ Gnaneswar Thavva

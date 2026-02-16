# Real-Time Task Collaboration Platform — Frontend

Frontend for a real-time collaborative task management platform inspired by tools like Trello and Notion.  
Built as a modern SPA with drag-and-drop task management and live synchronization across multiple users.

---

## 🚀 Tech Stack

- **Next.js 15** — React framework for fast SPA development
- **TypeScript** — Type safety and maintainability
- **TanStack Query (React Query)** — Server state management & caching
- **Socket.IO Client** — Real-time updates
- **dnd-kit** — Accessible drag-and-drop system
- **Shadcn UI + Tailwind CSS** — Clean, responsive UI components

---

## ✨ Features

### 🔐 Authentication
- Secure login & signup
- JWT-based authentication via backend APIs
- Persistent session handling

---

### 📋 Boards & Lists
- Create and view boards
- Dynamic lists rendered per board
- Horizontal scroll layout for productivity-style UX

---

### ✅ Task Management
- Create, edit, and delete tasks
- Inline editing for fast updates
- Optional task descriptions

---

### 🎯 Drag & Drop with Persistence
- Smooth drag-and-drop using **dnd-kit**
- Tasks maintain their order after refresh
- Position-based ordering system prevents index conflicts

**Strategy Used:**
> Tasks store a numeric `position`.  
> When moved, surrounding tasks are incremented/decremented to maintain consistent ordering.

This mirrors how production productivity tools handle reordering.

---

### ⚡ Real-Time Collaboration

Implemented using **Socket.IO** with board-based rooms.

**How it works:**

- Users join a board-specific socket room
- Task events are broadcast to all connected clients:
  - Task created
  - Task moved
  - Task deleted
- Clients invalidate cached queries to instantly reflect updates

Result:

👉 Multiple users can interact with the same board simultaneously.

---

## 🧠 State Management Approach

We use **TanStack Query** to separate:

### Server State:
- Boards
- Lists
- Tasks

### Client State:
- Drag interactions
- Editing mode
- Form inputs

**Why this matters:**

- Reduces unnecessary global state
- Improves performance
- Keeps data flow predictable

---

## 🏗️ Architecture Overview
```
Board Page
├── List Columns
│ ├── Task Cards
│
└── Global Socket Connection
```

### Key Decisions:

✅ Drag state handled locally for performance  
✅ Socket connection scoped to board level  
✅ Query invalidation used instead of complex optimistic merges  

This prioritizes reliability over over-engineering.

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/SyedJunaidAli1/hintro-assignment-client
cd hintro-assignment-client
```
2. Install dependencies
```
bun install
```
3. Configure Environment Variables

Create a .env.local file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```
4. Start the development server
```
bun run dev
```
App will run on:

http://localhost:3000

🔑 Demo Credentials
```
Email: 123test@gmail.com Password: 123456789
```
(Or register a new user.)
⚖️ Tradeoffs & Assumptions

To prioritize core collaboration features within the assignment scope:

    Pagination was intentionally skipped

    Search functionality was deferred

    Focus was placed on:

        realtime updates

        drag persistence

        clean architecture

🎯 What This Project Demonstrates

This frontend focuses on patterns commonly used in modern SaaS collaboration tools:

    Real-time synchronization

    Predictable server-state management

    Persistent drag ordering

    Component-driven architecture
# Svelove Frontend

<p align="center">
  <img src="src/assets/svelove-logo.svg" alt="Svelove Logo" width="400"/>
</p>

<p align="center">
  <strong>The frontend for Svelove, a modern dating application for the Polish market.</strong>
</p>

---

## 🚀 About Svelove

Svelove is a dating application for the Polish market, designed to connect people based on shared interests and preferences. This repository contains the source code for the frontend, built with React and TypeScript. It provides a responsive and engaging user experience for discovering and connecting with potential matches.

## ✨ Key Features

- **User Authentication**: Secure registration and login functionality.
- **Profile Management**: Create, view, and edit user profiles with detailed information.
- **Photo Uploads**: Easily upload and manage profile pictures.
- **Matching**: Browse and connect with potential matches.
- **Real-Time Chat**: Engage in live conversations with your matches.
- **Notifications**: Receive real-time notifications for new messages and matches.
- **Target Audience**: The user interface is in Polish, and the application is designed for users in Poland, allowing city selection from all Polish cities.
- **User Statistics**: View insightful statistics about your activity.

## 🛠️ Technologies Used

- **Framework**: [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [daisyUI](https://daisyui.com/)
- **Real-Time Communication**: [StompJS](https://stomp-js.github.io/) and [SockJS](https://github.com/sockjs/sockjs-client) for WebSocket communication.
- **Drag & Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) for intuitive drag-and-drop interfaces.
- **State Management**: React Hooks & Context API.

## 📦 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KacperDega/svelove-frontend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd svelove-frontend
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## 📜 Available Scripts

In the project directory, you can run the following commands:

### `npm start`

Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

## 🌐 API Integration

The frontend is configured to work with the API from the backend repository. The base URL for the API is set in `src/api/apiRequest.ts` and defaults to `http://localhost:8080`.

## 📁 Folder Structure

```
src/
├── api/           # API request logic
├── assets/        # Images and static assets
├── components/    # Reusable React components
├── pages/         # Main pages of the application
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

# ⚡ HackFusion 2K24

The official web experience for **HackFusion 2K24** — bringing participants together with event details, schedules, team registration, and more.

> Built with React and Vite, styled with Tailwind CSS, and connected to Firebase for team registration and data.

## ✨ What’s inside

- Event landing page, countdown, schedule, sponsors, and contact information
- Team registration, participant sign-in, dashboard, and receipt pages
- Firebase Realtime Database and Storage integration
- Responsive interface with animated backgrounds and splash screen

## 🚀 Get started

### Requirements

- Node.js and npm
- Firebase project credentials for the registration and dashboard features

### Install and run

```bash
npm install
npm run dev
```

Vite prints the local URL in your terminal (usually `http://localhost:5173`).

## 🔐 Firebase configuration

Create a `.env` file in the project root and add your Firebase web app settings:

```dotenv
VITE_HACKFUSION_APIKEY=your_api_key
VITE_HACKFUSION_AUTHDOMAIN=your_project.firebaseapp.com
VITE_HACKFUSION_DATABASEURL=https://your_project-default-rtdb.firebaseio.com
VITE_HACKFUSION_PROJECTID=your_project_id
VITE_HACKFUSION_STORAGEBUCKET=your_project.firebasestorage.app
VITE_HACKFUSION_MESSAGINGSENDERID=your_messaging_sender_id
VITE_HACKFUSION_APPID=your_app_id
```

Use the values from **Firebase Console → Project settings → Your apps**. Restart the dev server after changing environment variables. Local `.env` files are ignored by Git; share secrets through a secure channel.

## 🧰 Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## 🧱 Tech stack

React 18 · Vite · Tailwind CSS · Firebase · React Router · Framer Motion

## 🤝 Contributing

1. Fork the repository and create a branch for your change.
2. Install dependencies with `npm install`.
3. Make your change and run `npm run lint` and `npm run build`.
4. Open a pull request with a concise summary.

Please don’t commit `.env` files or Firebase credentials.

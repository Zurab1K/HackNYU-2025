### Description
- This is a fullstack boilerplate that uses React, TypeScript, Vite
- Underlying page/routing uses React Router

### Frontend Folder Structure
**Make sure you are reading the below in code view mode or markdown preview for better visibility of the folder structure**

frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   └── layout/       # Layout components (Header, Footer, etc.)
│   │       └── Header.tsx
│   ├── pages/            # Page components (one per route)
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   ├── styles/           # Global styles and themes
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main app component with routing
│   └── main.tsx          # App entry point
├── .gitignore           # Git ignore file
├── index.html           # Main HTML template
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
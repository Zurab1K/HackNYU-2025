backend/ 
├── src/ 
│ ├── middleware/ # Custom middleware 
│ │ ├── errorHandler.ts # Global error handling 
│ │ └── logger.ts # Request/response logging 
│ ├── routes/ # Route definitions 
│ │ ├── user/ # sample route
│ │ │ └── index.ts 
│ │ └── index.ts # Main routes entry point 
│ └── app.ts # Express application setup 
├── .env.example # Example environment variables 
├── .gitignore 
├── package.json 
├── tsconfig.json 
└── README.md
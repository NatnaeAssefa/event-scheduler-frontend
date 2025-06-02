# Event Scheduler Frontend

A modern React application for managing events with complex recurrence patterns. This frontend application integrates with the Event Scheduler backend API.

## Features

- User authentication (login/register)
- Calendar view with month, week, day, and agenda views
- Create, edit, and delete events
- Support for complex recurrence patterns:
  - Daily, weekly, monthly, and yearly recurrence
  - Custom intervals (e.g., every 3rd day)
  - Specific days of the week
  - Relative dates (e.g., second Friday of each month)
- All-day events
- Event color customization
- Location support
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Event Scheduler backend running on http://localhost:3000

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following content:
   ```
   VITE_API_URL=http://localhost:3000
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── services/      # API services
  ├── types/         # TypeScript type definitions
  ├── utils/         # Utility functions
  ├── hooks/         # Custom React hooks
  ├── context/       # React context providers
  ├── App.tsx        # Main application component
  ├── main.tsx       # Application entry point
  └── index.css      # Global styles
```

## Technologies Used

- React 18
- TypeScript
- Material-UI (MUI)
- React Router
- Formik & Yup
- React Big Calendar
- Axios
- Vite

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 
# Saathi Care (prototype)

A React + Tailwind prototype for a home healthcare / elder-care booking
platform, with three simulated perspectives: Family, Caregiver, and Admin.

## Run it in VS Code

1. Unzip this project and open the folder in VS Code.
2. Open a terminal (``Ctrl+` `` / `` Cmd+` ``) and install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. It will open at `http://localhost:5173` automatically.

## Project structure

```
saathi-care/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx      # React entry point
    ├── App.jsx        # Main app component (all views)
    └── index.css      # Tailwind imports
```

## Notes

- Built with [Vite](https://vitejs.dev/), so hot-reload is instant on save.
- Uses [lucide-react](https://lucide.dev/) for icons and
  [Recharts](https://recharts.org/) for the admin bookings chart.
- All data (`SERVICES`, `CAREGIVERS`, `INITIAL_BOOKINGS`, etc.) is mock
  data defined at the top of `src/App.jsx` — swap these for real API calls
  when you're ready to connect a backend.
- Run `npm run build` to produce a production build in `dist/`.

## Recommended VS Code extensions

- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**

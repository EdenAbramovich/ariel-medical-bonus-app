# Ariel Medical — מערכת ניהול בונוסים

A web application for beauty consultants at **Ariel Medical** to track and calculate their monthly sales bonuses.

## Features

- **Google OAuth login** — each consultant signs in with their Gmail account
- **Monthly calendar view** — browse up to 3 years of history plus the upcoming month
- **Daily bonus entry** — log which products/packages were sold each day; bonuses are calculated automatically
- **Monthly totals** — see the total bonus for each month at a glance
- **Statistics sidebar** — annual summary, best month, monthly average, and an interactive bar chart
- **Fully responsive** — works on phones, tablets, and desktops

## Tech Stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) for navigation
- [@react-oauth/google](https://github.com/MomenSherif/react-oauth) for Google login
- Data stored in `localStorage` (per-user, keyed by Google account ID)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add `http://localhost:5173` to **Authorized JavaScript origins**
4. Copy the Client ID

### 4. Create the environment file

Create a `.env` file in the project root (this file is git-ignored):

```
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── data/
│   └── products.js          # Product catalog with bonus amounts
├── utils/
│   ├── bonusCalc.js         # Bonus calculation logic
│   ├── storage.js           # localStorage helpers (per-user data)
│   └── dateHelpers.js       # Hebrew date/calendar utilities
├── components/
│   ├── AppLayout.jsx        # Page wrapper with sidebar toggle
│   ├── Header.jsx           # Sticky top navigation
│   ├── DayModal.jsx         # Daily product entry form
│   └── StatsSidebar.jsx     # Bonus statistics & chart panel
└── pages/
    ├── LoginPage.jsx        # Google OAuth login screen
    ├── Dashboard.jsx        # Month grid (calendar overview)
    └── MonthView.jsx        # Day-by-day calendar for a month
```

## Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder.

---

> **Note:** The `.env` file containing your Google Client ID is excluded from version control. Never commit API keys or secrets to GitHub.

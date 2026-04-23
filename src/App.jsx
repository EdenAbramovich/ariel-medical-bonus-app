import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import MonthView from './pages/MonthView'

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ariel_user')
    return saved ? JSON.parse(saved) : null
  })

  const handleLogin = (userData) => {
    localStorage.setItem('ariel_user', JSON.stringify(userData))
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('ariel_user')
    setUser(null)
  }

  const sharedProps = { user, onLogout: handleLogout }

  const today = new Date()
  const currentMonthPath = `/month/${today.getFullYear()}/${today.getMonth() + 1}`

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to={currentMonthPath} replace /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard {...sharedProps} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/month/:year/:month"
          element={user ? <MonthView {...sharedProps} /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to={user ? currentMonthPath : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import MonthView from './pages/MonthView'
import './App.css'

function App() {
  // undefined = still checking auth, null = logged out, object = logged in
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          sub:     firebaseUser.uid,
          name:    firebaseUser.displayName,
          email:   firebaseUser.email,
          picture: firebaseUser.photoURL,
        })
      } else {
        setUser(null)
      }
    })
    return unsubscribe
  }, [])

  const handleLogout = () => signOut(auth)

  // Still loading auth state
  if (user === undefined) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
      </div>
    )
  }

  const today = new Date()
  const currentMonthPath = `/month/${today.getFullYear()}/${today.getMonth() + 1}`
  const sharedProps = { user, onLogout: handleLogout }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to={currentMonthPath} replace /> : <LoginPage />}
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

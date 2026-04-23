import { useNavigate } from 'react-router-dom'
import './Header.css'

export default function Header({ user, onLogout, backLabel, backTo }) {
  const navigate = useNavigate()

  return (
    <header className="app-header">
      <div className="header-right">
        <div className="header-logo">
          <span>AM</span>
        </div>
        <h1 className="header-title">Ariel Medical</h1>
        {backTo && (
          <button className="header-back" onClick={() => navigate(backTo)}>
            ← {backLabel || 'חזרה'}
          </button>
        )}
      </div>

      <div className="header-left">
        {user.picture && (
          <img src={user.picture} alt={user.name} className="header-avatar" referrerPolicy="no-referrer" />
        )}
        <span className="header-username">{user.name}</span>
        <button className="header-logout" onClick={onLogout}>יציאה</button>
      </div>
    </header>
  )
}

import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { setNavigate } from './services/navigation'
import SignIn from './pages/signin/Signin'
import Dashboard from './pages/dashboard/dashboard'
import ManagePage from './pages/manage_pages/ManagePages'
import Settings from './pages/settings/Settings'
import BillingPage from './pages/billing/Billing'
import { useState } from 'react'

const NavigationSetter = () => {
  const navigate = useNavigate();
  setNavigate(navigate); // Store the navigate function globally
  return null; // This component doesn't render anything
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  if (isAuthenticated === true){
    return (
      <Router>
        <NavigationSetter />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/manage_pages/:id' element={<ManagePage />} />
          <Route path='/settings/:id' element={<Settings />} />
          <Route path='/billing/:id' element={<BillingPage />} />
        </Routes>
      </Router>
    )
  }
  else if(isAuthenticated === 'login'){
    return <SignIn />
  }
}

export default App

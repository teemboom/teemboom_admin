import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { setNavigate } from './services/navigation'
import SignIn from './pages/signin/Signin'
import Dashboard from './pages/dashboard/dashboard'
import ManagePage from './pages/manage_pages/ManagePages'
import Settings from './pages/settings/Settings'
import BillingPage from './pages/billing/Billing'
import { useEffect, useState } from 'react'
import apiClient from './services/apiClient'
import { useDispatch } from 'react-redux'
import { setUser } from './redux/userSlice'
import AddDomain from './pages/add_domain/AddDomain'
import { setSite } from './redux/siteSlice'
import SiteColors from './pages/settings/site_colors/SiteColors'
import SiteLayout from './pages/settings/site_layout/SiteLayout'
import BillingPlans from './pages/billing/change_plan/ChangePlan'
import { Provider } from 'react-redux'
import store from './redux/store'
import Popup from './components/Popup'

const NavigationSetter = () => {
  const navigate = useNavigate();
  setNavigate(navigate); // Store the navigate function globally
  return null; // This component doesn't render anything
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [gettingUser, setGettingUser] = useState(false)
  const dispatch = useDispatch()
  async function authUser() {
    try {
      const user = await apiClient.get('/user/get_user')
      if (user.data.status) {
        dispatch(setUser(user.data.data))
        let domains = user.data.data.owned_domains
        if (domains?.length > 0){
          let storageSite = localStorage.getItem('currentSite')
          if (storageSite){
            if (domains.includes(storageSite)){
              await setSiteDetails(storageSite)
              return true
            }
          }
          await setSiteDetails(domains[0])
        }
        return true
      } else return false
    } catch (error) {
      return false
    }
  }
  
  async function setSiteDetails(domain) {
    const config = await apiClient.post('https://comments.teemboom.com/teemboom_config', { page_id: domain })
    dispatch(setSite(config.data.data))
  }

  useEffect(() => {
    const checkAuth = async () => {
      if (!gettingUser) {
        setGettingUser(true)
        try {
          const userStatus = await authUser();
          setIsAuthenticated(userStatus);
        } catch (error) {
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === true) {
    return (
      <Provider store={store}>
        <Router>
          <NavigationSetter />
          <Popup />
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/add_domain' element={<AddDomain />} />
            <Route path='/manage_pages' element={<ManagePage />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/settings/site_colors' element={<SiteColors />} />
            <Route path='/settings/site_layout' element={<SiteLayout />} />
            <Route path='/billing' element={<BillingPage />} />
            <Route path='/billing/change_plan' element={<BillingPlans />} />
          </Routes>
        </Router>
      </Provider>
    )
  }
  else if (isAuthenticated === false) {
    return (
      <Provider store={store}>
        <SignIn />
      </Provider>
    )
  }
}

export default App

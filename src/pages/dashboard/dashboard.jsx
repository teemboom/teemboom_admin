import './dashboard.css'
import { navigateTo } from '../../services/navigation'

export default function Dashboard(){

    return (
        <div id='Dashboard'>
            <div id='dashboardsidebar'>
                <div id="dashboardsidebarHead">
                    <h1>Teemboom Admin</h1>
                </div>
                <div id="dashboardsidebarNew">
                    <button>Add new Website</button>
                </div>
                <div id="dashboardsidebarDomains">
                    <p>example.com</p>
                    <p>example.com</p>
                    <p>example.com</p>
                    <p>example.com</p>
                </div>
            </div>
            <div id="dashboardMain">
                <div onClick={()=>{navigateTo("/manage_pages/989857442")}} className="dashboardItem"></div>
                <div onClick={()=>{navigateTo("/settings/989857442")}} className="dashboardItem"></div>
                <div onClick={()=>{navigateTo("/billing/989857442")}} className="dashboardItem"></div>
            </div>
        </div>
    )
}
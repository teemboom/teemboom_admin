import './dashboard.css'
import { navigateTo } from '../../services/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/userSlice'
import { setSite } from '../../redux/siteSlice'
import apiClient from '../../services/apiClient'

export default function Dashboard() {
    const user = useSelector((state) => state.user.user)
    const currentSite = useSelector((state) => state.site.site)
    const dispatch = useDispatch()


    async function setSiteDetails(domain) {
        const config = await apiClient.post('https://comments.teemboom.com/teemboom_config', { page_id: domain })
        dispatch(setSite(config.data.data))
    }

    return (
        <div id='Dashboard'>
            <div id='dashboardsidebar'>
                <div className="dashboardST">
                    <div id="dashboardsidebarHead">
                        <h1>Teemboom Admin</h1>
                    </div>
                    <div id="dashboardsidebarNew">
                        <button onClick={() => { navigateTo('/add_domain') }}>Register Your Domain</button>
                    </div>
                    <div id="dashboardsidebarDomains">
                        {user.owned_domains.map(domain => {
                            return <p onClick={() => { setSiteDetails(domain) }} key={domain}>{domain}</p>
                        })}
                    </div>
                </div>

                <div className="dashboardSD">
                    <div id="dashboardUser">
                        <img src={user.profile_pic} alt="" />
                        <p>{user.username}</p>
                    </div>
                    <button onClick={() => { dispatch(logout()) }} className='action_button' id='dashboardLogout'>Logout</button>
                    <button onClick={() => { window.location.href = "https://teemboom.com/community/bugs/" }} className='action_button' id='dashboardBugs'>Report Bugs</button>
                </div>
            </div>
            <div id="dashboardMain">
                <h1>{currentSite ? currentSite._id : ''}</h1>
                {(() => {
                    if (currentSite) {
                        return (
                            <>
                                <div onClick={() => { navigateTo("/manage_pages") }} className="dashboardItem">
                                    <header>Manage Comments</header>
                                    <p>Delete Comments &gt;</p>
                                    <p>Disapprove Comments &gt;</p>
                                </div>
                                <div onClick={() => { navigateTo("/settings") }} className="dashboardItem">
                                    <header>Settings</header>
                                    <p>Live Chat &gt;</p>
                                    <p>Comment Reactions &gt;</p>
                                    <p>Comment Clearance &gt;</p>
                                    <p>Site Colors &gt;</p>
                                    <p>Site Layout Selection &gt;</p>
                                </div>
                                {/* <div onClick={() => { navigateTo("/billing") }} className="dashboardItem">
                                    <header>Billing</header>
                                    <p>Change App Version / Plan  &gt;</p>
                                    <p>Billing History  &gt;</p>
                                    <p>Usage Statistics &gt;</p>
                                </div> */}
                            </>
                        )
                    }
                    return (
                        <div id="dashboardNone">Register Or Select a Domain</div>
                    )
                })()}

            </div>
        </div>
    )
}
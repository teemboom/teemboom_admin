import { useParams } from "react-router-dom"
import './billing.css'
import { navigateTo } from "../../services/navigation"
import { useSelector } from "react-redux"

export default function BillingPage() {
    const currentSite = useSelector((state) => state.site.site)
    return (
        <div id="billing">
            <div id="mpTopBar">
                <button onClick={() => { navigateTo("/") }} className="action_button">&lt; Dashboard</button>
                <p>{currentSite._id}</p>
                {/* <button id="bUpgradeBtn" onClick={()=>{navigateTo("/billing/change_plan")}} className="action_button">Change Plan</button> */}
            </div>
            <div id="bMain">
                <div id="bMainMain">
                    <div id="bCurrent">
                        <div className="bCitem">
                            <header>Current Plan</header>
                            <p><i>0</i>/month</p>
                        </div>
                        <div className="bCitem">
                            <p><strong>Next Billing date</strong></p>
                            <p>None</p>
                        </div>
                    </div>
                    <div id="bUsage">
                        <header id="BHheader">Usage Statistics</header>
                    </div>
                </div>
                <div id="bMainSide">
                    <div id="bHistory">
                        <header id="BHheader">Billing History</header>
                        <p>None</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
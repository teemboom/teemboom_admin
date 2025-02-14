import { useParams } from "react-router-dom"
import './billing.css'
import { navigateTo } from "../../services/navigation"

export default function BillingPage() {
    const { id } = useParams()
    return (
        <div id="billing">
            <div id="mpTopBar">
                <button onClick={() => { navigateTo("/") }} className="action_button">Dashboard</button>
                <p>teemboom.com</p>
                <button id="bUpgradeBtn" className="action_button">Upgrade Plan</button>
            </div>
            <div id="bMain">
                <div id="bMainMain">
                    <div id="bCurrent"></div>
                    <div id="bUsage"></div>
                </div>
                <div id="bMainSide">
                    <div id="bHistory"></div>
                </div>
            </div>
        </div>
    )
}
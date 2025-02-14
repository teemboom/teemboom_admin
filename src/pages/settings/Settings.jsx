import { useParams } from "react-router-dom";
import { navigateTo } from "../../services/navigation";
import './settings.css'
import MenuToogle from "../../components/menutoogle/menuToggle";

export default function Settings() {
    const { id } = useParams()

    const sendStatus = (value)=>{
        console.log(value)
    }

    return (
        <div id="Settings">
            <div id="mpTopBar">
                <button onClick={() => { navigateTo("/") }} className="action_button">Dashboard</button>
                <p>teemboom.com</p>
            </div>
            <div id="settingsMain">
                <div className="settingsItem">
                    <header>Live Chat</header>
                    <MenuToogle title="Enable Live Chat" status={false} sendStatus={sendStatus} />
                </div>
                <div className="settingsItem">
                    <header>Replies</header>
                    <MenuToogle title="Reply to comments" status={false} sendStatus={sendStatus} />
                </div>
                <div className="settingsItem">
                    <header>Reactions</header>
                    <MenuToogle title="Likes" status={false} sendStatus={sendStatus} />
                    <MenuToogle title="Dislikes" status={false} sendStatus={sendStatus} />
                </div>
                <div className="settingsItem">
                    <header>Authorize Comments</header>
                    <MenuToogle title="Authorize Comments" status={false} sendStatus={sendStatus} />
                </div>
                <div className="settingsItem">
                    <header>User Identification</header>
                    <MenuToogle title="Require Login" status={false} sendStatus={sendStatus} />
                </div>
                <div className="settingsItem">
                    <header>File Attachments</header>
                    <MenuToogle title="Allow Attachments" status={false} sendStatus={sendStatus} />
                </div>
                <div className="settingsItem">
                    <header>Site Colors</header>
                </div>

                <div className="settingsItem">
                    <header>Site Layout / Theme</header>
                </div>
            </div>
        </div>
    )
}
import { navigateTo } from "../../services/navigation";
import './settings.css'
import MenuToogle from "../../components/menutoogle/menuToggle";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import apiClient from "../../services/apiClient";
import { setSite } from "../../redux/siteSlice";
import { showPopup } from "../../redux/popupSlice";
export default function Settings() {
    const dispatch = useDispatch()
    const currentSite = useSelector((state) => state.site.site)
    const [liveChat, setLiveChat] = useState(currentSite.live_chat)
    const [replies, setReplies] = useState(currentSite.showReplies)
    const [showLikes, setShowLikes] = useState(currentSite.showLikes)
    const [showDislikes, setShowDislikes] = useState(currentSite.showDislikes)
    const [commentApproval, setCommentApproval] = useState(currentSite.comment_approval)
    const [identification, setIdentification] = useState(currentSite.identification === '1')

    async function save(){
        let changes = {}
        if (liveChat !== currentSite.live_chat) changes.live_chat = liveChat
        if (replies !== currentSite.showReplies) changes.showReplies = replies
        if (showLikes !== currentSite.showLikes) changes.showLikes = showLikes
        if (showDislikes !== currentSite.showDislikes) changes.showDislikes = showDislikes
        if (commentApproval !== currentSite.comment_approval) changes.comment_approval = commentApproval
        
        let iden = ''
        if (identification) iden = '1' 
        else iden = '2' 
        if (iden !== currentSite.identification) changes.identification = iden
        
        if (Object.keys(changes).length === 0) {
            dispatch(showPopup('No changes to save.'))
            return;
          }
          
        
        const response = await apiClient.post('/site/update_config', {site_id: currentSite._id, changes: changes})
        if (response.status === 200) {
            // Merge changes into the current site object
            const updatedSite = { ...currentSite, ...changes };
            dispatch(setSite(updatedSite));
            dispatch(showPopup('Settings saved successfully.'))
          }
    }

    return (
        <div id="Settings">
            <div id="mpTopBar">
                <button onClick={() => { navigateTo("/") }} className="action_button">&lt; Dashboard</button>
                <p>{currentSite._id}</p>
                <button onClick={save} id="settingsSave">Save</button>
            </div>
            <div id="settingsMain">
                <div onClick={()=>{navigateTo('/settings/site_colors')}} className="settingsItem stcursor">
                    <h3>Site Colors &gt;</h3>
                </div>

                <div onClick={()=>navigateTo('/settings/site_layout')} className="settingsItem stcursor">
                    <h3>Site Layout / Theme &gt;</h3>
                </div>
                <div className="settingsItem">
                    <header>Live Chat</header>
                    <MenuToogle title="Enable Live Chat" status={liveChat} onchange={()=>{setLiveChat(!liveChat)}} />
                </div>
                <div className="settingsItem">
                    <header>Replies</header>
                    <MenuToogle title="Reply to comments" status={replies} onchange={()=>{setReplies(!replies)}} />
                </div>
                <div className="settingsItem">
                    <header>Reactions</header>
                    <MenuToogle title="Likes" status={showLikes} onchange={()=>{setShowLikes(!showLikes)}} />
                    <MenuToogle title="Dislikes" status={showDislikes} onchange={()=>{setShowDislikes(!showDislikes)}} />
                </div>
                <div className="settingsItem">
                    <header>Comment Clearance</header>
                    <MenuToogle title="Approve comments before they are displayed on the webpage. Note this feature does not work with live chat on." status={commentApproval} onchange={()=>{setCommentApproval(!commentApproval)}} />
                </div>
                <div className="settingsItem">
                    <header>User Identification</header>
                    <MenuToogle title="Secure Login(Password). Turn off for Username only(Free use)" status={identification} onchange={()=>{setIdentification(!identification)}} />
                </div>
                <div className="settingsItem">
                    <header>File Attachments(Comming Soon)</header>
                    <MenuToogle title="Allow Attachments(Comming Soon)" status={false} />
                </div>
            </div>
        </div>
    )
}
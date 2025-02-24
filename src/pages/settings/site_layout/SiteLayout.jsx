import { useDispatch, useSelector } from "react-redux"
import { navigateTo } from "../../../services/navigation"
import '../site_colors/sitecolors.css'
import apiClient from "../../../services/apiClient"
import { useEffect, useState } from "react"
import { setSite } from "../../../redux/siteSlice"


export default function SiteLayout() {
    const dispatch = useDispatch()
    const currentSite = useSelector((state) => state.site.site)
    const [showSave, setShowSave] = useState(false)
    const [currentTheme, setCurrentTheme] = useState(currentSite.theme)


    useEffect(() => {

        if (document.getElementById('teemboom_comments').innerHTML === '') teemboom_comments_load(currentSite.theme)
        let currentSiteStyle = currentSite.style.colors.main
        for (let key of Object.keys(currentSiteStyle)) {
            const checkElement = setInterval(() => {
                const element = document.getElementsByClassName('teemboom_root')[0];
                if (element) {
                    element.style.setProperty(`--teemboom-${key}`, currentSiteStyle[key]);
                    clearInterval(checkElement); // Stop checking once found
                }
            }, 1000);
        }
    }, [])

    async function save() {
        const response = await apiClient.post('/site/update_config', { site_id: currentSite._id, changes: { 'theme': currentTheme } })
        setShowSave(false)

        const resp = await fetch(`https://comment-themes.teemboom.com/${currentSite.theme}/styles.json`);
        const stylesGuide = await resp.json();
        let changes = {}
        for (let item of Object.keys(stylesGuide)) {
            changes[item] = stylesGuide[item].default
        }
        const res = await apiClient.post('/site/update_styles', { site_id: currentSite._id, changes: changes })

        const updatedSite = { ...currentSite, ...{'theme': currentTheme}};
        dispatch(setSite(updatedSite));
    }

    function changeTheme(name) {
        let css = document.getElementsByClassName('teemboom_css')
        for (let elem of css) {
            elem.remove()
        }
        let js = document.getElementsByClassName('teemboom_js')
        for (let elem of js) {
            elem.remove()
        }
        document.getElementById('teemboom_comments').innerHTML = ''
        teemboom_comments_load(name)
        setCurrentTheme(name)
        setShowSave(true)
    }

    return (
        <div>
            <div id="mpTopBar">
                <button onClick={() => { navigateTo("/settings") }} className="action_button">&lt; Settings</button>
                <p>{currentSite._id}</p>
                {showSave && <button onClick={save} id="settingsSave">Save</button>}
            </div>
            <div id="scmain">
                <div id="scpanel">
                    <header id="scpanelheader">Select Layout</header>

                    <div onClick={() => { changeTheme('clear_land') }} className="sctheme">Clear Land (Standard)</div>
                    <div onClick={() => { changeTheme('floating_clouds') }} className="sctheme">Floating Clouds (Standard)</div>
                    <div onClick={() => { changeTheme('open_house') }} className="sctheme">Open house (Rapid Fire)</div>
                </div>
                <div id="scpreview">
                    <div id="teemboom_comments"></div>
                </div>
            </div>
        </div>
    )
}
import { useSelector } from "react-redux"
import { navigateTo } from "../../../services/navigation"
import './sitecolors.css'
import apiClient from "../../../services/apiClient"
import { useEffect, useRef, useState } from "react"
import Picker from "vanilla-picker"


export default function SiteColors() {
    const currentSite = useSelector((state) => state.site.site)
    const [stylesGuide, setStylesGuide] = useState([])
    const [pickerDivs, setPickerDivs] = useState([])
    const [showSave, setShowSave] = useState(true)


    async function fetchStylesGuide() {
        const response = await fetch(`https://comment-themes.teemboom.com/${currentSite.theme}/styles.json`);
        const data = await response.json();
        let currentSiteStyle = currentSite.style.colors.main
        for (let key of Object.keys(data)){
            if (currentSiteStyle[key]){
                data[key].default = currentSiteStyle[key]
            }
            const checkElement = setInterval(() => {
                const element = document.getElementsByClassName('teemboom_root')[0];
                if (element) {
                    element.style.setProperty(`--teemboom-${key}`, data[key].default);
                    clearInterval(checkElement); // Stop checking once found
                }
            }, 1000);
        }
        setStylesGuide(data)
    };

    function handleColorChange(key, newColor) {
        setStylesGuide(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                default: newColor
            }
        }));
        document.getElementsByClassName('teemboom_root')[0]?.style.setProperty(`--teemboom-${key}`, newColor);
        setShowSave(true)
    }

    function showPicker(e, key, color) {
        if (!pickerDivs.includes(key)) {
            setPickerDivs([...pickerDivs, key])
            let picker = new Picker({
                parent: e,
                color: color
            })
            picker.onChange = (color) => {
                handleColorChange(key, color.rgbString)
            }
            setTimeout(() => {
                e.click()
            }, 200);
        }

    }

    useEffect(() => {
        teemboom_comments_load(currentSite.theme)
        fetchStylesGuide()
    }, [])

    async function save(){
        let changes = {}
        for (let item of Object.keys(stylesGuide)){
            changes[item] = stylesGuide[item].default
        }
        const response = await apiClient.post('/site/update_styles', {site_id: currentSite._id, changes: changes})
        setShowSave(false)
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
                    {Object.entries(stylesGuide).map(([key, value]) => (
                        <div key={key} className="scpitem">
                            <header>{value.title}</header>
                            <div onClick={(e) => { showPicker(e.target, key, value.default) }} style={{ background: value.default }} className="scpitemcolor"></div>
                            <input type="text" value={value.default} onChange={(e) => { handleColorChange(key, e.target.value) }} className="scpitemcolortext"></input>
                        </div>
                    ))}
                </div>
                <div id="scpreview">
                    <div id="teemboom_comments"></div>
                </div>
            </div>
        </div>
    )
}
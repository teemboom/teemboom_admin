import ToggleSwitch from '../toogleSwitch/ToogleSwitch'
import './menutoogle.css'

export default function MenuToogle({title, status, onchange}){
    return (
        <div className="menuToogle">
            <p>{title}</p>
            <ToggleSwitch status={status} onchange={onchange} />
            </div>
    )
}
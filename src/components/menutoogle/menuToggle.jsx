import ToggleSwitch from '../toogleSwitch/ToogleSwitch'
import './menutoogle.css'

export default function MenuToogle({title, status, sendStatus}){
    return (
        <div className="menuToogle">
            <p>{title}</p>
            <ToggleSwitch status={status} />
            </div>
    )
}
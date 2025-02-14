import { useState } from "react";
import './toogleswitch.css'

export default function ToggleSwitch({status}) {
  const [isOn, setIsOn] = useState(status);
  console.log(isOn)
  const toggle = () => setIsOn(!isOn);

  return (
    <div 
      className="toggle-container" 
      onClick={toggle}
    >
      <div className={`toggle-circle ${isOn ? "on" : "off"}`}></div>
    </div>
  );
}
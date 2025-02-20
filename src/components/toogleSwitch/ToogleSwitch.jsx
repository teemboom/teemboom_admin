import { useState } from "react";
import './toogleswitch.css'

export default function ToggleSwitch({status, onchange}) {
  const [isOn, setIsOn] = useState(status);
  const toggle = () => {
    setIsOn(!isOn);
    onchange()
  };

  return (
    <div 
      className="toggle-container" 
      onClick={toggle}
    >
      <div className={`toggle-circle ${isOn ? "on" : "off"}`}></div>
    </div>
  );
}
import React from 'react';
import './Popup.css';
import { useSelector, useDispatch } from 'react-redux';
import { hidePopup } from '../redux/popupSlice';

const Popup = () => {
  const dispatch = useDispatch();
  const { isVisible, message } = useSelector((state) => state.popup);

  if (!isVisible) return null;

  return (
    <div className="popup-overlay" onClick={() => dispatch(hidePopup())}>
      <div className="popup-content">
        <p>{message}</p>
        <button onClick={() => dispatch(hidePopup())}>Close</button>
      </div>
    </div>
  );
};

export default Popup; 
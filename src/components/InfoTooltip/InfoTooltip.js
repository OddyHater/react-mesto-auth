import React from 'react';

const InfoTooltip = ({isOpen, name, title, image, onClose}) => {
  return (
    <div className={
        isOpen ? `popup popup-${name} popup_opened` : 
        `popup popup-${name}`}>
  
        <div className={`popup__container popup-${name}__container`}>
          
          <img src={`${image}`} alt="" className={`popup-${name}__image`} />

          <h2 
            className={`popup-${name}__title`}>
              {title}
          </h2>

          <button
            type="button"
            aria-label="Закрыть"
            className="popup__close-button clickable"
            onClick={onClose}>
  
          </button>
  
        </div>
  
      </div>
  )
};

export default InfoTooltip;

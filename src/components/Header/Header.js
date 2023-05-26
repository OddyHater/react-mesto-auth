import React from "react";
import logoPath from '../../images/svg/logo-white.svg';

function Header({email, handleLoggoutButtonClick}) {
    return (
        <header className="header">
            <a href="/" className="header__link">
            <img src={logoPath} alt="Логотип Место" className="header__logo"/>
            </a>
            <div className="header__button-container">
              <p className="header__email">{email}</p>
              <button 
              type="button" 
              onClick={handleLoggoutButtonClick}
              className="header__button"
              >Выйти</button>
            </div>
        </header>
    );
}

export default Header;
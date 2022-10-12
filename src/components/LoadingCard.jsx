import React from 'react';

/* Logo */
import { ReactComponent as LogoSpinner } from '../media/logo_spinner.svg';

const LoadingCard = () => {
  return (
    <div className="loading-card__container">
      <div>
        <div className="rotate-center">
          <LogoSpinner />
        </div>
        <p id="loading-text">Cargando información...</p>
      </div>
    </div>
  );
};

export default LoadingCard;

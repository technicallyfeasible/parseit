import React from 'react';
import constants from '../constants';

const Header = () => {
  const brandName = constants.PACKAGE_NAME;
  return (
    <div className="col-xs-12 header">
      <div className="container">
        <div className="package-brand">
          {brandName}
        </div>
      </div>
    </div>
  );
};

export default Header;

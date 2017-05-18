import React from 'react';
import constants from '../constants';
import Showcase from '../containers/Showcase';

const Hero = () => {
  const brandName = constants.PACKAGE_NAME;
  const brandDesc = constants.PACKAGE_DESCRIPTION;
  return (
    <div className="col-xs-12 hero">
      <div className="container">
        <h1>{brandName}</h1>
        <p>{brandDesc}</p>
        <Showcase />
      </div>
    </div>
  );
};

export default Hero;

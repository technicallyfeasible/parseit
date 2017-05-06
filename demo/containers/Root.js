import React from 'react';
import PropTypes from 'prop-types';

import DataParserTest from './DataParserTest';


export default function Root() {
  return (
    <div>
      <DataParserTest />
    </div>
  );
}

Root.propTypes = {
  children: PropTypes.node,
};

Root.defaultProps = {
  children: null,
};

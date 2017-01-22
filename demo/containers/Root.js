import React, { PropTypes } from 'react';

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

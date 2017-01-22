import React from 'react';
import ReactDOM from 'react-dom';

import Root from './containers/Root';

function render() {
  ReactDOM.render(<Root />, document.getElementById('root'));
}

if (document.readyState !== 'completed') {
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}

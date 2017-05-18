import React from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Hero from '../components/Hero';
import DataParserTest from './DataParserTest';


export default function Root() {
  return [
    <Header />,
    <Hero />,
    <DataParserTest />,
  ];
}

Root.propTypes = {
  children: PropTypes.node,
};

Root.defaultProps = {
  children: null,
};

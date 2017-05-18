import React from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ParserBenchmark from '../components/ParserBenchmark';


export default function Root() {
  return (
    <div>
      <Header />
      <Hero />

      <ParserBenchmark />
    </div>
  );
}

Root.propTypes = {
  children: PropTypes.node,
};

Root.defaultProps = {
  children: null,
};

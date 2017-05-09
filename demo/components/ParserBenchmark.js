import React, { Component } from 'react';
import process from 'process';
import _ from 'lodash';
import benchmark from 'benchmark';

import {
  DataParser,
  modules,
} from '../../src/index';

let Benchmark = benchmark;
if (typeof window !== 'undefined') {
  Benchmark = benchmark.runInContext({ _, process });
  window.Benchmark = Benchmark;
}

const { DefaultValidator, BooleanParserModule, NumberParserModule } = modules;

const createParserBenchmarks = {
  'Create#all': () => {
    // eslint-disable-next-line no-new
    new DataParser('myParser', [DefaultValidator, BooleanParserModule, NumberParserModule]);
  },
  'Create#boolean': () => {
    // eslint-disable-next-line no-new
    new DataParser('myParser', [DefaultValidator, BooleanParserModule]);
  },
  'Create#number': () => {
    // eslint-disable-next-line no-new
    new DataParser('myParser', [DefaultValidator, NumberParserModule]);
  },
};

const numberParser = new DataParser('myParser', [DefaultValidator, NumberParserModule]);
const numberParserBenchmarks = {
  'Number#integer#simple': () => {
    numberParser.parse('47');
  },
  'Number#integer#medium': () => {
    numberParser.parse('4,786');
  },
  'Number#integer#long': () => {
    numberParser.parse(' 4,786,327 mm/s  ');
  },
};


export default class ParserBenchmark extends Component {
  constructor() {
    super();
    this.state = {
      results: {},
      running: false,
    };
  }

  start() {
    const suite = new Benchmark.Suite();

    Object.keys(createParserBenchmarks).forEach(key => suite.add(key, createParserBenchmarks[key]));
    Object.keys(numberParserBenchmarks).forEach(key => suite.add(key, numberParserBenchmarks[key]));

    suite.on('start', (event) => {
      const results = {
        ...this.state.results,
        [event.target.name]: event.target,
      };
      this.setState({ results, running: true });
    })
    .on('cycle', (event) => {
      const results = {
        ...this.state.results,
        [event.target.name]: event.target,
      };
      this.setState({ results });
    })
    .on('complete', () => {
      this.setState({ running: false });
    })
    .run({ async: true });
  }

  render() {
    const { results, running } = this.state;
    return (
      <div>
        <h3>Benchmark</h3>
        <button className="btn btn-default" disabled={running} onClick={() => this.start()}>{ running ? 'Stop' : 'Start' }</button>
        <div>{ Object.keys(results).map(key => <div key={key}>{ String(results[key]) }</div>) }</div>
      </div>
    );
  }
}

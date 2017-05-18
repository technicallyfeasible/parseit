import React, { Component } from 'react';
import process from 'process';
import _ from 'lodash';
import benchmark from 'benchmark';

import {
  DataParser,
  modules,
  PatternContext,
} from '../../src/index';

let Benchmark = benchmark;
if (typeof window !== 'undefined') {
  Benchmark = benchmark.runInContext({ _, process });
  window.Benchmark = Benchmark;
}

const { DefaultValidator/* , BooleanParserModule */, NumberParserModule } = modules;
const context = new PatternContext({ reasons: false });

/**
 * Generate a minimalistic function that traverses a string as a baseline test for maximum achievable speed
 * @param str
 * @return {test}
 */
function getBaselineTest(str) {
  return function test() {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += str[i];
    }
    return result;
  };
}

// const createParserBenchmarks = {
//   'Create#all': () => {
//     // eslint-disable-next-line no-new
//     new DataParser('myParser', [DefaultValidator, BooleanParserModule, NumberParserModule]);
//   },
//   'Create#boolean': () => {
//     // eslint-disable-next-line no-new
//     new DataParser('myParser', [DefaultValidator, BooleanParserModule]);
//   },
//   'Create#number': () => {
//     // eslint-disable-next-line no-new
//     new DataParser('myParser', [DefaultValidator, NumberParserModule]);
//   },
// };
//
// const booleanParser = new DataParser('boolParser', [DefaultValidator, BooleanParserModule]);
// const booleanParserBenchmarks = {
//   'Boolean#string': () => {
//     booleanParser.parse('false');
//   },
//   'Boolean#number': () => {
//     booleanParser.parse('1');
//   },
// };

const numberParser = new DataParser('numberParser', [DefaultValidator, NumberParserModule]);
const numberParserBenchmarks = {
  'Number#integer#base': getBaselineTest(' -4,786,327.343466e-20.43  mm/s '),
  'Number#integer#simple': () => {
    numberParser.parse('47', context);
  },
  'Number#integer#medium': () => {
    numberParser.parse('4,786', context);
  },
  'Number#integer#long': () => {
    numberParser.parse(' 4,786,327  mm/s ', context);
  },
  'Number#integer#extreme': () => {
    numberParser.parse(' -4,786,327.343466e-20.43  mm/s ', context);
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

    // Object.keys(createParserBenchmarks).forEach(key => suite.add(key, createParserBenchmarks[key]));
    // Object.keys(booleanParserBenchmarks).forEach(key => suite.add(key, booleanParserBenchmarks[key]));
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

  // formatNumber(num, digits, units) {
  //   const cutoff = 10 ** digits;
  //   let unit = 0;
  //
  //   ms.toFixed(ms < 10 ? 1 : 0)
  // }

  render() {
    const { results, running } = this.state;

    const metricStyle = {
      display: 'inline-block',
      width: 100,
      textAlign: 'right',
    };

    return (
      <div className="container">
        <div>
          <h3 style={{ display: 'inline-block', marginRight: 10, verticalAlign: 'middle', marginTop: 7 }}>Benchmark</h3>
          <button className="btn btn-default btn-xs" style={{ verticalAlign: 'middle' }} disabled={running} onClick={() => this.start()}>{ running ? 'Stop' : 'Start' }</button>
        </div>
        <div>{ Object.keys(results).map(key => {
          const stat = results[key];
          const ms = ((1.0 / stat.hz) * 1000);
          return (
            <div key={key}>
              <div style={{ display: 'inline-block', width: 200 }}>{ stat.name }</div>
              <div style={metricStyle}>{ stat.count }</div>
              <div style={metricStyle}>{ stat.hz.toFixed(0) } /s</div>
              <div style={metricStyle}>{ ms.toFixed(ms < 10 ? 3 : 0) } ms</div>
            </div>
          );
        }) }</div>
      </div>
    );
  }
}

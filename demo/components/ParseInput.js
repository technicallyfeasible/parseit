import React, { Component, PropTypes } from 'react';

import DataParser from '../../src/DataParser';

export default class DataParserTest extends Component {
  static propTypes = {
    parser: PropTypes.instanceOf(DataParser),
  };

  static defaultProps = {
    parser: null,
  };

  constructor() {
    super();
    this.state = {
      stats: {},
      results: [],
      reasons: [],
    };
  }

  onChange(e) {
    const value = e.target.value;
    window.setTimeout(() => {
      this.parseInput(value);
    }, 0);
  }

  parseInput(text) {
    const { parser } = this.props;

    const start = new Date().getTime();
    const results = parser.parse(text);
    const parse = new Date().getTime() - start;

    this.setState({
      results,
      stats: {
        parse,
      },
    });
  }

  render() {
    const { parser } = this.props;
    const { stats, results } = this.state;

    if (!parser) {
      return null;
    }

    let resultElements = 'No results';
    if (results && results.length > 0) {
      resultElements = JSON.stringify(results, null, 2);
    }

    return (
      <div>
        <div>
          <h3>Type some text to analyse it</h3>
          <textarea type="text" className="form-control" onChange={e => this.onChange(e)} />
        </div>

        <div>
          <h3>Results{ typeof stats.parse === 'number' ? `: ${stats.parse}ms` : '' }</h3>
          <div>{ resultElements }</div>
        </div>
      </div>
    );
  }
}

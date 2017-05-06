import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DataParser from '../../src/DataParser';
import Context from '../../src/PatternContext';

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
    const context = new Context({
      reasons: true,
    });
    const result = parser.parse(text, context);
    const parse = new Date().getTime() - start;

    this.setState({
      results: result.values,
      reasons: result.reasons,
      stats: {
        parse,
      },
    });
  }

  render() {
    const { parser } = this.props;
    const { stats, results, reasons } = this.state;

    if (!parser) {
      return null;
    }

    let resultElements = 'No results';
    if (results && results.length > 0) {
      resultElements = results.map((result, index) => {
        const type = result.constructor.name;
        /* eslint-disable react/no-array-index-key */
        return (
          <div key={index}>
            <span className="label label-primary">{ type }</span> { JSON.stringify(result) }
          </div>
        );
        /* eslint-enable */
      });
    }

    let reasonElements = 'No reasons';
    if (reasons && reasons.length > 0) {
      // reasonElements = JSON.stringify(reasons, null, 2);
      reasonElements = `${reasons.length}`;
    }

    return (
      <div>
        <div>
          <h3>Type some text to analyse it</h3>
          <textarea type="text" className="form-control" onChange={e => this.onChange(e)} />
        </div>

        <div className="row">
          <div className="col col-xs-12 col-sm-6">
            <h3>Results{ typeof stats.parse === 'number' ? `: ${stats.parse}ms` : '' }</h3>
            <div>{ resultElements }</div>
          </div>
          <div className="col col-xs-12 col-sm-6">
            <h3>Reasons{ reasons ? `: ${reasons.length}` : '' }</h3>
            <pre>{ reasonElements }</pre>
          </div>
        </div>
      </div>
    );
  }
}

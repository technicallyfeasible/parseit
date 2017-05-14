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
      showReasons: false,
      reasonDetails: {},
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

  toggleShowReasons() {
    this.setState({ showReasons: !this.state.showReasons });
  }

  toggleReasonDetails(index) {
    this.setState({
      reasonDetails: {
        ...this.state.reasonDetails,
        [index]: !this.state.reasonDetails[index],
      },
    });
  }

  render() {
    const { parser } = this.props;
    const { stats, results, reasons, showReasons } = this.state;

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

    let reasonElements = '';
    if (reasons && reasons.length > 0 && showReasons) {
      // flatten reasons
      const flatReasons = [];
      reasons.forEach(reason => {
        const { token, token: { pos }, patterns, result } = reason;
        patterns.forEach(patternInfo => {
          const { pattern, isReachable } = patternInfo;
          let finalPos = pos;
          if (result) {
            finalPos = token.exactMatch ? pos + token.value.length : pattern.indexOf('}', pos) + 1;
          }
          flatReasons.push({
            // advance position beyond the current token if it was still successful
            pos: finalPos,
            pattern,
            isReachable,
            reasons: reason.reasons,
          });
        });
      });
      // sort by success first
      flatReasons.sort((a, b) => {
        if (a.isReachable && !b.isReachable) return -1;
        if (!a.isReachable && b.isReachable) return 1;
        if (a.pos !== b.pos) {
          return b.pos - a.pos;
        }
        return a.pattern.localeCompare(b.pattern);
      });
      // output paths with match position
      reasonElements = flatReasons.map((patternInfo, index) => {
        const { pos, isReachable, pattern, reasons: patternReasons } = patternInfo;
        let texts;
        if (isReachable) {
          // whole pattern was successful
          texts = [
            pattern,
          ];
        } else {
          texts = [
            pattern.substring(0, pos),
            pattern.substring(pos),
          ];
        }

        const showDetails = this.state.reasonDetails[index];
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>
            <button className="btn btn-link" onClick={() => this.toggleReasonDetails(index)}>
              <span style={{ color: 'green' }}>{ texts[0] }</span>
              { texts[1] ? <span style={{ color: 'red' }}>{ texts[1] }</span> : null }
            </button>
            { !showDetails ? null : <div>{ JSON.stringify(patternReasons, null, 2) }</div> }
          </div>
        );
      });
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
            <h3>
              Reasons{ reasons ? `: ${reasons.length}` : '' }
              <button className="btn btn-link" onClick={() => this.toggleShowReasons()}>{ showReasons ? 'hide' : 'show' }</button>
            </h3>
            <pre>{ reasonElements }</pre>
          </div>
        </div>
      </div>
    );
  }
}

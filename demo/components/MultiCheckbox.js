import React, { Component, PropTypes } from 'react';
import uuid from 'uuid';

export default class MultiCheckbox extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    })),
    /* eslint-disable react/no-unused-prop-types */
    defaultValue: PropTypes.arrayOf(PropTypes.any),
    value: PropTypes.arrayOf(PropTypes.any),
    /* eslint-enable */
  };

  static defaultProps = {
    onChange: function noop() {},
    options: [],
    defaultValue: null,
    value: null,
  };

  componentWillMount() {
    this.updateSelectedState(this.props);
  }

  componentWillReceiveProps(props) {
    this.updateSelectedState(props);
  }

  onClick(value, checked) {
    const { onChange, options } = this.props;
    let { selected } = this.state;

    selected = (selected || []).filter(val => val !== value);
    if (checked) {
      selected.push(value);
    }
    this.setState({ selected });

    // create new options array to make sure we keep the right order
    const values = options.reduce((r, option) => {
      if (selected.indexOf(option.value) !== -1) {
        r.push(option.value);
      }
      return r;
    }, []);
    onChange(values);
  }

  updateSelectedState(props) {
    const { options, defaultValue, value } = props;
    if (options) {
      this.setState({ selected: value || defaultValue });
    }
  }

  render() {
    const { options } = this.props;
    const { selected } = this.state;

    const elements = options
      .map(option => {
        const inputId = uuid();
        const isSelected = (selected && selected.indexOf(option.value) !== -1);
        return (
          <span key={option.label}>
            <input type="checkbox" id={inputId} checked={isSelected || false} onChange={e => this.onClick(option.value, e.target.checked)} />
            <label htmlFor={inputId}>{ option.label }</label>
          </span>
        );
      });

    return (
      <div>
        { elements }
      </div>
    );
  }
}

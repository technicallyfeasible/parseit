import React, { Component } from 'react';

import DataParser from '../../src/DataParser';
import MultiCheckbox from '../components/MultiCheckbox';
import ParseInput from '../components/ParseInput';

import DefaultValidator from '../../src/validators/DefaultValidator';
import BooleanParserModule from '../../src/modules/BooleanParserModule';
import NumberParserModule from '../../src/modules/NumberParserModule';

const moduleTypes = [
  {
    label: 'Default',
    value: DefaultValidator,
  },
  {
    label: 'Boolean',
    value: BooleanParserModule,
  },
  {
    label: 'Number',
    value: NumberParserModule,
  },
];

export default class DataParserTest extends Component {
  constructor() {
    super();
    this.state = {
      parser: null,
      stats: {},
      modules: moduleTypes.map(type => type.value),
    };
    window.setTimeout(() => {
      this.createParser();
    }, 0);
  }

  onModulesChange(modules) {
    this.createParser(modules);
    this.setState({ modules });
  }

  createParser(modules) {
    const startTime = new Date().getTime();
    const parser = new DataParser(null, modules);
    const create = new Date().getTime() - startTime;
    this.setState({
      parser,
      stats: {
        create,
      },
    });
  }

  render() {
    const { parser, modules, stats } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col col-xs-12">
            <h3>Supported types{ typeof stats.create === 'number' ? `: ${stats.create}ms` : '' }</h3>
            <MultiCheckbox options={moduleTypes} onChange={value => this.onModulesChange(value)} value={modules} />
          </div>
        </div>
        <div className="row">
          <div className="col col-xs-12">
            <ParseInput parser={parser} />
          </div>
        </div>
      </div>
    );
  }
}

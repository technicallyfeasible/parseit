import React, { Component } from 'react';

import DataParser from '../../src/DataParser';
import MultiCheckbox from '../components/MultiCheckbox';
import ParseInput from '../components/ParseInput';
import ParserBenchmark from '../components/ParserBenchmark';

import DefaultValidator from '../../src/validators/DefaultValidator';
import BooleanParserModule from '../../src/modules/BooleanParserModule';
import NumberParserModule from '../../src/modules/NumberParserModule';
import EmailParserModule from '../../src/modules/EmailParserModule';
import UriParserModule from '../../src/modules/UriParserModule';

const moduleTypes = [
  {
    label: 'Default',
    value: DefaultValidator,
    selected: true,
  },
  {
    label: 'Boolean',
    value: BooleanParserModule,
    selected: true,
  },
  {
    label: 'Number',
    value: NumberParserModule,
    selected: true,
  },
  {
    label: 'Email',
    value: EmailParserModule,
    selected: true,
  },
  {
    label: 'URI',
    value: UriParserModule,
    selected: true,
  },
];

export default class DataParserTest extends Component {
  constructor() {
    super();
    const modules = moduleTypes.filter(type => type.selected).map(type => type.value);
    this.state = {
      parser: null,
      stats: {},
      modules,
    };
    window.setTimeout(() => {
      this.createParser(modules);
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
        <div className="row">
          <div className="col col-xs-12">
            <ParserBenchmark />
          </div>
        </div>
      </div>
    );
  }
}

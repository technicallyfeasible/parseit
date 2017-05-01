// eslint-disable-next-line import/no-extraneous-dependencies
import DataParser from 'dataparser';
import makeOptions from './boolean.global';

DataParser.modules.BooleanParserModule.defineContext({
  language: 'de',
}, makeOptions({
  trueValues: ['1', 'wahr', 'ja'],
  falseValues: ['0', 'falsch', 'nein'],
}));

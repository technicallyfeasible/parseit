// eslint-disable-next-line import/no-extraneous-dependencies
import DataParser from 'dataparser';
import makeOptions from './number.global';

DataParser.modules.NumberParserModule.defineContext({
  language: 'de',
}, makeOptions({
  commaDecimal: true,
}));

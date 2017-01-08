import DataParser from 'dataparser';

DataParser.modules.BooleanParserModule.defineContext('de', 'de', {
  trueValues: ['1', 'wahr'],
  falseValues: ['0', 'falsch'],
});

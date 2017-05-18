const path = require('path');
const express = require('express');

const app = express();
app.use('/', express.static(path.join(__dirname, '../release/demo')));
app.use('/demo', express.static(path.join(__dirname, '../release/demo')));
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`http://localhost:${server.address().port}/`);
});

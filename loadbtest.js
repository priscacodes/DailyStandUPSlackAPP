const loadb = require('loadb');

const options = {
  n: 10,
  c: 5,
  u: 'http://127.0.0.1:3000/api/v1/slack',
};
loadb.basic(options);

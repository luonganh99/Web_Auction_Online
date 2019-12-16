const db = require('../utils/db');

module.exports = {
  all: () => db.load('select * from users'),
  single: id => db.load(`select * from users where UserID = ${id}`),
  add: entity => db.add('users', entity),
  del: id => db.del('users', { UserID: id }),
};

const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from users_upgrade_sellers'),
    single: id => db.load(`select * from users_upgrade_sellers where UserID = ${id}`),
    add: entity => db.add('users_upgrade_sellers', entity),
    del: id => db.del('users_upgrade_sellers', { UserID: id }),
}  
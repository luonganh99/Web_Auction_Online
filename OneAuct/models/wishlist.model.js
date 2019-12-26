const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from wishlist'),
    single: id => db.load(`select * from wishlist where UserID = ${id}`),
    add: entity => db.add('wishlist', entity),
    del: id => db.del('wishlist', { BidID: id }),
}  
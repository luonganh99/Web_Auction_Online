const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from wishlist'),
    single: id => db.load(`select * from wishlist where UserID = ${id}`),
    add: entity => db.add('wishlist', entity),
    del: id => db.del('wishlist', { UserID: id }),
    allbyUser:  (userID) => db.load(`select p.ProID, p.ProName, p.CurrentPrice, p.State from (select * from wishlist where UserID = ${userID}) w join products p on w.ProID = p.ProID `)
};
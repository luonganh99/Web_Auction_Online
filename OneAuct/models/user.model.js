const db = require('../utils/db');

module.exports = {
  all: () => db.load('select * from users'),
  single: id => db.load(`select * from users where UserID = ${id}`),
  add: entity => db.add('users', entity),
  del: id => db.del('users', { UserID: id }),
  seller: async (proID) => {
    const rows = await db.load(`select * from users u, products p where u.UserID = p.SellerID and p.ProID = ${proID}`);
    return rows[0];
  },
  bidder: async (proID) => {
    const rows = await db.load(`select * from users u, products p where u.UserID = p.BidderID and p.ProID = ${proID}`);
    return rows[0];
  }
};
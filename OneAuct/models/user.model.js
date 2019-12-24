const db = require('../utils/db');

module.exports = {
  all: () => db.load('select * from users'),
  single: async (id) => {
    const rows = await db.load(`select * from users where UserID = ${id}`);
    return rows[0];
  },
  singleByUsername: async (username) => {
    const rows = await db.load(`select * from users where Username = '${username}'`);
    if(rows.length === 0)
      return null;
    return rows[0];
  },
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

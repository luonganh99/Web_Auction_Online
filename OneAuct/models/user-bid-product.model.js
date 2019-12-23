const db = require('../utils/db');

module.exports = {
  all: () => db.load('select * from users_bid_products'),
  single: id => db.load(`select * from users_bid_products where BidID = ${id}`),
  add: entity => db.add('users_bid_products', entity),
  del: id => db.del('users_bid_products', { BidID: id }),
  bidbyPro: async (proID) => {
      const rows = db.load(`select * from users_bid_products  where ProID = ${proID}  order by BidID desc`);
      return rows;
  },
  lastID: () => db.load('select ProID from products order by ProID desc limit 1')
};

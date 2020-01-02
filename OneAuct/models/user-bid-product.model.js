const db = require('../utils/db');

module.exports = {
  all: () => db.load('select * from users_bid_products'),
  single: id => db.load(`select * from users_bid_products where ProID = ${id}`),
  add: entity => db.add('users_bid_products', entity),
  del: id => db.del('users_bid_products', { BidID: id }),
  bidbyPro: async (proID) => {
      const rows = await db.load(`select * from users_bid_products b, users u where b.ProID = ${proID} and b.UserID = u.UserID order by BidID desc`);
      return rows;
  },
  lastID: () => db.load('select ProID from products order by ProID desc limit 1'),
  isBan: async (userID, proID) => {
    const rows = await db.load(`select count(*) as num_ban from users_bid_products where State = 1 and UserID = ${userID} and ProID = ${proID}`);
    return rows[0];
  },
  patch_2: (entity,condition_1,condition_2) => db.patch('users_bid_products',entity,condition_1,condition_2)
};

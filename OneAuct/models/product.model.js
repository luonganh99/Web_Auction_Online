const db = require('../utils/db');
const config = require('../config/default.json');

module.exports = {
    all: () =>  db.load('select * from products'),
    page: (offset,order) =>  db.load(`select * from products order by ${order} limit ${config.paginate.limit} offset ${offset}`),
    allbyCat: catID => db.load(`select * from products where CatID = ${catID}`),
    pagebyCat: (catID,offset,order) => db.load(`select * from products where CatID = ${catID} order by ${order} limit ${config.paginate.limit} offset ${offset}`),
    pagebySearch: (key, offset,order) => db.load(`select * from products where match(ProName, TinyInfo, FullInfo) against ('${key}'  in natural language mode) order by ${order} limit ${config.paginate.limit} offset ${offset}`),
    single: async (id) => {
        const rows = await db.load(`select * from products where ProID = ${id}`);
        return rows[0];
    },
    singlebyName: async (proName) => {
        const rows = await db.load(`select * from products where ProName = '${proName}' order by ProID desc`);
        return rows[0].ProID;
    },
    add: entity => db.add('products', entity),
    del: id => db.del('products', {ProID: id}),
    patch: (entity,condition) => {
        // const condition = {ProID: entity.ProID};
        // delete entity.ProID;
        db.patch('products', entity, condition)
    },
    append: (stringAppend,condition) => {
        db.append('products', 'FullInfo', stringAppend , condition)
    },
    count: async () => {
        const rows = await db.load('select count(ProID) as totalProducts from products');
        return rows[0].totalProducts;
    },
    countbyCat: async (catID) => {
        const rows = await db.load(`select count(ProID) as numProducts from products where CatID = ${catID}`);
        return rows[0].numProducts;
    },
    countbySearch: async (key) => {
        const rows = await db.load(`select count(*) as numProducts from products where match(ProName, TinyInfo, FullInfo) against ('${key}'  in natural language mode)`);
        return rows[0].numProducts;
    },
    wishlist:  (userID) => db.load(`select p.ProID, p.ProName, p.CurrentPrice, p.State, p.CatID from (select * from wishlist where UserID = ${userID}) w join products p on w.ProID = p.ProID `),
    joininglist: (userID) => db.load(`select  ub1.ProID, ub1.Price,  p.ProName, p.CurrentPrice, p.TinyInfo, p.ProID, p.ExpiryDate,p.CatID, p.BidderID  from users_bid_products ub1, products p  where ub1.UserID = ${userID}  and ub1.State = 0 and p.ProID = ub1.ProID and p.ExpiryDate > now() group by  ub1.ProID,ub1.Price,  p.ProName, p.CurrentPrice, p.TinyInfo, p.ProID, p.ExpiryDate, p.BidderID having ub1.Price = (select Max(ub2.Price) from users_bid_products ub2 where ub2.ProID = ub1.ProID)`),
    joinedlist: (userID) => db.load(`select * from (select ProID, Price from users_bid_products where UserID = ${userID} and State = 0 order by BidID desc limit 1) b , products p where b.ProID = p.ProID and ExpiryDate < now()`),
    // wonlist: (userID) => db.load(`select uSeller.FullName, p.ProID, p.ProName, p.TinyInfo, p.ExpiryDate, p.CurrentPrice FROM (select ProID, Price from users_bid_products where UserID =  ${userID}  and State = 0 order by BidID desc limit 1) b , products p, users uSeller, users uBidder  where b.ProID = p.ProID and p.SellerID = uSeller.UserID and uBidder.UserID = p.BidderID and p.State = 1 and uBidder.UserID =  ${userID}`),
    wonlist: (userID) => db.load(`select * from products  where  ExpiryDate < now() and BidderID = ${userID}`),
    reviewlist: (userID) => db.load(`select * from users_rate_users r, products p, users u where r.Rated_UserID = ${userID} and p.ProID = r.ProID and r.UserID = u.UserID`),
    auctionlist: (userID) => db.load(`select * from products where SellerID = ${userID} and ExpiryDate > now()`),
    successlist: (userID) => db.load(`select * from products p, users u where p.SellerID = ${userID} and p.BidderID = u.UserID and State = 1`),
    proByNumBid: () => db.load('select p.ProID, p.ProName, p.CurrentPrice, p.CatID , count(*) as num  from users_bid_products b, products p where b.ProID = p.ProID and p.ExpiryDate > now() group by p.ProID, p.ProName, p.CurrentPrice, p.CatID order by num desc limit 10'),
    proByTime: () => db.load('select * from  products  where ExpiryDate > now()  order by ExpiryDate limit 10'),
    // proByTime: () => db.load('select p.ProID, p.ProName, p.CurrentPrice, p.CatID , p.ExpiryDate  from users_bid_products b, products p where b.ProID = p.ProID and p.ExpiryDate > now() group by p.ProID, p.ProName, p.CurrentPrice, p.CatID, p.ExpiryDate  order by p.ExpiryDate limit 10'),
    // proByPrice: () => db.load('select p.ProID, p.ProName, p.CurrentPrice, p.CatID  from users_bid_products b, products p where b.ProID = p.ProID and p.State = 0 group by p.ProID, p.ProName, p.CurrentPrice, p.CatID  order by p.CurrentPrice desc limit 10'),
    proByPrice: () => db.load('select ProID, ProName, CurrentPrice, CatID from  products  where ExpiryDate > now() group by ProID, ProName, CurrentPrice, CatID  order by CurrentPrice desc limit 10'),
    expired: () => db.load('select p.ProName, p.CurrentPrice , u1.Username as SellerName, u2.Username as BidderName, u1.Email as SellerEmail , u2.Email as BidderEmail from products p , users u1, users u2 where ExpiryDate < now() and p.SellerID = u1.UserID and p.BidderID = u2.UserID and State = 0'),
    update: () => db.load('update products set State = 1 where ExpiryDate < now()')
}
const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from wishlist'),
    single: id => db.load(`select * from wishlist where UserID = ${id}`),
    add: entity => db.add('wishlist', entity),
    del_2: (proID,userID) => db.del('wishlist', { ProID: proID }, { UserID: userID}),
    isExists: (userID,proID) => db.load(`select * from wishlist where UserID = ${userID} and ProID = ${proID}`)
}  
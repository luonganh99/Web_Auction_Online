const db = require('../utils/db');

module.exports = {
    allbyUser:  (userID) => db.load(`select p.ProID, p.ProName, p.CurrentPrice, p.State from (select * from wishlist where UserID = ${userID}) w join products p on w.ProID = p.ProID `)
};
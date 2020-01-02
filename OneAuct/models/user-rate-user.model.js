const db = require('../utils/db');

module.exports = {
    all: () => db.load('select * from users_rate_users'),
    single: id => db.load(`select * from users_rate_users where Rate_UserID = ${id}`),
    add: entity => db.add('users_rate_users', entity),
    del: id => db.del('users_rate_users', { BidID: id }),
    goodReview: async id => {
        const rows = await db.load(`select count(*) as goodRate from users_rate_users where Rated_UserID = ${id} and Grade = true`);
        return rows[0].goodRate;
    },
    badReview: async id => {
        const rows = await db.load(`select count(*) as badRate from users_rate_users where Rated_UserID = ${id} and Grade = false`);
        return rows[0].badRate;
    },
}  
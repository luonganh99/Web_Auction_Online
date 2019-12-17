const db = require('../utils/db');
const config = require('../config/default.json');

module.exports = {
    all: () =>  db.load('select * from products'),
    page: offset =>  db.load(`select * from products limit ${config.paginate.limit} offset ${offset}`),
    allbyCat: catID => db.load(`select * from products where CatID = ${catID}`),
    pagebyCat: (catID,offset) => db.load(`select * from products where CatID = ${catID} limit ${config.paginate.limit} offset ${offset}`),
    single: async (id) => {
        const rows = await db.load(`select * from products where ProID = ${id}`);
        return rows[0];
    },
    add: entity => db.add('products', entity),
    del: id => db.del('products', {ProID: id}),
    patch: entity => {
        const condition = {ProID: entity.ProID};
        delete entity.ProID;
        db.patch('products', entity, condition)
    },
    count: async () => {
        const rows = await db.load('select count(ProID) as totalProducts from products');
        return rows[0].totalProducts;
    },
    countbyCat: async (catID) => {
        const rows = await db.load(`select count(ProID) as numProducts from products where CatID = ${catID}`);
        return rows[0].numProducts;
    }
}
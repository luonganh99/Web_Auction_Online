const db = require('../utils/db');

module.exports = {
    all: () =>  db.load('select * from products'),
    allbyCat: catId => db.load(`select * from products where CatID = ${catId}`),
    single: id => db.load(`select * from products where ProID = ${id}`),
    add: entity => db.add('products', entity),
    del: id => db.del('products', {ProID: id}),
    patch: entity => {
        const condition = {ProID: entity.ProID};
        delete entity.ProID;
        db.patch('products', entity, condition)
    }
}
const db = require('../utils/db');

module.exports = {
    all: () =>  db.load('select * from categories'),
    single: async (id) => {
        const rows = await db.load(`select * from categories where CatID = ${id}`);
        return rows[0];
    },
    add: entity => db.add('categories', entity),
    del: id => db.del('categories', {CatID: id}),
    patch: entity => {
        const condition = {CatID: entity.CatID};
        delete entity.CatID;
        db.patch('categories', entity, condition)
    },
    allWithDetails: () => {
        const sql = `
          select c.CatID, c.CatName, count(p.ProID) as num_of_products
          from categories c left join products p on c.CatID = p.CatID
          group by c.CatID, c.CatName`;
        return db.load(sql);
    },
    singleByName: async (catName) => {
        const rows = await db.load(`select CatID from categories where CatName = ${catName}`);
        return rows[0];
    }
}
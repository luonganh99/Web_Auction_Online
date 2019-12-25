const db = require('../utils/db');

module.exports = {
    all: () =>  db.load('select * from categories where ParentID is null'),
    allBySub: (parentID) => db.load(`select * from categories where ParentID = ${parentID}`),
    singleBySub: async (parentID,catID) => {
        const rows = await db.load(`select * from categories where CatID = ${catID} and ParentID = ${parentID}`);
        return rows[0];
    },
    single: async (catID) => {
        const rows = await db.load(`select * from categories where CatID = ${catID} and ParentID is null`);
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
          from categories c left join products p on c.CatID = p.CatID where ParentID is not null
          group by c.CatID, c.CatName`;
        return db.load(sql);
    },
    singleByName: async (catName) => {
        const rows = await db.load(`select CatID from categories where CatName = ${catName} where ParentID is not null`);
        return rows[0];
    }
}
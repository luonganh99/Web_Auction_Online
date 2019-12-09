const categoryModel = require('../models/category.model');

module.exports = (app) => {
    app.use(async (req, res, next) => {
        const rows = await categoryModel.allWithDetails();
        res.locals.lcCategories = rows;
        next();
    });
}


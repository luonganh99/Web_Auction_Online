const categoryModel = require('../models/category.model');

module.exports = (app) => {
    app.use(async (req, res, next) => {
        const parents = await categoryModel.all();
        for(i = 0; i < parents.length; i++){
            const categories = await categoryModel.allBySub(parents[i].CatID);
            parents[i].SubCategories = categories;
        }
        res.locals.lcCategories = parents;
        if(typeof(req.session.isAuthenticated) === 'undefined') {
            req.session.isAuthenticated = false;
        }
        res.locals.isAuthenticated = req.session.isAuthenticated;
        res.locals.authUser = req.session.authUser;
        next();
    });
}


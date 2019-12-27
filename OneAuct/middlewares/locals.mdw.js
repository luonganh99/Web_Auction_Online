const categoryModel = require('../models/category.model');

module.exports = (app) => {
    app.use(async (req, res, next) => {
        const parents = await categoryModel.all();
        for(i = 0; i < parents.length; i++){
            const categories = await categoryModel.allBySub(parents[i].CatID);
            parents[i].SubCategories = categories;
        }
        res.locals.lcCategories = parents;
        res.locals.isAuthenticated = true;
        if(typeof(req.session.isAuthenticated) === 'undefined') {
            res.locals.isAuthenticated = false;
        }
       
        res.locals.authUser = req.session.authUser;
        next();
    });
}


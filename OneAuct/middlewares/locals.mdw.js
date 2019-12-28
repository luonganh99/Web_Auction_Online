const categoryModel = require('../models/category.model');

module.exports = (app) => {
    app.use(async (req, res, next) => {
        const parents = await categoryModel.all();
        for(i = 0; i < parents.length; i++){
            const categories = await categoryModel.allBySub(parents[i].CatID);
            parents[i].SubCategories = categories;
        }
        res.locals.lcCategories = parents;
        
        if(typeof(req.session.isAuthenticated) === 'undefined' || req.session.isAuthenticated === false) {
            //Chưa đăng nhập
            res.locals.isAuthenticated = false;
        } else {
            //Sau khi đăng nhập
            res.locals.isAuthenticated = true;
            if(req.session.authUser.Permission === 1) {
                res.locals.isSeller = true;
            } else {
                res.locals.isSeller = false;
            }
        }
        res.locals.authUser = req.session.authUser;
        
        next();
    });
}


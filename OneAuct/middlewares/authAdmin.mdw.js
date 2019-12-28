module.exports = (req,res,next) => {
    if(req.session.isAuthenticated !== 2) 
        return res.redirect(`/account/login?retUrl=${req.originalUrl}`);
    next();
}
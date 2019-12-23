module.exports = (req,res,next) => {
    if(req.session.isAuthenticated !== 0) 
        return res.redirect(`/account/login?retUrl=${req.originalUrl}`);
    next();
}
const restrictUser = require('../middlewares/authUser.mdw');
const restrictAdmin = require('../middlewares/authAdmin.mdw');

module.exports = (app) => {
    // Route Admin
    app.use('/admin/categories', require('../routes/admin/category.route'));
    app.use('/admin/upgrade', require('../routes/admin/upgrade.route'));
    app.use('/admin/user', require('../routes/admin/user.route'));

    // Route User
    app.use('/user', restrictUser, require('../routes/user/categories.route'));

    // Route Main
    app.use('/', require('../routes/main/home.route'));
    app.use('/shop', require('../routes/main/shop.route'));
    app.use('/account', require('../routes/main/account.route'));
   
    app.get('/blog', (req, res) => {
        res.render('main/blog', {
            title: 'Blog',
            style: 'blog_styles.css',
            style_responsive: 'blog_responsive.css'
        });
    });

    app.get('/blogdetail', (req, res) => {
        res.render('main/blog-detail');
    });

    app.get('/contact', (req, res) => {
        res.render('main/contact');
    });

    app.use((req,res,next) => {
        res.send('You\'re lost' );
    })
}

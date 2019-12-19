module.exports = (app) => {
    // Route Admin
    app.use('/admin/categories', require('../routes/admin/category.route'));

    // Route User
    app.use('/user', require('../routes/user/categories.route'));

    // Route Main
    app.get('/', (req, res) => {
        res.render('main/home');
    });
    app.use('/shop', require('../routes/shop/shop.route'));
    app.use('/account', require('../routes/shop/account.route.js'));
   
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

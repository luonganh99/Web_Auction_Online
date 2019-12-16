module.exports = (app) => {
    app.use('/admin/categories', require('../routes/admin/category.route'));

    app.use('/shop', require('../routes/user/shop.route'));

    app.use('/user', require('../routes/user/user-categories.route'));

    app.use('/account', require('../routes/user/account.route.js'));

    app.get('/', (req, res) => {
        res.render('home');
    });

    app.get('/blog', (req, res) => {
        res.render('blog', {
            title: 'Blog',
            style: 'blog_styles.css',
            style_responsive: 'blog_responsive.css'
        });
    });

    app.get('/blogdetail', (req, res) => {
        res.render('blog-detail');
    });


    app.get('/contact', (req, res) => {
        res.render('contact');
    });


    app.use((req,res,next) => {
        res.send('You\'re lost' );
    })
}

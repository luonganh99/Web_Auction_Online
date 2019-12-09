module.exports = (app) => {
    app.use('/admin/categories', require('../routes/admin/category.route'));

    app.use('/shop', require('../routes/user/category.route'));

    app.get('/', (req, res) => {
        res.render('home', {
            title: 'OneAunct',
            style: 'main_styles.css',
            style_responsive: 'responsive.css'
        });
    });

    app.get('/product', (req, res) => {
        res.render('product-detail', {
            title: 'Product Detail',
            style: 'product_styles.css',
            style_responsive: 'product_responsive.css'
        });
    });

    app.get('/register', (req, res) => {
        res.render('register', {
            title: 'Register',
            style_specific: 'register.css',
            style: 'product_styles.css',
            style_responsive: 'product_responsive.css'
        });
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

    app.get('/wishlist', (req, res) => {
        res.render('wish-list', {
            title: 'Wish List',
            style_specific: 'wishlist.css',
            style: 'product_styles.css',
            style_responsive: 'product_responsive.css'
        });
    });

    app.get('/contact', (req, res) => {
        res.render('contact', {
            title: 'Contact',
            style_specific: '',
            style: 'contact_styles.css',
            style_responsive: 'contact_reponsive.css'
        });
    });

    app.get('/account', (req, res) => {
        res.render('user-categories/user-account', {
            title: 'User Account',
            layout: 'user-categories',
            style_specific: 'account.css',
            style: 'product_styles.css',
            style_responsive: 'product_responsive.css'
        });
    });

    app.use((req,res,next) => {
        res.send('You\'re lost' );
    })
}

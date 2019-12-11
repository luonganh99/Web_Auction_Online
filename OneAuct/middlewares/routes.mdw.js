module.exports = (app) => {
    app.use('/admin/categories', require('../routes/admin/category.route'));

    app.use('/shop', require('../routes/user/shop.route'));

    app.use('/user', require('../routes/user/user-categories.route'));


    app.get('/', (req, res) => {
        res.render('home', {
            title: 'OneAunct',
            style: 'main_styles.css',
            style_responsive: 'responsive.css'
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



    app.get('/contact', (req, res) => {
        res.render('contact', {
            title: 'Contact',
            style_specific: '',
            style: 'contact_styles.css',
            style_responsive: 'contact_reponsive.css'
        });
    });


    app.use((req,res,next) => {
        res.send('You\'re lost' );
    })
}

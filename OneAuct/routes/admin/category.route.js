const express = require('express');
const categoryModel = require('../../models/category.model');

const router = express.Router();

router.get('/', async (req, res) => {
    const categories = await categoryModel.all();
    res.render('admin-categories/index', {
        layout: 'admin-categories',
        categories,
        empty: categories.length === 0
    });
});  

router.get('/add', (req,res) => {
    res.render('admin-categories/add', {
        layout: 'admin-categories'
    });
});  

router.post('/add', async (req,res) => {
    const result = await categoryModel.add(req.body);
    res.render('admin-categories/add', {
        layout: 'admin-categories'
    });
})

router.get('/err', (req,res) => {
    throw new Error('Error occured');
});

router.get('/edit/:id', async (req, res) => {
    const category = await categoryModel.single(req.params.id);
    if(category.length === 0){
        throw new Error('Invalid category ID');
    }
    res.render('admin-categories/edit', {
        layout: 'admin-categories',
        category
    });
})

router.post('/del', async (req,res) => {
    const results = await categoryModel.del(req.body.CatID);
    res.redirect('/admin/categories');
})

router.post('/patch', async (req,res) => {
    const results = await categoryModel.patch(req.body);
    res.redirect('/admin/categories');
})

module.exports = router;
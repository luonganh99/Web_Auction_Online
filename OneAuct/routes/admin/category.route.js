const express = require('express');
const categoryModel = require('../../models/category.model');

const router = express.Router();

router.get('/', async (req, res) => {
    const categories = await categoryModel.all();
    res.render('admin/index', {
        layout: 'admin',
        categories,
        empty: categories.length === 0
    });
});  

router.get('/add', (req,res) => {
    res.render('admin/add', {
        layout: 'admin'
    });
});  

router.post('/add', async (req,res) => {
    const result = await categoryModel.add(req.body);
    res.redirect('/admin/categories');
})


router.get('/edit/:catID', async (req, res) => {
    const category = await categoryModel.single(req.params.catID);
    if(category.length === 0){
        throw new Error('Invalid category ID');
    }
    res.render('admin/edit', {
        layout: 'admin',
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

router.get('/err', (req,res) => {
    throw new Error('Error occured');
});

router.get('/:parentID', async (req,res) => {
    const subCategories = await categoryModel.allBySub(req.params.parentID);  
    const category = await categoryModel.single(req.params.parentID);

    res.render('admin/sub-index', {
        layout: 'admin',
        subCategories,
        category,
        empty: subCategories.length === 0
    });
});

router.get('/:parentID/add', async (req,res) => {
    const category = await categoryModel.single(req.params.parentID);
    res.render('admin/sub-add', {
        layout: 'admin',
        category
    });
});  

router.post('/:parentID/add', async (req,res) => {
    const result = await categoryModel.add(req.body);
    res.redirect(`/admin/categories/${req.params.parentID}`);
})



router.get('/:parentID/edit/:catID', async (req, res) => {
    const category = await categoryModel.singleBySub(req.params.parentID,req.params.catID);
    if(category.length === 0){
        throw new Error('Invalid category ID');
    }
    res.render('admin/sub-edit', {
        layout: 'admin',
        category
    });
})



router.post('/:parentID/del', async (req,res) => {
    console.log(req.body);
    const results = await categoryModel.del(req.body.CatID);
    res.redirect(`/admin/categories/${req.params.parentID}`);
})

router.post('/:parentID/patch', async (req,res) => {
    const results = await categoryModel.patch(req.body);
    res.redirect(`/admin/categories/${req.params.parentID}`);
})

module.exports = router;
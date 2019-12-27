const express = require('express');
const categoryModel = require('../../models/category.model');
const productModel = require('../../models/product.model')
const config = require('../../config/default.json');
const limit = config.paginate.limit;
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

router.get('/:parentID/product/:catID', async (req,res) => {
    const catID = req.params.catID;
    const parentID = req.params.parentID;
    //Tao offset tu page request
    const page = req.query.page || 1;
    if(page < 1) page = 1;
    const offset = (page - 1) * limit;

    //Lay du lieu tu database
    const [totalProducts,products,categories] = await Promise.all([
        productModel.countbyCat(catID),
        productModel.pagebyCat(catID,offset),
        categoryModel.single(catID)
    ]);
    //Tong so trang
    let nPages = Math.floor(totalProducts/limit);
    if(totalProducts%limit > 0) nPages++;

    //Mang page de hient hien thi view
    const page_numbers = [];
    for(i = 1; i <= nPages; i++){
        page_numbers.push({
            value: i,
            isCurrent: i === +page
        })
    }

    //Tao nut bam
    let prev_value = +page - 1;
    let next_value = +page + 1;
    if(prev_value < 1) prev_value = 1;
    if(next_value > nPages) next_value = nPages;


    res.render('admin/product', {
        layout: 'admin',
        parentID,
        products,
        totalProducts,
        page_numbers,
        prev_value,
        next_value,
        nameCategory: categories.CatName,
        empty: products.length === 0
    });
});

router.post('/:parentID/product/:catID/delete/:proID', async (req,res) => {
    // Xóa
    const results = await productModel.del(req.params.proID);
    res.redirect(`/admin/categories/${req.params.parentID}/product/${req.params.catID}`);
});

module.exports = router;
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing:false
 
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  console.log(res.body)

  req.user.createProduct({
    title:title,
    price: price,
    imageUrl: imageUrl,
    description: description,
  })
 .then(result =>{console.log(result)
  res.redirect('/admin/products')
})
 .catch(err =>console.log(res.body))
  
};

exports.getEditProduct = (req, res, next) => {
  const editMode=req.query.edit
  if(!editMode){
    return res.redirect('/')
  }
  const productId=req.params.productId;
  // Product.findByPk(productId)
  req.user.getProducts({where:{id:productId}})
  .then(products =>{
    const product=products[0]
    if(!product){
      return res.redirect('/')
    }
    res.render('admin/edit-product', {
      pageTitle: 'edit Product',
      path: '/admin/edit-product',
      editing:editMode,
      product:product
   
    });
  })
  
};
exports.postEditProduct=(req,res,next)=>{
  const proId=req.body.productId;
  const updatedTitle=req.body.title
  const updatedPrice=req.body.price
  const updatedimgUrl=req.body.imageUrl;
  const updatedDesc=req.body.description

  Product.findByPk(proId).then(product=>{
    product.title=updatedTitle;
   
    product.price= updatedPrice ;
   
    product.description= updatedDesc;
    product.imageUrl= updatedimgUrl;
    return product.save();

  })
  .then(product=>{
    console.log("updated")
    res.redirect('/admin/products');
  })
  .catch(err=>{
    console.log(err)
  })
  
  
  


}

exports.getProducts = (req, res, next) => {
  // Product.findAll( )
  req.user.getProducts()
  .then((products)=>{
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err=>{
    console.log(err)
  })
 
};

exports.postDeleteProduct=(req,res,next)=>{
  const proId=req.body.productId;
  Product.findByPk(proId).then((product)=>{
    return  product.destroy()
   
  }).then((result)=>{
    console.log("deleted");
    res.redirect('/admin/products')

  })
  .catch(err=>{
    console.log(err)
  });
  

}
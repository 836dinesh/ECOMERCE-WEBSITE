const Product = require('../models/product');
const Cart = require('../models/cart');

const ITEAM_PER_PAGE=2;

exports.getProducts = (req, res, next) => {
  const page=req.query.page ||1;
  var totalCountPage;

  Product.count().then(pagecnt=>{
    totalCountPage=Math.ceil(pagecnt/ITEAM_PER_PAGE) 
   return Product.findAll({offset:(page-1)*ITEAM_PER_PAGE,limit:ITEAM_PER_PAGE})
   
    
  })

  .then((produucts)=>{
    console.log(totalCountPage)
    res.json({produucts,pageCount:totalCountPage})
    // res.render('shop/product-list', {
    //   prods: produucts,
    //   pageTitle: 'All Products',
    //   path: '/products'
    // });
  })
  .catch(err=>{
    console.log(err);
  })
 
};

exports.getProduct=(req,res,next)=>{
  const id=req.params.ProductId;
  Product.findByPk(id).then((product)=>{
    res.render('shop/product-detail',{
      product:product,
      pageTitle:product.title,
      path:'/product'
    })

  }).catch(err=>{
    console.log(err)
  })
   

  
}


exports.getIndex = (req, res, next) => {
  Product.findAll().then((products)=>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });

  })
  .catch(err=>{
    console.log(err)
  })
 
};
exports.getCart = (req, res, next) => {
  req.user.getCart().then((cart)=>{
    return cart.getProducts().then(product=>{

      res.status(200).json(product)
      // console.log(JSON.stringify(product))
      // res.render('shop/cart', {
      //   path: '/cart',
      //   pageTitle: 'Your Cart',
      //   product:product
      // })
    })

  })
  .catch(err=>{
    console.log(err)
  })

};


exports.postCard=(req,res,next)=>{
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.status(200).json({message:"added to cart"})
    })
    .catch(err => console.log(err));
}


exports.postOrders=(req,res,next)=>{
  let odersDetails
  let fetchedCart
  req.user.getCart().then(cart=>{
    fetchedCart=cart
    return cart.getProducts();
  })
  .then(products =>{
   return req.user.createOrder()
   .then(order=>{
    odersDetails=order;
    return order.addProducts(products.map(product=>{
       product.orderItem= {quantity:product.cartItem.quantity}       
       return product;
     }))    
   })   
  })
  .then(result=>{   
    fetchedCart.setProducts(null)
    res.status(200).json({orderDetails:odersDetails})
    
  })

}

exports.getOrders = (req, res, next) => {

  req.user.getOrders({include:['products']})
  .then(orders=>{
    res.status(200).json(orders)
  }).catch(err=>{
    console.log(err)
  })
  //http://localhost:3000/create-orders
  // res.render('shop/orders', {
  //   path: '/orders',
  //   pageTitle: 'Your Orders'
  // });
};

exports.getCheckout = (req, res, next) => {
 req.user.getOrders({include:['products']})
  .then(orders=>{
    res.status(200).json(orders)
  }).catch(err=>{
    console.log(err)
  })
};

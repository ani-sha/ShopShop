var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db=mongoose.connect('mongodb://localhost/swag');
var cors = require('cors');

var Product = require('./model/product');
var WishList =require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.post('/product',function(request,response){
  var product = new Product();
  product.title = request.body.title;
  product.price = request.body.price;
  product.save(function(err,savedProduct){
    if(err){
      response.status(500).send({error:"Could not save product"});
           }
    else {
      response.send(savedProduct);
    }
  });
});

app.get('/product', function(request,response){

  Product.find({},function(err,products){
    if(err){
      response.status(500).send({error:"Could not fetch"});
      }
      else {
        response.send(products);
      }
  });
});

app.get('/wishlist',function(request,response){
  WishList.find({}).populate({path:'products',product}).exec(function(err,wishLists){
    if (err) {
      response.status(500).send({error:"Could not fetch wishlist"});
    }
     else {
       response.status(200).send(wishLists);
    }
  });
});

app.put('/wishlist/product/add',function(request,response){
  Product.findOne({_id:request.body.productId}, function(err, product){
    if(err){
      response.status(500).send({error:"Could not add item to wishlist"});
    }
    else {
      WishList.update({_id:request.body.wishListId},{$addToSet:{products:product._id}},function(err,wishList){
        if(err){
          response.status(500).send({error:"Could not add item to wishlist"});
        }
        else{
          response.send(wishList);
        }
      });
    }
  });
});


app.post('/wishlist',function(request,response){
  var wishList = new WishList();
  wishList.title = request.body.title;

  wishList.save(function(err,newWishList){
    if(err){
      response.status.send({error:"Could not create wishlit"});
    }
    else {
      response.send(newWishList);
    }
  })

});


app.listen(3000, function(){
  console.log("Swag API running");
});

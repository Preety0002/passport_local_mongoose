var express = require('express');
var router = express.Router();
 
const passport=require("passport");
const userModel=require("../models/schema")
const LocalStrategy=require("passport-local")
passport.use(new LocalStrategy(userModel.authenticate()))


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/register",function(req,res,next){
try{
  const userdata=new userModel({
    username:req.body.username,
    email:req.body.email,
  })
  userModel.register(userdata,req.body.password)
  res.redirect("/login")
}
catch(error){
  res.send(error)
}
})

router.get('/login', function(req, res, next) {
  res.render("login");
});

router.get("/logout",function(req,res,next){
  req.logOut(function(error){
    if(err){return next(error)}
  })
  res.redirect("/login")
})

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login"
}))

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    next();
  }
  else{
    res.redirect("/login")
  }
}
router.get("/profile",isLoggedIn,function(req,res,next){
  res.render("profile")
})

router.post("/update-password",isLoggedIn,async function(req,res,next){
  const password=req.body.password
  const user=await userModel.findOne({
    _id:req.user.id
  })
  await user.setPassword(password)
  await user.save()
  res.redirect("/updated")
})

router.get('/updated', function(req, res, next) {
  res.render("updated");
});



module.exports = router;
// local check kerta hai by user name and password
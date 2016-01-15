//call the packages we need
var express         = require("express");
var bodyParser      = require("body-parser");
var app             = express();
var mongoose        = require('mongoose');
var User            = require('./models/user');
var morgan          = require('morgan');

var jwt             = require('jsonwebtoken');
var config          = require('./config');


var router = express.Router();  // let get an instance of the express Router
var port = process.env.PORT || 3000; //set the port
mongoose.connect(config.database);
app.set('superSecret', config.secret);
//configure app to use bodyParser()
//this will let is get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(morgan('dev'));// for logging requests to the console



//middleware to use for all requests
//let protect :use middleware to protecte /api/users
router.use(function(req, res, next){
  console.log("Let Party hard this weekend!");
  //let check the header for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  //decode token
  if (token) {
    //let verifies secret and check exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded){
      if(err){
        return res.json({success: false, message:'Failed to authenticate token.'});
      }else {
        // Oh yes, you can have our cakes
        req.decoded = decoded;
          next(); // for going to the next routes and dont stop here
      }
    });
  }else {
    // There is no more tokens
    return res.status(403).send({
      success:false,
      message: 'No token provided.'
    });
  }
});

router.get('/', function(req, res) {
  res.json({message: 'welcome to our api!'});
});



// on rotes that end in /Users
router.route('/users').post(function(req, res){
  var user = new User(); // create new instance of User model

  user.firsName     = req.body.firsName; //set the users name ( comes from request)
  user.lastName     = req.body.lastName;
  user.email        = req.body.email;

  //password should be hashed before saving
  user.password     = req.body.password;

  //let save the user and check for errors
  user.save(function(err){
    if (err)
      res.send(err);
    res.json({message:"User created!"});
  });

}).get(function(req, res){
  User.find(function(err, users){
    if (err)
      res.send(err);
    res.json(users);
  });
});

//route to authenticate a user (POST http://localhost:3000/api/authenticate)
router.post('/authenticate',function(req, res){
  //find the user
  User.findOne({
    firsName: req.body.firsName,
    lastName: req.body.lastName,
    email:    req.body.email,

  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.json({success: false, message: 'Authentication failed. User not found.'});
    }else if(user){
      //check if password match
      if (user.password != req.body.password){
        res.json({success: false, message: 'Authentication failed. Wrong password.'});
      }else {
        var token = jwt.sign(user, app.get('superSecret'),{
          expiresInMinutes: 1440 //expires in 24 hours
        });

        //return the information including tokesn as JSON
        res.json({
          success: true,
          message: 'Enjoy your token',
          token: token

        });
      }
    }
  });
});
// on route that end in /users/:user_id
router.route('/users/:user_id').get(function(req, res){
  User.findById(req.params.user_id, function(err, user){
    if (err)
      res.send(err);
    res.json(user);
  });
}).put(function(req, res){
  User.findById(req.params.user_id, function(err, user){
    if (err)
      res.send(err)
    user.firsName = req.body.firsName; //updates name
    user.lastName = req.body.lastName;

    user.save(function(err){
      if (err)
        res.send(err);
      res.json({message: "User updated!"});
    });
  });
}).delete(function(req, res){
  User.remove({
    _id: req.params.user_id
  }, function(err, bear){
    if (err)
      res.send(err);

    res.json({message:"Succesfully deleted"});
  });
});
//all of our routes will be prefixed with /api
app.use('/api', router);
app.listen(port);
console.log("listening on port " + port);

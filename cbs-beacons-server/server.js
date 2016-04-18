//call the packages we need
var express         = require("express");
var bodyParser      = require("body-parser");
var app             = express();
var mongoose        = require('mongoose');
var User            = require('./models/user');
var morgan          = require('morgan');

var jwt             = require('jsonwebtoken');
var config          = require('./config');
var moment          = require('moment');
var cors            = require('cors');



var router = express.Router();  // let get an instance of the express Router
var port = process.env.PORT || 3000; //set the port
var server = app.listen(port);
var io = require('socket.io').listen(server);
var connections = [];

mongoose.connect(config.database);
app.set('superSecret', config.secret);


//configure app to use bodyParser()
//this will let is get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(morgan('dev'));// for logging requests to the console
app.use(cors());


//route to authenticate a user (POST http://localhost:3000/api/authenticate)
router.post('/authenticate',function(req, res){
  //find the user
  User.findOne({
    userName: req.body.name
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      //res.send({success: false, msg: 'Authentication failed. User not found.'});
      res.json({success: false, msg: 'Authentication failed. User not found.'});
    }else if(user){
      //check if password match
      user.comparePassword(req.body.password, function(err, isMatch){
        if (isMatch && !err) {
          var token = jwt.sign(user, app.get('superSecret'),{
            expiresInMinutes: 1440 //expires in 24 hours
          });

          //return the information including tokesn as JSON
          res.json({
            success: true,
            msg: 'Enjoy your token',
            token: token,
            firstname: user.firstName,
            lastname: user.lastName
          });
        } else{
          res.json({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

router.get('/setup', function(req, res){
  var nick = new User({ // new user
    firstName: 'Marcio',
    lastName: 'Zhu',
    email: 'password',
    userName: 'marcio',
    password: 'marcio'
  }); // create new instance of User model

  nick.save(function(err){
    if (err) {
      //res.send(err);
      res.json({success: false, msg:'Username or email already exist '});
    } else {
      res.json({success: true, msg: 'Successful created user!'});
    }
  });
});

router.get('/', function(req, res) {
  var curenntDate = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
  res.json({msg: 'welcome to our api! '+ 'Date: '+ curenntDate});
});

// on rotes that end in /Users
router.route('/signup').post(function(req, res){

  if (!req.body.firstName)
    res.json({success: false, msg:'Please fill in firtname field'});
  else if( !req.body.password)
      res.json({success: false, msg:'Please fill password field'});
  else if (!req.body.lastName)
      res.json({success: false, msg:'Please fill in lastname field'});
  else if (!req.body.name)
    res.json({success: false, msg:'Please fill in user name field.'});
  else if ( !req.body.email)
    res.json({success: false, msg:'Please fill in email field.'});

  else {
    var newUser = new User({ // new user
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      userName: req.body.name,
      password: req.body.password
    }); // create new instance of User model

    //let save the user and check for errors
    newUser.save(function(err){
      if (err) {
        //res.send(err);
        res.json({success: false, msg:'Username or email already exist '});
      } else {
        res.json({success: true, msg: 'Successful created user!'});
      }
    });

  }


});

//middleware to use for all requests
//let protect :use middleware to protecte /api/users
router.use(function(req, res, next){
  console.log("Let Party hard this weekend!");
  //let check the header for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || getToken(req.headers);

  //decode token
  if (token) {
    //let verifies secret and check exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if(err){
        return res.json({success: false, msg:'Failed to authenticate token.'});
      }else {
        // Oh yes, you can have our cakes
        req.decoded = decoded._doc;
        next(); // for going to the next routes and dont stop here
      }
    });
  }else {
    // There is no more tokens
    return res.status(403).send({
      success:false,
      msg: 'No token provided. :'+ token
    });
  }
});

router.get('/users', function(req, res){
  User.find({}, function(err, users){
    res.json(users);
  });
});

router.get('/memberinfo', function(req, res){
  var decoded = req.decoded;

  if (!decoded) {
    return res.status(403).send({success: false,
      msg: 'Authentication failed. User not found. '});
  } else {
    res.json({success: true, msg: 'Welcome in the member area '+
    decoded.firstName +' '+ decoded.lastName});
  }
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
    user.password = re.body.password;

    user.save(function(err){
      if (err)
        res.send(err);
      res.json({msg: "User updated!"});
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

function getToken(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

//Socket io stuff
io.on('connection', function(socket) {

  socket.once('disconnect', function() {
    connections.splice(connections.indexOf(socket), 1);
    socket.disconnect(); // for cases when the server hasn't fully disconnected the socket
    console.log("Disconeted %s sockets remaining ", connections.length);

  });

  socket.on('join', function(payload){
    var newMember = {
      id: this.id,
      name: payload.name
    };
    this.emit('joined', newMember);
    console.log("Audience joined %s ", payload.name);
    io.sockets.emit('audience', newMember);

  });

  socket.emit('welcome', {
    title: title
  });

  connections.push(socket);
  console.log("Connected: %s connected sockets", connections.length);

});
//all of our routes will be prefixed with /api
app.use('/api', router);
console.log("listening on port " + port);

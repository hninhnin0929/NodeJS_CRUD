var express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); //hash library //npm install bcrypt

var router = express.Router();
const User = require('../model/userSchema');
const { config } = require('../config/Config');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
 
router.post('/register', async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Create an user object
  let user = new User({
    username : req.body.username,
    password: hashPassword,
  })

  // Save User in the database
  user.save((err, registeredUser)=> {
    if(err) {
      console.log(err)
      res.status(400).send({messae: 'User Already Registerd!'});
    } else{
      // create payload then Generate an access token
      let payload = { id: registeredUser._id };
      const token = jwt.sign(payload, config.TOKEN_SECRET);
      res.status(200).send({token});
    }
  });
});



router.post('login', async (req, res) => {
  User.findOne({ username: req.body.username}, async (err, user) =>{
    if(err){
      console.log(err);
    }else{
      if (user) {
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(401).send("Username or Password is wrong");

        // Create and assign token
        let payload = { id: user._id };
        const token = jwt.sign(payload, config.TOKEN_SECRET);

        res.status(200).header("auth-token", token).send({
          "success": true,
          "token": token
        });
      }else{
        res.status(401).send('Invalid user');
      }
    }
  });
});

module.exports = router;


/* login process
login
  username=> 
    hash compare
      generate JWT
*/
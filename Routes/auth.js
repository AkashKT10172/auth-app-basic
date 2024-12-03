const router =  require('express').Router();
const User = require('../Models/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {

    //Let's validate the data before we make a user
    const {error} = registerValidation(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    
    //checking if user is already in database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) {
        return res.status(400).send("email already exists");
    }
    
    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email:req.body.email,
        password: hashedPassword
    })
    try {
        const savedUser = await user.save();
        //create and assign a token
        const token = jwt.sign({_id:savedUser._id}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(`Welcome ${user.name}. Here is your token ${token}`);
    } catch (error) {
        console.log(404);
    }
})


router.post('/login', async (req, res) => {
    //Let's validate the data before we make a user
    const {error} = loginValidation(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    
    //checking if user is in database
    const myUser = await User.findOne({email: req.body.email});
    if(!myUser) {
        return res.status(400).send("email not registered");
    }
    //checking if password is correct
    const validPass = await bcrypt.compare(req.body.password, myUser.password);
    if(!validPass) {
        return res.status(400).send("password is incorrect");
    }

    //create and assign a token
    const token = jwt.sign({_id:myUser._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
    
}) 

module.exports = router; 
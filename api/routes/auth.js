const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

//REGISTER
router.post("/register", async (req, res) => {

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(req.body.password, salt);

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashPassword,
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'minhajrashid2017@gmail.com',
      pass: 'ajii ifco gfzi okkj'
    }
  });


  const mailOptions = {
    from: 'minhajrashid2017@gmail.com',
    to: req.body.email,
    subject: "Welcome to MegaMart",
    text: "Hello and welcome to MegaMart ! 🌟 Were thrilled to have you here.Whether you're exploring our services, discovering exciting content, or seeking valuable information, we're here to make your experience enjoyable and seamless. If you have any questions or need assistance, feel free to reach out. Happy browsing! 🚀✨"
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong credentials!");

    const filterPassword = bcrypt.compareSync(req.body.password, user.password);

    if(!filterPassword) return res.status(401).json("Wrong credentials!");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      {expiresIn:"3d"}
    );

    const { password, ...others } = user._doc;

    res.status(200).json({...others, accessToken});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

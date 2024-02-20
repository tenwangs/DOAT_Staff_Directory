const User = require('../models/userModel')
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");





  
const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// signup a user
const signupUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const oldUser = await User.signup(email, password)

    // create a token
    const token = createToken(oldUser._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}




const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User NotS Exists!!" });
    }
    const secret = process.env.SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "60m",
    });
    const link = `http://localhost:4000/api/user/forgotPassword/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tenzin22wangchuk22@gmail.com",
        pass: "yseh ybga bygl errw",
      },
    });

    var mailOptions = {
      from: "tenzin22wangchuk22@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `To reset your password, click this link: ${link}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
  } catch (error) { }
};

const passwordTokenVerification = async (req, res) => {
  const { id, token } = req.params;
  
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = process.env.SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret); 
    // redirect to forgotpassword page in frontend with email, id and token
    res.render("index", { email: verify.email, status: "Not Verified" });
    
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
};

const passwordHashed = async (req, res) => {
  const { id, token } = req.params;
   const { password} = req.body;
  const oldUser = await User.findOne({ _id: id});
  if (!oldUser) {
    return res.json({ status: "Usersx Not Exists!!" });
  }
  const secret = process.env.SECRET + oldUser.password;
  
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
};

module.exports = { signupUser, loginUser, resetPassword, passwordTokenVerification, passwordHashed}
const express = require("express");

const {
  loginUser,
  signupUser,
  resetPassword,
  passwordTokenVerification,
  passwordHashed,
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", loginUser);

router.post("/signup", signupUser);

router.post("/forgotPassword", resetPassword);

router.get("/forgotPassword/:id/:token", passwordTokenVerification);

router.post("/forgotPassword/:id/:token", passwordHashed);

module.exports = router;

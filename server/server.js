require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const detailRoutes = require("./routes/detailRoute");
const userRoute = require("./routes/user"); 
const resetPassword = require("./routes/user");
const passwordHashed= require("./routes/user");
const passwordTokenVerification = require("./routes/user");

const cors = require('cors');
// express app
const app = express();

// Allow requests from localhost:3000 (your frontend server)
app.use(cors({ origin: 'http://localhost:3000' }));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:false}))

// middleware
app.use(express.json());

app.use(express.static("uploads"));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  
  
  next();
});

// routes
app.use("/api/details", detailRoutes);
app.use("/api/user", userRoute);
app.post("/api/user/forgotPassword", resetPassword);
app.get("/api/user/forgotPassword/:id/:tokens", passwordTokenVerification);
app.patch("/api/user/forgotPassword/:id/:toke", passwordHashed);
 


//connect to db
mongoose.connect(process.env.MONG_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });


  app.post('/api/authenticate', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Input validation (email format, password strength)
  
      // Find the user by email in the database
      const user = await user.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Use bcryptjs to securely compare the input password with the stored hashed password
      const isMatch = await bcryptjs.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate and send a JWT with the user ID or email, ensuring security using `jsonwebtoken`
      const token = generateJwt(user._id); // Replace with your secure JWT generation function
  
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

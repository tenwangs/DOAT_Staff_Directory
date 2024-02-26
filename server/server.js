require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const detailRoutes = require("./routes/detailRoute");
const userRoute = require("./routes/user");
const resetPassword = require("./routes/user");
const passwordHashed = require("./routes/user");
const passwordTokenVerification = require("./routes/user");

const cors = require("cors");
const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("uploads"));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/details", detailRoutes);
app.use("/api/user", userRoute);
app.post("/api/user/forgotPassword", resetPassword);
app.get("/api/user/forgotPassword/:id/:tokens", passwordTokenVerification);
app.patch("/api/user/forgotPassword/:id/:toke", passwordHashed);

mongoose
  .connect(process.env.MONG_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.post("/api/authenticate", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await user.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateJwt(user._id);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

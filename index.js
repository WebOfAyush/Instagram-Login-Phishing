const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path")
const app = express();
const port = 3000;
const jwt = require("jsonwebtoken")
const uri = "mongodb+srv://webofayush7:Bajaj%40123@cluster0.urd6qk9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Middleware setup
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// MongoDB connection
mongoose.connect(uri, {
  dbName: "Backend",
})
.then(() => console.log("DB connected"))
.catch((e) => {
  console.log("MongoDB connection error:", e);
});

// Authentication middleware
let isAuthenticated = async (req, res, next) => {
  let { token } = req.cookies;
  if (token) {
    const decoded = jwt.verify(token, "sfsdfsfsrsgfergerger")
    req.user = await UserData.findById(decoded._id)
    next()
  } else {
    res.render("index");
  }
};

// User schema and model
const UserSchema = new mongoose.Schema({
  name: String,
  password: String
});
const UserData = mongoose.model("User", UserSchema);

// Routes
app.get("/", isAuthenticated, (req, res) => {
  res.render("logout");
});

app.post("/login", async (req, res) => {
  let { name, password } = req.body;
    let user = await UserData.create({ name, password });
    const token = jwt.sign({id:user._id, },"sfsdfsfsrsgfergerger")
    res.cookie("token",token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 1000), // 1 minute
    });
    res.redirect("/");
  
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

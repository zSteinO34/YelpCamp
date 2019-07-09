require('dotenv').config();

var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    flash          = require("connect-flash"),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comments"),
    User           = require("./models/user");
    
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    reviewRoutes     = require("./routes/reviews"),
    authRoutes       = require("./routes/auth");
    
// mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});
mongoose.connect("mongodb+srv://dbadmin:Josephz1!@cluster0-yuv3s.mongodb.net/test?retryWrites=true&w=majority", { 
    useNewUrlParser: true, 
    useCreateIndex: true
}).then(() => {
  console.log("Connected to DB"); 
}).catch((err) => {
    console.log("ERROR", err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Zac is kinda awesome",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use(authRoutes);

// =======================================================
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});

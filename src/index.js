const express = require('express'),
    handlebars = require('express-handlebars')
path = require('path')
app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/User");
//Connecting database
mongoose.connect("mongodb://localhost/ECO");
app.use(require("express-session")({
    secret: "Any normal Word",       //decode or encode session
    resave: false,
    saveUninitialized: false
}));
passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.use(express.static(path.join(__dirname, 'public')))
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
    }),
)
app.set("view engine", "hbs");
app.set('views', path.join(__dirname, 'resources', 'views'))
app.use(bodyParser.urlencoded(
    { extended: true }
))
app.use(passport.initialize());
app.use(passport.session());
//=======================
//      R O U T E S
//=======================
app.get("/", (req, res) => {
    res.render("home");
})
app.get("/user", isLoggedIn, (req, res) => {
    res.render("user");
})
//Auth Routes
app.get("/login", (req, res) => {
    res.render("login");
});
app.post("/login", passport.authenticate("local", {
    successRedirect: "/user",
    failureRedirect: "/login"
}), function (req, res) {
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", (req, res) => {

    User.register(new User({ username: req.body.username, phone: req.body.phone, telephone: req.body.telephone }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/login");
        })
    })
})
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
app.get("/search", (req, res) => {
    res.render("search");
})
app.post("/search", (req, res) => {
    res.render("search");
})
//Listen On Server
app.listen(process.env.PORT || 3000, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Server Started At Port 3000");
    }

});
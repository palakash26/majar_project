const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
    // res.send("from");
};

module.exports.signup = async (req, res) => {
    try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });

    // Check if the password is present
    // if (!password) {
    //     req.flash("error", "No password provided");
    //     return res.redirect("/signup");
    // }

    // Now proceed with user registration
   
        const registeredUser = await User.register(newUser, password);      // line me bahut error hai
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (err) {
        // Handle registration errors
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    // Uncomment the line below if you want to log the redirect URL
    // console.log(redirectUrl);
    res.redirect(redirectUrl);
    // console.log(res.locals.redirecUrl);
};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next()
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};
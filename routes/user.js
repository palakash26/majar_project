const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");



router
   .route("/signup")
   .get(userController.renderSignupForm)
   .post(WrapAsync(userController.signup));

router
   .route("/login")
   .get(userController.renderLoginForm)
   .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true, }),
      userController.login
   );
// router.get("/signup", userController.renderSignupForm);

// router.post("/signup", WrapAsync(userController.signup));

// router.get("/login", userController.renderLoginForm);

// router.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true, }),
//     async (req, res) => {
//         req.flash("success", "Welcome back to Wanderlust!");
//         let redirecUrl =  res.locals.redirecUrl || "/";
//         res.redirect(redirecUrl);
//         // console.log(res.locals.redirectUrl);
//         res.redirect(res.locals.redirecUrl);
//     }
// );
// router.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true, }),
//    userController.login
// );



router.get("/logout", userController.logout);


// app.use("/demopas", async (req, res) => {
//     let fakeUser = new User({
//         email: "abc@gamil.com",
//         username: "delta-student",
//     });
//     let registerUser = await User.register(fakeUser, "helloworld");
//     res.send(registerUser);
// })

module.exports = router;
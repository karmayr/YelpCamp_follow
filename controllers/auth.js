const User = require("../models/user");

module.exports.renderRegister = (req, res, next) => {
    res.render('./Auth/register.ejs');
}

module.exports.registerUser = async (req, res, next) => {
    const { username, email, password, confpassword } = req.body.user;
    if (password === confpassword) {
        const user = new User({ email, username });
        try {
            const newUser = await User.register(user, password);
            req.login(newUser, err => {
                if (err) return next(err);
                req.flash("success", "Registration Completed Successfully");
                res.redirect('/camps');
            })
        } catch (e) {
            req.flash("error", e.message);
            res.redirect('register');
        }

    } else {
        req.flash("error", "passwords do not match");
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res, next) => {
    res.render("Auth/login.ejs");
}

module.exports.login = (req, res) => {
    req.flash("success", "Welcome to YelpCamp");
    const redirectUrl = res.locals.returnTo || "/camps";
    res.redirect(redirectUrl);
}
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', "Goodbye");
        res.redirect('/login')
    });

}
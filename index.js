//*environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
//!Needed modules
const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongo = require("mongoose");
const Campground = require("./models/campground.js")
const Review = require("./models/review.js")
const User = require("./models/user.js");
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const AppError = require("./utils/appError");
const catchAsync = require("./utils/catchAsync.js");
const { reviewJoiSchema } = require("./joiSchemas/Schemas.js");
const campsRoutes = require("./Routes/camps.js");
// const reviewsRoutes = require("./Routes/reviews.js");
const AuthRoutes = require("./Routes/Auth.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require('passport');
const localPasswordStratergy = require('passport-local');
const { isLoggedIn, isReviewAuthor } = require('./utils/middleware.js')
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

//*Connections
// mongo.connect(process.env.MONGO_URL)
//     .then(() => {
//         console.log("Database active");
//     }
//     ).catch(() => {
//         console.log("check database error");
//     });
// const db = mongo.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once("open", () => {
//     console.log("connected");
// })

mongo.connect('mongodb://127.0.0.1:27017/YelpCamp')
    .then(() => {
        console.log("Database active");
    }
    ).catch(() => {
        console.log("check database error");
    });
const db = mongo.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log("connected");
})




//for form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));
// app.use(helmet());


const store = MongoStore.create({
    mongoUrl: "mongodb://127.0.0.1:27017/YelpCamp",
    touchAfter: 60 * 60 * 24,
    crypto: {
        secret: "thisisassecret"
    }
})

store.on("error", (err) => {
    console.log("session store error: " + err);
})

sessionConfig = {
    store,
    name: "session",
    secret: "thisisasecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 12,
        maxAge: 1000 * 60 * 60 * 12
    }
}
app.use(session(sessionConfig));


//? passport
//! this must be done after the session app.use(which is above)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localPasswordStratergy(User.authenticate()));
//* for getting user in session and out from session 
passport.serializeUser(User.serializeUser()); // in session
passport.deserializeUser(User.deserializeUser()); // out session


//? Engine for layout
app.engine("ejs", ejsMate);

//? middlewares
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", 'ejs');
app.use(flash())
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')

    next();
})


//? express router
app.use("/", AuthRoutes);
app.use("/camps", campsRoutes)
// app.use("/camps/:id/reviews", reviewsRoutes)


//?middleware validation functions
const validateJoiReviews = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body);
    if (error) {
        throw new AppError(error.details.map(elem => elem.message).join(","), 400);
    }
    else {
        next();
    }
}



//? Routes
app.get("/", (req, res) => {
    res.render("./templates/home.ejs")
});

//? Review Routes
app.post("/camps/:id/reviews", isLoggedIn, validateJoiReviews, catchAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id);
    const { review, rating } = req.body.review;
    const ins = new Review({ review, rating });
    ins.author = req.user._id;
    camp.reviews.push(ins)
    await ins.save();
    await camp.save();
    req.flash("success", "Review created")
    res.redirect(`/camps/${camp._id}`);
}))

app.delete("/camps/:id/reviews/:reviewID", isLoggedIn, isReviewAuthor, catchAsync(async (req, res, next) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", 'review deleted ')
    res.redirect(`/camps/${id}`);
}))



app.all("*", (req, res, next) => {
    next(new AppError('Page Not Found', 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong";
    res.status(statusCode);
    res.render("./templates/error.ejs", { err })
    // res.status(statusCode).send(message);
})
app.listen(3000, () => {
    console.log("listening on port 3000");
});
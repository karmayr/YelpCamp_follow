const Campground = require("../models/campground.js")
const { cloudinary } = require("../cloudinary/app.js")

module.exports.index = async (req, res, next) => {
    const camps = await Campground.find({});
    res.render("campgrounds/index.ejs", { camps });
}

module.exports.renderNewForm = (req, res) => {
    res.render("./campgrounds/create.ejs")
}

module.exports.editCamp = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash("error", "No Camp to show")
        res.redirect("/camps")
    }
    res.render('./campgrounds/edit.ejs', { camp });
}

module.exports.showOneCamp = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: 'author'
            }
        })
        .populate('author', 'username');
    if (!camp) {
        req.flash("error", "No Camp to show")
        res.redirect("/camps")
    }
    res.render("./campgrounds/show.ejs", { camp })
}

module.exports.createNewCamp = async (req, res, next) => {

    const { title, location, price, desc } = req.body.Campground;
    const camp = new Campground({ title: title, price: price, location: location, description: desc });
    camp.images = req.files.map(file => ({ url: file.path, filename: file.filename }))
    camp.author = req.user._id;
    await camp.save();
    console.log(camp)
    req.flash('success', "Succesfully made a Camp");
    res.redirect(`/camps/${camp.id}`);
}
module.exports.updateCamp = async (req, res, next) => {
    const { id } = req.params;
    const { title, price, location, desc } = req.body.Campground;
    const camp = await Campground.findByIdAndUpdate(id, { title: title, price: price, location: location, description: desc });
    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }));
    camp.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    await camp.save();
    console.log(camp);
    req.flash("success", "Update Camp Data Successfully");
    res.redirect(`/camps/${id}`);
}
module.exports.deleteCamp = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/camps');
}
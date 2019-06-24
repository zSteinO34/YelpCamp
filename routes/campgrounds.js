var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//Index Route - shows all campgrounds
router.get("/", function(req,res){
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});    
       }
    });
});

//Create Route - Add campground to database
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var location = req.body.location;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, location: location, image: image, description: desc, author: author};
    Campground.create(newCampground, function(err, newCamp){
       if(err){
           console.log(err);
       } else {
        res.redirect("/campgrounds");       
       }
    });
});

//New Route - shows form to create neew campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//Show Route - Displays all info about one campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err || !foundCampground){
           req.flash("error", "Unable to find post");
           res.redirect("back");
       } else {
            res.render("campgrounds/show", {campground: foundCampground});    
       }
    });
});

//EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.render("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});     
        }
    });
});

//Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description
   }, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});


//Destroy Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
   }); 
});

module.exports = router;
const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model");
const Room = require("../models/Room.model");


router.route("/:id/edit")
.get((req, res)=>{
    const id = req.params.id;
    Room.findById(id)
    .populate("owner")
    .then((room)=>{
        if(room.owner._id.toString() !== req.session.userId){return res.redirect(`/rooms/${id}`)}
        res.render("rooms/edit-room", room)
    })
    .catch((err)=>{console.log(err)})
})
.post(fileUploader.single("imageUrl"), (req, res)=>{
    const id = req.params.id;
    const imageUrl = req.file.path;
    const {name, description} = req.body;
    
    Room.findByIdAndUpdate(id, {name, description, imageUrl})
    .then(()=>{res.redirect(`/rooms/${id}`)})
    .catch((err)=>{console.log(err)})
})

router.post("/:id/delete", (req, res)=>{
    const id = req.params.id;
    Room.findById(id)
    .populate("owner")
    .then((room)=>{
        if(room.owner._id.toString() !== req.session.userId){ return res.redirect(`/rooms/${id}`)}
        Room.deleteOne({id})
        .then(()=>{res.redirect("/rooms/list")})
        .catch((err)=>{console.log(err)})
    })
    .catch((err)=>{console.log(err)})
})

router.route("/create")
.get(isLoggedIn, (req, res)=>{
    res.render("rooms/create-room")
})
.post(fileUploader.single("imageUrl"), (req,res)=>{
    const owner = req.session.userId;
    const imageUrl = req.file.path;
    const {name, description} = req.body;

    Room.create({name, description, imageUrl, owner})
    .then(()=>{res.redirect("/rooms/list")})
    .catch((err)=>{console.log(err)})
})

router.get("/list", (req, res) => {
    Room.find()
    .then((rooms)=>{
        res.render("rooms/rooms-list", {rooms});
    })
    .catch((err)=>{console.log(err)})
});

router.get("/:id", (req, res)=>{
    const id = req.params.id;
    Room.findById(id)
    .populate("owner")
    .then((room)=>{res.render("rooms/room-details.hbs", room)})
    .catch((err)=>{console.log(err)})
})

module.exports = router;
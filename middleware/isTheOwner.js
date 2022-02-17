module.exports = (req, res, next) => {
    const id = req.params.id;
    Room.findById(id)
    .populate("owner")
    .then((room)=>{
        if(room.owner._id.toString() !== req.session.userId){ return res.redirect(`/rooms/${id}`)}
        next();
    })
  };
  
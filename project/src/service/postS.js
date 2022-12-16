const postModel = require("../model/postM");
const userModel = require("../model/userM");


exports.create = async (req, res) => {
  try {
    const newPost = await postModel.create(req.body); // in postman, you add _id from body
    res.status(200).json({
      status: "success",
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "fail",
      e,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await postModel.updateOne({ $set: req.body }, { new: true });
      res.status(200).json("The post has been updated");
    } else {
      res.status(403).json("You can update only your post!");
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "fail",
      e,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await postModel.findByIdAndDelete(req.params.id);
      res.status(200).json("The post deleted successfully");
    } else {
      res.status(403).json("You can delete only your own posts");
    }
  } catch (e) {
    res.status(400).json({
      status: "fail",
      e,
    });
  }
};

exports.like = async (req, res) => {
  // Bu kullanıcı beğenmiş mi?
  const post = await postModel.findById(req.params.id)
  const filter = post.likes.filter(x => x == req.body.cuId.toString()) 
    console.log(filter)
  if (filter.length > 0) {
    // O zaman kullanıcı bunu daha önce beğenmiş demektir.
    res.status(200).send('Daha Önce Beğenmişsin!')
  } else {
    // Yani LENGTH 0 İse, Filter içinde bulamamış demektir.
    await postModel.updateOne({$push: {likes: req.body.cuId}})
    res.status(200).send(post)
  }
};



exports.one = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await postModel.findById(req.params.id);
      res.status(200).json(post);
    } else {
      res.status(403).json("You cant reach this post");
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "fail",
      e,
    });
  }
};

exports.timeline = async (req,res) => {
  try {
    const person = await userModel.findById(req.body.userId)
    console.log(person)
    const post = await postModel.find({ userId: person._id})
    const friendPosts = await Promise.all(
      person.followings.map((friendId) => {
        postModel.find({userId: friendId})
      })
    )
    res.json(post.concat(...friendPosts))
  } catch (e) {
    console.log(e)
    res.status(400).json({
      status: 'Fail',
      message: e.message
    })
  }
}
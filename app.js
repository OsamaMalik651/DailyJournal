//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent =
  "This is my daily journal where I intend to write my daily experiences. This website incorporates mongodb for storing jouranl posts in database and ejs to template the web pages and display the content as per request,thereby reducing the development time greatly by avoiding development separate webpages needed for each post. This has the 'Delete Post' button to remove the journal post completely from the database ";
const aboutContent =
  "I am a new web developer trying to put into practice what i have learnt.";
const contactContent =
  "For suggestions, queries and other related stuff, email me on osamamalik124@outlook.com";

const app = express();
app.set("view engine", "ejs");

//Connect to mongoose
mongoose.connect(
  "mongodb+srv://admin-osama:Test123@cluster0.a546v.mongodb.net/blogpostDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Create Post Schema
const postSchema = new mongoose.Schema({
  postTitle: String,
  postBody: String,
});

//Create moodel based on postSchema
const Post = mongoose.model("Post", postSchema);

let posts = [];

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    postTitle: req.body.postTitle,
    postBody: req.body.postBody,
  });
  posts.push(post);
  post.save(function (err) {
    res.redirect("/");
  });
});

app.get("/posts/:postId", function (req, res) {
  //const requestedTitle = _.lowerCase(req.params.postName);
  const requestedPostId = req.params.postId;
  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.postTitle,
      content: post.postBody,
      id: post._id,
    });
  });
});

app.post("/delete/:postId", function (req, res) {
  const deletePostId = req.params.postId;

  Post.findOne({ _id: deletePostId }, function (err, todeletepost) {
    Post.findByIdAndRemove(todeletepost._id, function (err) {
      if (!err) {
        res.redirect("/");
      }
    });
  });
});

app.listen(preccess.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});

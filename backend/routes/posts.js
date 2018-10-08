const express = require('express');
const multer = require('multer');
const Post = require('../models/post');
const router = express.Router();
const MIME_TYPE_MAP = {
  'image/png': 'png', 'image/jpeg': 'jpg', 'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images')
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const fileExtention = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + fileExtention);
    //cb(null, name);
  }
});

router.post('', multer({storage: storage}).single('image'), (req, res, next) => {
  const imageUrl = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: imageUrl + '/images/' + req.file.filename
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    });
  });
});

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: post._id}, post).then((result) => {
    res.status(200).json({
      message: "Post updated successful."
    });
  });
});

router.get('', (req, res, next) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: 'post fetched successfully',
      posts: documents
    });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then((document) => {
    if (document) {
      res.status(200).json(document);
    } else {
      res.status(404).json({
        message: 'Post not found.'
      });
    }
  });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(() => {
    res.status(200).json({
      message: 'Post deleted!'
    });
  });
});

module.exports = router;

const Post = require('../models/PostModel');

module.exports = {
    index: (req, res) =>{
        res.render('admin/index');
    },
    getPosts: (req, res) =>{
        res.render('admin/posts/index');
    },

    submitPosts: (req, res) =>{
        const newPost = new Post({
            title: req.body.title,
            status: req.body.status,
            description: req.body.description
        });
        newPost.save().then(post => {
            req.flash('success-message', 'Post created successfully.');
            res.redirect('/admin/posts');
        });
    },

    createPosts: (req, res) =>{
        res.render('admin/posts/create');
    } 
};
const Post = require('../models/PostModel');
const Category = require('../models/CategoryModel');

module.exports = {
    index: (req, res) =>{
        res.render('admin/index');
    },
    getPosts: (req, res) =>{
         Post.find().then( posts =>{
            res.render('admin/posts/index', {posts: posts});
         });

    },

    submitPosts: (req, res) =>{
        const commentsAllowed = req.body.allowComments ? true: false;
        const newPost = new Post({
            title: req.body.title,
            status: req.body.status,
            description: req.body.description,
            allowComments: commentsAllowed
        });
        newPost.save().then(post => {
            req.flash('success-message', 'Post created successfully.');
            res.redirect('/admin/posts');
        });
    },

    createPosts: (req, res) =>{
        res.render('admin/posts/create');
    },
    
    editPost: (req, res) =>{
        const id = req.params.id;
        Post.findById(id).then(post =>{
            res.render('admin/posts/edit', {post: post});
        });
       
    },


    deletePost: (req, res) =>{
      Post.findByIdAndDelete(req.params.id)
      .then(deletedPost =>{
          req.flash('success-message',`The post ${deletedPost.title} has been deletd.`);
          res.redirect('/admin/posts');
      });
    },

    /* ALL CATEGOERY METHODS */

    getCategories: (req, res) => {

        Category.find()
               .then(cats => {
                res.render('admin/category/index', { categories: cats});
        });
    },
};




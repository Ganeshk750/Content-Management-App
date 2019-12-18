const Post = require('../models/PostModel');
const Category = require('../models/CategoryModel');
const Comment = require('../models/CommentModel');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');

module.exports = {
    index: async (req, res) =>{
        const posts = await Post.find();
        const categories = await Category.find();
        res.render('default/index', {posts: posts, categories: categories});
    },


    /* Login Routes */
    loginGet: (req, res) =>{
        res.render('default/login', {message: req.flash('error')});
    },
    loginPost: (req, res) =>{
        //res.send('Congratulations you have successfully submitted the data.');
       //res.render('admin','Congratulations you have successfully login');
    },


    /* Register Routes */
    registerGet: (req, res) =>{
        res.render('default/register');
    },
    registerPost: (req, res) =>{
         let errors = [];  
        if(!req.body.firstName){
            errors.push({message: 'First name is mandatory'});
        }

        if(!req.body.lastName){
            errors.push({message: 'Last name is mandatory'});
        }

        if(!req.body.email){
            errors.push({message: 'Email field is mandatory'});
        }

        if(req.body.password !== req.body.passwordConfirm){
            errors.push({message: 'Password do not match'});
        }

        if(errors.length > 0){
            res.render('default/register',{
                errors: errors,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
               // password: req.body.password
            });
        }
        else{ 
            User.findOne({email: req.body.email}).then(user =>{
                if(user){
                    req.flash('error-message', 'Email already exists, try to login.');
                    res.redirect('/login');
                }else{
                   /*  const newUser = new User({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: req.body.password
                    }); */
                    const newUser = new User(req.body);
                        
                    bcrypt.genSalt(10, (err, salt) =>{
                        bcrypt.hash(newUser.password, salt, (err,hash) =>{
                            newUser.password = hash;
                            newUser.save().then(user =>{
                                req.flash('success-message', 'You are now registered');
                                res.redirect('/login');
                                console.log(user);
                            });
                        });
                    });
                }
            })
        } 
       // res.send('Register Successfully');
    },

    /* SinglePost Routes */
    SinglePost:(req, res) =>{
       const id = req.params.id;
       Post.findById(id)
       .populate({path: 'comments',populate:{path: 'user', model: 'user'}})
       .then(post =>{
           if(!post){
               res.status(404).json({message: 'No Post Found'});
           }else{
               res.render('default/singlePost',{post: post, comments: post.comments});
           }
       });
    },

    /* comment methods */
    submitComment:(req,res) =>{
        if(req.user){
            Post.findById(req.body.id) .then(post =>{
                const newComment = new Comment({
                    user: req.user.id,
                    body: req.body.comment_body
                });

                post.comments.push(newComment);
                post.save().then(savePost =>{
                    newComment.save().then(saveComment =>{
                        req.flash('success-message','Your comment was submitted for review.');
                        res.redirect(`/post/${post._id}`)
                    });
                });
            });
        }else{
            req.flash('error-message','Login first to comment.');
            res.redirect('/login');
        }
    }
};
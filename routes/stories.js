const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

// Stories Index
router.get('/', (req, res) => {
  Story.find({status: 'public'})
    .populate('user')
    .sort({ datePublish: 'desc' })
    .then( stories => {
      res.render('stories/index', {
        stories : stories
      });
    });
});

// Show Single Story
router.get('/show/:id', (req, res) => {
  Story.findOne({ 
    _id: req.params.id 
  })
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
      // If its public, show it
      if(story.status == "public" ){
        res.render('stories/show', { 
          story : story 
        });
      } else{
        if(req.user){
          // If logged in, and story belongs to user, show it, else redirect
          if(req.user.id == story.user._id){
            res.render('stories/show', { 
              story : story 
            });
          } else {
            res.redirect('/stories');
          }
        } else { 
          // If not public and not logged in, redirect
          res.redirect('/stories');
        }
      }
      
    })
});

// List Stories from a User
router.get('/user/:userId', (req, res)=>{
  Story.find({ 
    user : req.params.userId, 
    status : 'public'
  })
    .populate('user')
    .then( stories => {
      res.render('stories/index', { stories , storyUser: stories[0].user});
    })
});

// List Stories from Looged in User
router.get('/my', (req, res)=>{
  Story.find({ 
    user : req.user.id
  })
    .populate('user')
    .then( stories => {
      res.render('stories/index', { stories , storyUser: stories[0].user});
    })
});

// GET Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

//PROCESS Add Story Form
router.post('/', (req, res) => {
  
  let allowComments = req.body.allowComments ? true : false;
  let publishDate = req.body.status != 'unpublished' ? Date.now() : null;

  const newStory = {
    user: req.user.id,
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    publishDate: publishDate
  }

  new Story(newStory)
    .save()
    .then( story => {
      res.redirect(`/stories/show/${story.id}`)
    })
});

// GET Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({ _id: req.params.id })
    .then(story => { 
      if(story.user != req.user.id){
        res.redirect('/stories'); 
      } else {
        res.render('stories/edit', { story : story }); 
      }
      
    })
});


// Process Edit Story Form
router.put('/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({ 
    _id: req.params.id 
  })
    .then(story => {
      let allowComments = req.body.allowComments ? true : false;

      //New Values
      story.title = req.body.title;
      story.body = req.body.body;
      story.status = req.body.status;
      story.allowComments = allowComments;
      story.publishDate = Date.now();

      story.save()
        .then(story => {
          res.redirect('/dashboard');
        })
    })
});

//Delete Story
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Story.deleteOne( { _id: req.params.id } )
    .then( () => {
      res.redirect('/dashboard');
    })
});

// Add Comment
router.post('/comment/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({ _id : req.params.id })
    .then( story => {

      const newComment = {
        commentBody : req.body.commentBody,
        commentUser : req.user.id
      } 

      // Add to Comments Array
      story.comments.unshift(newComment);

      story.save()
        .then( story => {
          res.redirect(`/stories/show/${story.id}`);
        })
    })
});
module.exports = router;
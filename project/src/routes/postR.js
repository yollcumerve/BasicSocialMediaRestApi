const Router = require('express').Router()
const postService = require('../service/postS')

// Create a post 
Router.post('/create/post', postService.create)

// Update a post 
Router.put('/update/post/:id', postService.update)

//Delete a Post
Router.delete('/delete/post/:id', postService.delete)

//Like a post 
Router.put('/like/post/:id', postService.like)

//Get a post 
Router.get('/get/post/:id', postService.one)

//Get a timeline posts
Router.get('/timeline', postService.timeline)



module.exports = Router
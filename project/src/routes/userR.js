const Router = require('express').Router()
const userS = require('../service/userS')


//Update user
Router.put('/update/user/:id', userS.update)

//Delete User 
Router.delete('/delete/user/:id', userS.delete)

//Get a user 
Router.get('/get/user/:id', userS.get)

//Follow a user 
Router.put('/follow/user/:id', userS.follow)

//Unfollow a user 
Router.put('/unfollow/user/:id', userS.unfollow)

module.exports = Router
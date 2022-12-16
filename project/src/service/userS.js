const userM = require('../model/userM')
const bcrypt = require('bcrypt')

exports.update = async (req,res) => {
        if(req.body.userId === req.params.id || req.body.isAdmin){
            if(req.body.password){
                try{
                    req.body.password = await bcrypt.hash(req.body.password, 12)
                }catch(e){
                    return res.status(400).json({
                        status:"fail",
                        e,
                    })
                }
            }
            try{
                const user = await userM.findByIdAndUpdate(req.params.id, {$set: req.body})
                res.status(200).json({
                    status: 'success',
                    data: {
                        user: user
                    },
                    message: 'Account has been updated'
                })
            }catch(e){
                console.log(e)
                res.status(400).json({
                    e,
                    status: 'fail'
                })
            }
        }
}


exports.delete = async (req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try {
            const user = await userM.findByIdAndDelete(req.params.id)
            res.status(200).json({
                status: 'success',
               message: 'Successfully deleted'
            })
        } catch (e) {
            console.log(e)
            res.status(400).json({
                status:'fail',
                e
            })
        }
    }else{
        return res.status(403).json('You can delete only your account!')
    }
}

exports.get = async (req,res) => {
    try {
        const user = await userM.findById(req.params.id)
        const {password, updateAt, ...other} = user._doc
        res.status(200).json(other)
    } catch (e) {
        console.log(e)
        res.status(400).json({
            status:'fail',
            e
        })
    }
}

exports.follow = async (req,res) => {
    if(req.body.userId !== req.params.id){
        try {
            const user = await userM.findById(req.params.id)
            const currentUser =  await userM.findById(req.body.userId) // trying make the request 
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({ $push: {followers: req.body.userId}})
                await currentUser.updateOne({ $push: {followings: req.params.id}}) 
                res.status(200).json('User has been followed')
            }else{
                res.status(403).json('Your already follow this user')
            }
        } catch (e) {
            console.log(e)
            res.status(400).json({
                e,
                status:'fail'
            })
        }
    }else{
        res.status(403).json('You cant follow yourself')
    }
}

exports.unfollow = async (req,res) => {
    if(req.body.userId !== req.params.id){
        try {
            const user = await userM.findById(req.params.id)
            const currentUser = await userM.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull: {followers:req.body.userId}})
                await currentUser.updateOne({$pull: {followings: req.params.id}})
                res.status(200).json('User has been unfollowed')
            }else{
                await user.updateOne({$push: {followers: req.body.userId}})
                await currentUser.updateOne({$push: { followings: req.params.id}})
            }
        } catch (e) {
            console.log(e)
            res.status(400).json({
                e, 
                status:'fail'
            })
        }
    }else{
        res.status(403).json('You cant unfollow yourself')
    }

}
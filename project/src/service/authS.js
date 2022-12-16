const userM = require('../model/userM')
const jwt = require('jsonwebtoken')

const signToken = id => {
    return jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
        expiresIn: '90d'
    })
}

exports.register = async (req,res) => {

    const rb = req.body
    try{
        const newUser = await userM.create({
            username: rb.username,
            email: rb.email,
            password: rb.password,
            passwordConfirm: rb.passwordConfirm
        })
        res.status(200).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    } catch (e) {
        console.log(e)
        res.status(400).json({
            status: 'fail',
        })
    }
}

exports.login = async (req,res, next) => {
    try {
        const { email, password } = req.body
        if(!email || !password){
            return next( new Error('Provide email and password', 400))
        }
        const user = await userM.findOne({ email })
        if(!user || !(await user.correctPassword(password, user.password))){
            return next(new Error('Incorrect Email or Password', 401))
        }
        const token = signToken(user._id)
        res.status(200).json({
            status:'success',
            token
        })
    } catch (e) {
        console.log(e)
        res.status(400).json({
            status: 'fail'
        })
    }
}
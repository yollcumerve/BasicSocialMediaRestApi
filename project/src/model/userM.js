const mongoose = require('mongoose')
const dbConnection = require('../module/dbConnection')
const validator = require('validator')
const bcrypt = require('bcrypt')
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: true, 
        min: 6
    },
    passwordConfirm: {
        type: String,
        required:true,
        min: 6,
        validate: {
            validator: function(el){
                // this only works on create and save 
                return el === this.password // abc === abc 
            },
            message: 'Passwords are not the same '
        }
    },
    profilePic: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    whatLike:{
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    desc:{
        type: String,
        max: 50
    },
    city: {
        type: String,
        max: 50
    },
    from: {
        type: String,
        max: 50
    },
    relationShip: {
        type: Number,
        enum: [1,2,3]

    }
},
{timestamps: true}
)


UserSchema.pre('save', async function(next){
    // Only run this function if password was actually modified 
    if(this.isModified('password')){
        if(this.password !== this.passwordConfirm ) return next()

        //Hash the password 
        this.password = await bcrypt.hash(this.password, 12)

        // Delete the passwordConfirm field
        this.passwordConfirm = undefined
    }
    next()

})


UserSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

module.exports = mongoose.model("User", UserSchema)
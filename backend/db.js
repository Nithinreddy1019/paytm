const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

mongoose.connect("mongodb+srv://kethireddynithinreddy:micromax%40mongodb1@cluster0.dwpgmdw.mongodb.net/paytm");

const userSchema = mongoose.Schema({
    username: {type: String, required: true, minLength: 3, unique: true},
    password_hash: {type: String, required: true, minLength: 6},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
})

userSchema.methods.createHash =  async function(plainTextPassword) {
    const saltRounds = 10;

    const salt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(plainTextPassword, salt);
};

userSchema.methods.validatePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password_hash)
}


//account schema
const accountSchema = mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    balance:{type:Number, required: true}
});


const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = {
    User,
    Account
}
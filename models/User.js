const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    full_name: String,
    dob: String,
    email: String,
    roll_number: String
});

module.exports = mongoose.model('User', userSchema);

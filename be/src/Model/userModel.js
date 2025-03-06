const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: String || null,
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;




// validate: {
//     validator: function (value) {
//       // Validate password only if it's present
//       return value != null ? value.length > 6 : true;
//     },
//     message: 'Password should be longer than 6 characters'
// },
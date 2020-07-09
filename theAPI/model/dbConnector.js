//console.log('####### > dbConnector.js ');

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var saltValue = 10;
var Schema = mongoose.Schema;

var ElectionCommentsSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    datecreated: { 
        type: Date, 
        default: Date.now 
    },
    firstname: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    candidate: {
        type: String,
        required: false
    },
    comment: {
        type: String,
        required: false
    },
    sessiondata: {
        type: String,
        required: false
    }
});

ElectionCommentsSchema.pre('save', function(callback) {
    var user = this;
    
    if (!user.isModified('password')) {
        return callback();
    }

    bcrypt.genSalt(saltValue, function(err, salt) {
        //console.log('####### > dbConnector.js > bcrypt.genSalt');
        if (err) return callback(err);
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return callback(err);
            //console.log('####### > dbConnector.js > bcrypt.genSalt: ', hash);
            user.password = hash;
            callback();
        });
    });
});

ElectionCommentsSchema.methods.checkPassword = function(guess, callback) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    callback(err, isMatch);
  });
};

ElectionCommentsSchema.methods.name = function() {
  return this.displayName || this.username;
};

var User = mongoose.model('ElectionComments', ElectionCommentsSchema, 'mainCollection');

module.exports = User;



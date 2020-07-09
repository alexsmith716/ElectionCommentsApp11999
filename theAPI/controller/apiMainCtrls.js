//console.log('####### > apiMainCtrls.js ');

var router = require('../../theServer/routes/serverRoutes.js');
var passport = require('passport');
var User = require('../model/dbConnector.js');
var paginate = require('mongoose-range-paginate')
var sortKey = 'time'
var sort = '-' + sortKey
var sortDocsFrom = 0;






var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var buildGetCommentsResponse = function(req, res, results) {
  var responseBody = [];
  results.forEach(function(doc) {
    responseBody.push({
      username: doc.username,
      datecreated: doc.datecreated,
      time: doc.time,
      firstname: doc.firstname,
      lastname: doc.lastname,
      city: doc.city,
      state: doc.state,
      candidate: doc.candidate,
      comment: doc.comment,
      sessiondata: doc.sessiondata,
      _id: doc._id
    });
  });
 //console.log('####### > apiMainCtrls.js > buildGetCommentsResponse > return responseBody');
  return responseBody;
};

function getQuery() {
  return User.find()
    .where({})
}

module.exports.getAllCommentsResponse = function(req, res) {
  // stopped here
  //console.log('####### > apiMainCtrls.js > getAllCommentsResponse 1');
  //db.ElectionCommentsAppModel.find({}, function (err, results) {
  //var q = db.ElectionCommentsAppModel.find({}).sort({_id: -1}).limit(5);
  //q.exec(function(err, results) {
  paginate(getQuery(), { sort: sort, limit: 5 }).exec(function (err, results) {
    //console.log('####### > apiMainCtrls.js > getAllCommentsResponse 2 > results:', results);
    var responseBody;
    if (err) {
      //console.log('####### > apiMainCtrls.js > getAllCommentsResponse > ERROR:', err);
      sendJSONresponse(res, 404, err);
    } else {
      // get next 5 docs ready
      //paginate(getQuery(), {sort: sort,startId: docs[4]._id,startKey: docs[4][sortKey],limit: 5});
      // first 5 docs ready
      sortDocsFrom = 4;
      //console.log('####### > apiMainCtrls.js > getAllCommentsResponse 3 ');
      responseBody = buildGetCommentsResponse(req, res, results);
      //console.log('####### > apiMainCtrls.js > getAllCommentsResponse 4 > responseBody:', responseBody);
      //console.log('####### > apiMainCtrls.js > getAllCommentsResponse 5 ');
      sendJSONresponse(res, 200, responseBody);
    }
  })
};


/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

module.exports.postOneCommentResponse = function(req, res) {
  //console.log('####### > apiMainCtrls.js > electioncommentsCreate 1 ');
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    city: req.body.city,
    state: req.body.state,
    candidate: req.body.candidate,
    comment: req.body.comment,
    time: req.body.time,
  }, function(err, electioncomment) {
    if (err) {
      //console.log('####### > apiMainCtrls.js > electioncommentsCreate 2 > Err: ', err);
      //console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      //console.log('####### > apiMainCtrls.js > electioncommentsCreate 3 > Good: ', electioncomment);
      sendJSONresponse(res, 201, electioncomment);
    }
  });
};


/* GET a location by the id */
module.exports.getOneCommentResponse = function(req, res) {
  //console.log('####### > apiMainCtrls.js > getOneCommentResponse: ', req.params);
  if (req.params && req.params.commentid) {
    User.findById(req.params.commentid).exec(function(err, results) {
        if (!results) {
          sendJSONresponse(res, 404, {
            "message": "commentid not found"
          });
          return;
        } else if (err) {
          //console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        //console.log(results);
        sendJSONresponse(res, 200, results);
      });
  } else {
    //console.log('No commentid specified');
    sendJSONresponse(res, 404, {
      "message": "No commentid in request"
    });
  }
};


/* PUT /api/comments/:commentid */
module.exports.editOneComment = function(req, res) {
  if (!req.params.commentid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, commentid is required"
    });
    return;
  }
  User.findById(req.params.locationid).select('-reviews -rating').exec(function(err, location) {
        if (!location) {
          sendJSONresponse(res, 404, {
            "message": "commentid not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        location.name = req.body.name;
        location.address = req.body.address;
        location.facilities = req.body.facilities.split(",");
        location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
        location.openingTimes = [{
          days: req.body.days1,
          opening: req.body.opening1,
          closing: req.body.closing1,
          closed: req.body.closed1,
        }, {
          days: req.body.days2,
          opening: req.body.opening2,
          closing: req.body.closing2,
          closed: req.body.closed2,
        }];
        location.save(function(err, location) {
          if (err) {
            sendJSONresponse(res, 404, err);
          } else {
            sendJSONresponse(res, 200, location);
          }
        });
      }
  );
};

module.exports.deleteOneComment = function(req, res) {
  var commentsid = req.params.commentsid;
  if (!commentsid) {
    sendJsonResponse(res, 404, {
    "message": "Not found, locationid and reviewid are both required"
  });
    return; 
  }
  
  if (commentsid) {
    User.findByIdAndRemove(commentsid).exec(function(err, comment) {
          if (err) {
            //console.log(err);
            sendJSONresponse(res, 404, err);
            return;
          }
          //console.log("Comment id " + commentsid + " deleted");
          sendJSONresponse(res, 204, null);
        }
    );
  } else {
    sendJSONresponse(res, 404, { "message": "No commentid in request" });
  }
};





module.exports.postLoginResponse = function(req, res) {
  //console.log('####### > apiMainCtrls.js > postLoginResponse > USER:', req.user);
  //res.locals.user2 = req.session.user

  if(!req.body.username || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    }); 
    return;
  }


  passport.authenticate('login')(req, res, function () {
    sendJSONresponse(res, 201, user);
  });
  /*
  passport.authenticate('login', function(err, user, info){
    if (err) {
      console.log('####### > apiMainCtrls.js > postLoginResponse > authenticate > ERROR:1:', err);
      sendJSONresponse(res, 404, err);
      return;
    }
    if(user){
      //console.log('####### > apiMainCtrls.js > postLoginResponse > authenticate > USER::', user);
      //res.locals.currentUser = user;
      //console.log('####### > apiMainCtrls.js > postLoginResponse > authenticate > currentUser::', currentUser);
      //res.locals.currentUser = user;
      //console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%: ", currentUser)
      sendJSONresponse(res, 201, user);
    } else {
      console.log('####### > apiMainCtrls.js > postLoginResponse > authenticate > ERROR:2:', info);
      sendJSONresponse(res, 401, info);
      //return;
    }
  })(req, res);
  */
};






module.exports.postSignUpResponse = function(req, res) {
  //console.log('####### > apiMainCtrls.js > postSignUpResponse 1:', req.body.username, ' :: ', req.body.password);

  if(!req.body.username || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return; 
  }

  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {
    if (err) {
      //console.log('####### > apiMainCtrls.js > postSignUpResponse > ERROR: ', err);
      sendJSONresponse(res, 400, err);
      return; 
    } 
    if (user) {
      //console.log('####### > apiMainCtrls.js > postSignUpResponse > USER EXISTS: ', user);
      sendJSONresponse(res, 200, user);
      return; 
    }

    var newUser = new User({
      username: username,
      password: password
    });

    /*
    newUser.save(function(err) {
      if (err) {
        console.log('####### > apiMainCtrls.js > postSignUpResponse > newUser.save > ERROR: ', err);
        sendJSONresponse(res, 400, err);
        return; 
      }
    });
    */

    newUser.save(function(err) {
      if (err) {
        //console.log('####### > apiMainCtrls.js > newUser.save');
        sendJSONresponse(res, 404, err);
        return; 
      } else {
        passport.authenticate('login', function(err, user, info){
          if (err) {
            //console.log('####### > apiMainCtrls.js > postSignUpResponse > authenticate > ERROR:1:', err);
            sendJSONresponse(res, 404, err);
            return;
          }
          if(user){
            //console.log('####### > apiMainCtrls.js > postSignUpResponse > authenticate > USER::', user);
            //sendJSONresponse(res, 201, user);
            req.logIn(user, function(err) {
              if (err) { 
                sendJSONresponse(res, 404, err);
                return;
              }
              //req.session.username = "SHITTTTTTTT";
              //console.log('####### > apiMainCtrls.js > postSignUpResponse > passport.authenticate1', req.user)
             // console.log('####### > apiMainCtrls.js > postSignUpResponse > passport.authenticate2', res.user)
              //console.log('####### > apiMainCtrls.js > postSignUpResponse > passport.authenticate3', user)
              //console.log('%%%%%%%%%%%%%%%%######################@@@@@@@@@@@@@@@@@@@@@@1 > newUser.save1:', req);
              //console.log('%%%%%%%%%%%%%%%%######################@@@@@@@@@@@@@@@@@@@@@@1 > newUser.save2:', req.user);
              sendJSONresponse(res, 201, user);
            });
          } else {
            // ####### > apiMainCtrls.js > postSignUpResponse > authenticate > ERROR:2: { message: 'No user has that username!' }
           // console.log('####### > apiMainCtrls.js > postSignUpResponse > authenticate > ERROR:2:', info);
            sendJSONresponse(res, 401, info);
            //return;
          }
        })(req, res);
      }
    });
    
  });
};



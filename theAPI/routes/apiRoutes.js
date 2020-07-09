
var express = require('express');
var router = express.Router();
var apiControllers = require('../controller/apiMainCtrls');


router.get('/comments', apiControllers.getAllCommentsResponse);

//router.post('/comments', apiControllers.postSignupResponse);


router.post('/signup', apiControllers.postSignUpResponse);
router.post('/login', apiControllers.postLoginResponse);


router.post('/comments', apiControllers.postOneCommentResponse);

router.get('/:commentid', apiControllers.getOneCommentResponse);


/*
app.get('/', controllerIndex.getAllComments);

app.get('/comments', controllerIndex.getAddNewComment);
app.post('/comments', controllerIndex.postOneComment);


app.get('/comments/:commentid',  controllerIndex.getOneComment);
app.put('/comments/:commentid',  controllerIndex.editOneComment);
app.delete('/comments/:commentid',  controllerIndex.deleteOneComment);
*/

module.exports = router;


var express = require('express');
var router = express.Router();
var serverControllers = require('../controller/serverMainCtrls');



router.get('/', serverControllers.getAllComments);


router.get('/comments', serverControllers.getAddNewComment);

router.get('/signup', serverControllers.getSignup);
router.get('/login', serverControllers.getLogin);

router.get('/about', serverControllers.getAbout);
router.get('/contact', serverControllers.getContact);
router.get('/team', serverControllers.getTeam);

router.post('/signup', serverControllers.postSignup);
router.post('/login', serverControllers.postLogin);

router.post('/comments', serverControllers.postOneComment);

router.get('/:commentid',  serverControllers.getOneComment);


module.exports = router;
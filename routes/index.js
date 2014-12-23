var express = require('express');
var router = express.Router();

var databaseUrl = "mongodb://localhost/ibm";
var collections = ["posts","categories"];
var db = require("mongojs").connect(databaseUrl, collections);
var ObjectId = db.ObjectId;

/* GET home page. */
router.get('/', function(req, res) {
	if(req.user){
 		db.posts.find({ "SubscriberList": req.user.email}, function(err, object){
  			if(err) throw err;
  			else{
  				res.render('index', { title: 'Home', user: true, obj: object });
  			}
		})
	}
	else{
			res.render('index', { title: 'Home', user: false, obj: null });
	}
});


router.get('/subscribe/:id', function(req, res){
	var x = req.params.id;
	db.posts.findOne({ "_id" : ObjectId(req.params.id)}, function(err, obj){
		if(err){
			console.error(err);
		}
		// else if(obj.owner===req.user.email){
		// 	console.log(obj.owner)
		// 	console.log(req.user.email)
		// 		res.render('displaymessage', {title: 'Subscribed!'});
		// }
		// else if(2===2){
		// 	db.posts.find({"SubscriberList" : req.user.email}, function(err, obj){
		// 		if(Object.keys(obj).length > 0){
		// 			res.render('displaymessage', {title: 'Duplicate Entries!'});
		// 		}
		// 	});
		// }
		else{
		db.posts.update({ "_id" : ObjectId(req.params.id)}, {$addToSet: {"SubscriberList":req.user.email}}, function(err, updated){
			if(err)
			{
				console.error(err);
			}
			else{
				res.render('subscribe', { title: 'Subscribe'});
			}
		})
	}

	})
	})
router.post('/save/:id', function(req, res){
	var newpost = req.body;
	db.posts.update({"_id" : ObjectId(req.params.id)}, {$set: {"post.title" : newpost.title, "post.description":newpost.description, "post.date" : newpost.date, "post.message": newpost.message}}, function(err, updated){
		if(err) throw err;
		else{
			db.posts.find({}, function(err, newposts){
				res.render('follow', {title: 'Follow Notifications', posts:newposts});
			})
		}	
	})
})

router.post('/save', function(req, res){
	var user = req.user.email;
	var post = req.body;
	var title = post.title;
	var date = post.date;
	var message = post.description;
	var category = post.category;
	db.posts.insert({ post: post }, function(err, post){
		db.posts.update({ _id: post._id}, {$set: {"owner":user, "status":"active", "category": category}},
			function(err, updated){
				if(err){
					console.error(err);
				}
				if(updated){
					db.posts.find({ status:"active"}, function(error, post){
					res.render('notifications', {title: 'Notifications', posts:post, owner:post.owner === user, error: req.flash('error')[0]});
				});
			};
		});
	});
});


router.get('/follow', function(req, res){
	db.posts.find({}, function(err, post){
		
			if(err)
			{
				console.error(err);
			}
		else{
			if(req.user === post.owner){
				res.render('follow', {title: 'Follow post', posts: post, editfunctionality:true});
			}
			res.render('follow', {title: 'Follow post', posts: post, editfunctionality:false});
		}
		})
	})

router.get('/dashboard', function(req, res){
if(!req.user || res.user.status!== 'ENABLED'){
	return res.redirect('/login');
}res.render('notifications', {title: 'Notifications', user: req.user});
});

module.exports = router;

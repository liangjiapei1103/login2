// app/routes
module.exports = function(app, passport) {

	// Home page (with login links) ==========================
	app.get('/', function (req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// Login Page ===========================================
	app.get('/login', function (req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	//process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile', // redirect to the secure profile section
		failureRedirect: '/login', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	// Signup page ==========================================
	app.get('/signup', function (req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile', // redirect to the secure profile section
		failureRedirect: '/signup', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
 	}));
	
	// profile page =========================================
	app.get('/profile', isLoggedIn, function (req, res) {
		res.render('profile.ejs', {
			user: req.user // get the user out of session and pass to template
		});
	});


	// Facebook routes ======================================
	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));


	// Twitter routes =======================================
	app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        })
    );


	// logout ================================================
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});


};

// route middleware to make sure a user is logged in
function isLoggedIn (req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't authenticated, redirect them to the home page
	res.redirect('/');
}
A simple [Passport](http://passportjs.org/) strategy for Workwell.

## Install

  npm install passport-workwell

## Usage

Register the strategy

~~~javascript
var WorkwellStrategy = require('passport-workwell').Strategy;

passport.use(new WorkwellStrategy({
  clientID: WORKWELL_SERVICE_ID,
  clientSecret: WORKWELL_SERVICE_SECRET
}, function(serviceToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    // To keep the example simple, the user's Workwell profile is returned to
    // represent the logged-in user. In a typical application, you would want
    // to associate the Workwell account with a user record in your database,
    // and return that user instead.
    return done(null, profile);
  });
}));
~~~

and then authenticate as:

~~~javascript
app.get('/auth/workwell',
  passport.authenticate('workwell', { state: 'SOME STATE'  }),
  function(req, res){
    // The request will be redirected to Workwell for authentication, so this
    // function will not be called.
  });
~~~

the login callback:

~~~javascript
app.get('/auth/workwell/callback', passport.authenticate('workwell', {
  successRedirect: '/',
  failureRedirect: '/login'
}));
~~~

See [this](https://workwell.api-docs.io) for details on Workwell API.

## Author

Kimind (http://www.kimind.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

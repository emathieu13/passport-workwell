A simple [Passport](http://passportjs.org/) strategy for Workwell.

## Install

  npm install passport-workwell

## Usage

Register the strategy in your passport.js file

~~~javascript
var WorkwellStrategy = require('passport-workwell').Strategy;

passport.use(new WorkwellStrategy({
  clientID: WORKWELL_SERVICE_ID,
  clientSecret: WORKWELL_SERVICE_SECRET,
  getProfilePage: 'url of your web page to get the workwell profile (see below)',
  passReqToCallback: true
}, function(req, serviceToken, profile, done) {
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
app.get('/auth/workwell/callback', 
    passport.authenticate('workwell', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);
~~~

Copy the workwell.js file of your /node_modules/passport-workwell/node_modules/workwell/dist/js/ folder into the javascript folder of your project (used by the web client application)

You need to create a page to get the Workwell profile using the Workwell mobile bridge. Report the URL of this page in the *getProfilePage* option
This page will be called with servicetoken get parameter : mypagetogetprofile.html?servicetoken=12345678910. You need to assign the service token parameter to the serviceToken javascript variable.
Depending on the web framework you use, you will find many scripts to parse the URL to get this parameter.

~~~html
<html>
<head>
    <script type="text/javascript" src='path/to/javascript/folder/of/your/project/workwell.js'></script>
</head>
<body>
    <script type="text/javascript">
        var serviceToken = yourFunctionToGetTheServiceTokenGetParameter();
        Workwell.setServiceToken(serviceToken);
        Workwell.getUserInfo({
            success: function (data) {
                if (data && data.user && data.user.email) {
                    var email = data.user.email;
                    var name = data.user.name ? data.user.name : data.user.email;
                    $window.location.href = "/api/auth/workwell/callback?servicetoken=" + serviceToken + "&email=" + email + "&name=" + name;
                } else {
                    alert("Technical issue, unable to get your Workwell profile. Please try later !");
                }
            },
            error: function (error) {
                alert("Technical issue, unable to get your Workwell profile. Please try later !");
            }
        });
    </script>
</body>
</html>
~~~

See [this](https://workwell.api-docs.io) for details on Workwell API.

## Author

Kimind (http://www.kimind.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

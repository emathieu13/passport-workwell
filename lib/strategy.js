/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
    , util = require('util')
    , crypto = require('crypto')
    , request = require('request');


/**
 * `Strategy` constructor.
 *
 * Options:
 *   - `serviceID`  Workwell service ID
 *   - `serviceSecret`  Workwell service secret
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
 *   - `getProfilePage`  URL of the web page with the get profile script (to get the email address)
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
    options = options || {};
    options.tokenURL = options.tokenURL || 'https://api.workwell.io/1.0/developer/service/token';
    options.profileFields = options.profileFields || null;

    if (!verify) { throw new TypeError('LocalStrategy requires a verify callback'); }

    //By default we want data in JSON
    options.customHeaders = options.customHeaders || {"x-li-format":"json"};
    
    this._service_id = options.serviceID;
    this._service_secret = options.serviceSecret;
    this._tokenURL = options.tokenURL;

    passport.Strategy.call(this);
    this.name = 'workwell';
    this._verify = verify;
    this._passReqToCallback = options.passReqToCallback;
    this._getProfilePage = options.getProfilePage;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
    options = options || {};
    var self = this;
    
    if (req && req.query && req.query.servicetoken && req.query.email) {
        
        var serviceToken = req.query.servicetoken;
        var profile = {email: req.query.email};
        if (req.query.name) {
            profile.name = req.query.name;
        }
        
        function verified(err, user, info) {
            if (err) { return self.error(err); }
            if (!user) { return self.fail(info); }
            self.success(user, info);
        }
        
        try {
            if (self._passReqToCallback) {
                self._verify(req, serviceToken, profile, verified);
            } else {
                self._verify(serviceToken, profile, verified);
            }
        } catch (ex) {
            self.error(ex);
        }
    } else {
        // Workwell example - see https://workwell.api-docs.io/1.0/service-token/examples
        // the time needs to be in seconds
        var now = parseInt(new Date().getTime() / 1000);
        const signature = crypto.createHmac('sha256', this._service_secret).update(this._service_id + now).digest("base64");

        request({
            uri: this._tokenURL,
            method: "GET",
            headers: {
                'ww-service-signature': signature,
                'ww-timestamp': '' + now,
                'ww-service-id': this._service_id
            }
        }, function (error, res, body) {
            if (!body || body === 'undefined' || body === '') {
                self.error('Invalid service token. Check your credentials');
            }
            var bodyJson = JSON.parse(body);
            var serviceToken = bodyJson.service_token;

            self.redirect(self._getProfilePage + '?servicetoken=' + serviceToken);
        });
    }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;

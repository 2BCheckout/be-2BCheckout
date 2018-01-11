'use strict';
var path = require('path');
var users = require(path.resolve(__dirname, 'data/user/user_seed'));

var models = ['UserAccount', 'ACL', 'Role', 'RoleMapping', 'AccessToken'];

module.exports = function(app, ds) {
    app.dataSources[ds].automigrate(models, function(err) {
        if (err)
            throw _err;
        app.models.UserAccount.create(users, function(_err) {
            if (_err)
                throw _err;

        })
        return true;
    })
}
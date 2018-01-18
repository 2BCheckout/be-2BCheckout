'use strict';
var path = require('path');
var users = require(path.resolve(__dirname, './data/user/user_seed'));
var routes = require(path.resolve(__dirname, './data/route/route_seed'));
var students = require(path.resolve(__dirname, './data/student/student_seed'));
var rides = require(path.resolve(__dirname, './data/ride/ride_seed'));
var boardings = require(path.resolve(__dirname, './data/boarding/boarding_seed'));

var models = ['UserAccount', 'ACL', 'Role', 'RoleMapping', 'AccessToken', 'Student', 'Route', 'Ride', 'Boarding'];

module.exports = function(app, ds) {
    
    app.dataSources[ds].automigrate(models, function(err) {
        if (err)
            throw _err;
        app.models.UserAccount.create(users, function(_err) {
            if (_err)
                throw _err;

        })
        app.models.Route.create(routes, function(_err) {
            if (_err)
                throw _err;

        })
        app.models.Student.create(students, function(_err) {
            if (_err)
                throw _err;

        })
        app.models.Ride.create(rides, function(_err) {
            if (_err)
                throw _err;
        })
        app.models.Boarding.create(boardings, function(_err) {
            if (_err)
                throw _err;
        })
        return true;
    })
}
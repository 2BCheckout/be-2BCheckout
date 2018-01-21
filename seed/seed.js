'use strict';
var path = require('path');
var users = require(path.resolve(__dirname, './data/user/user_seed'));
var routes = require(path.resolve(__dirname, './data/route/route_seed'));
var students = require(path.resolve(__dirname, './data/student/student_seed'));
var rides = require(path.resolve(__dirname, './data/ride/ride_seed'));
var boardings = require(path.resolve(__dirname, './data/boarding/boarding_seed'));
var roles = require(path.resolve(__dirname, './data/role/role_seed'));

var models = {
    'UserAccount': users,
    'ACL': [],
    'Role': roles,
    'RoleMapping': [],
    'AccessToken': [],
    'Student': students,
    'Route': routes,
    'Ride': rides,
    'Boarding': boardings
};
var privilegies = {
    admin: ['afernandez'],
    movil: ['clopez']
}
let usersRecords = [];
let rolesRecords = [];
let mapped = false;

function mapRoleUser(app, role) {
    privilegies[role.name].forEach(username => {
        const userRecord = usersRecords.find(u => u.username === username);

        role.principals.create({principalType: app.models.RoleMapping.USER, principalId: userRecord.id}, err => {
            if (err) throw err;
            console.log('user created: ' + userRecord.name);
        });
    });
}

function createModel(app, model) {
    app.models[model].create(models[model], (_err, records) => {
        if (_err) throw _err;
        if (!_err && records) {
            usersRecords = model === 'UserAccount' ? records : usersRecords;
            rolesRecords = model === 'Role' ? records : rolesRecords;
        }
        if (!mapped && usersRecords.length > 0 && rolesRecords.length > 0) {
            rolesRecords.forEach(role => { mapRoleUser(app, role) })
        }
    })
}

module.exports = function(app, ds) {
    app.dataSources[ds].automigrate(Object.keys(models), err => {
        if (err) throw _err;
        Object.keys(models).forEach(model => { createModel(app, model); });
        return true;
    });
}
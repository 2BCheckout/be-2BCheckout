'use strict';
var app = require('../../server/server');

module.exports = function(Useraccount) {
	Useraccount.afterRemote('login', function(ctx, output, next){
		Useraccount.findById(output.userId, {include: 'roles'})
		.then(user => {
			console.log(user.roles());
			output.rol = user.roles()[0].name;
			output.name = user.name;
			next();
		});
	});

	Useraccount.observe('after save', function(ctx, next){
		console.log("{"+ctx.instance.type+"}", ctx.instance.type == "admin");
		if(ctx.isNewInstance && ctx.instance.type !== undefined){
			console.log("after create");
			app.models.Role.findOne({where:{name: ctx.instance.type}}, function(err, role) {
				if (err) throw err;
				else if(!role){

				}else{
					role.principals.create({
						principalType: app.models.RoleMapping.USER,
						principalId: ctx.instance.id
					}, function(err, principal) {
						if(err) throw err;
						else{
							next();
						}
					});
				}
			});
		}else if(ctx.instance.type !== undefined){
			console.log("after update");
			app.models.Role.findOne({ where: {name: ctx.instance.type}}, function(err, role) {
				if (err) throw err;
				else if(!role){

				}else{
					app.models.RoleMapping.findOne({where: {principalType: "USER", principalId: ctx.instance.id}}, function(err, mapping){
						if (err) throw err;
						else if(!mapping){
							role.principals.create({
								principalType: app.models.RoleMapping.USER,
								principalId: ctx.instance.id
							}, function(err, principal) {
								if(err) throw err;
								else next();
							});
						}else{
							console.log(ctx.instance, role, mapping);
							/*mapping.roleId = role.id;
							mapping.save();
							next();*/
							app.dataSources.mysqlDs.connector.execute("update SBO.RoleMapping set roleId = ? where id = ?", [role.id, mapping.id], function(err, doc){
								if (err) throw err;
								else next();
							})
						}
					})
				}
			});
		}else{
			next();
		}
	});

	Useraccount.beforeRemote( "login", function( ctx, _modelInstance_, next) {
		let email = ctx.args.credentials.email;
		Useraccount.findOne({where: {email: email}}, function(err, user){
			if (!err && !user){
				ctx.res.status(404).json("User not found");
			}else if(!err){
				if(user.status != "active")
					ctx.res.status(401).json("User is not active");
				else
					return next();
			}else{
				ctx.res.status(500).json(err);
			}
		})

	});

	Useraccount.activate = function(email, cb){
		Useraccount.findOne({where: {email: email}}, function(err, user){
			if (!err && !user){
				cb(new Error("Cannot find user"), null)
			}else if(!err){
				user.status = "active";
				user.save();
				cb(null, "User is now active")
			}else{
				cb(err, null);
			}
		})
	};

	Useraccount.remoteMethod('activate', {
		accepts:[
		{arg: 'email', type: 'string', required: true}
		],
		returns: {arg: 'State', type: 'String'},
		http: {path: '/activate', verb: 'post'}
	});

	Useraccount.desactivate = function(email, cb){
		Useraccount.findOne({where: {email: email}}, function(err, user){
			if (!err && !user){
				cb(new Error("Cannot find user"), null)
			}else if(!err){
				user.status = "desactive";
				user.save();
				cb(null, "User is now desactive")
			}else{
				cb(err, null);
			}
		})
	};

	Useraccount.remoteMethod('desactivate', {
		accepts:[
		{arg: 'email', type: 'string', required: true}
		],
		returns: {arg: 'State', type: 'String'},
		http: {path: '/desactivate', verb: 'post'}
	});
};

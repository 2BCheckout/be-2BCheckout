'use strict';
const json2xls = require('json2xls');
var fs = require('fs');
module.exports = function(Ride) {

	Ride.getReport = function(filter, skip, limit, cb, debug){
		console.log('filter: ', filter);
		const routeRegx = new RegExp(filter.route === '.*' ? '.*' : `.*${filter.route}.*`, 'i');
		const plateRegx = new RegExp(filter.bus_plate === '.*' ? '.*' : `.*${filter.bus_plate}.*`);

		Ride.find({
			where: {
				and: [
					{ date: { between: [filter.initial_date, filter.final_date] }},
					{ plate: plateRegx }
				]
			},
			include: ["students", "route"],
			skip: skip,
			limit: limit
		}, (err, rides) => {
			if (err) console.log('err: ', err);
			rides = rides.filter(r => {
				const ro = JSON.parse(JSON.stringify(r));
				return routeRegx.test(ro.route.name);
			});
			if(!debug) console.log('rides: ', rides);
			cb(err, rides);
		});
	}

	Ride.remoteMethod('getReport', {
        accepts:[
        {arg: 'filter', type: 'Object', required: false},
        {arg: 'skip', type: 'number', required: false},
        {arg: 'limit', type: 'number', required: false}
        ],
        returns: {arg: 'getReport', type: 'Object'},
        http: {path: '/getReport', verb: 'get'}
    });

    Ride.getReportCount = function(filter, skip, limit, cb){
    	Ride.getReport(filter, skip, limit, (err, result) => {
			if (err) console.log('err: ', err);
			else console.log("result: ", result.length);
			cb(err, result.length);
		}, true);
    }

    Ride.remoteMethod('getReportCount', {
        accepts:[
        {arg: 'filter', type: 'Object', required: false},
        {arg: 'skip', type: 'number', required: false},
        {arg: 'limit', type: 'number', required: false}
        ],
        returns: {arg: 'getReportCount', type: 'Object'},
        http: {path: '/getReport/Count', verb: 'get'}
    });

    Ride.GenerateExcelReport = function(filter, skip, limit, res, cb){

        Ride.getReport(filter, skip, limit, function(err, data){
        	console.log('data: ', data);
            if(err)
                cb(err, null);
            else {
                const xls = json2xls(data);
                fs.writeFileSync('./data.xlsx', xls, 'binary');
                res.download('./data.xlsx');
            }
        }, true);
    }
    Ride.remoteMethod('GenerateExcelReport', {
        accepts:[
        {arg: 'filter', type: 'Object', required: false},
        {arg: 'skip', type: 'number', required: false},
        {arg: 'limit', type: 'number', required: false},
        {arg: 'res', type:'object', 'http': {source: 'res'}}
        ],
        returns: {},
        http: {path: '/GenerateExcelReport', verb: 'get'}
    }
    );
};

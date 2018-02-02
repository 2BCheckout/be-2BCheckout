'use strict';

module.exports = function(Ride) {
	Ride.scope


	Ride.getReport = function(filter, skip, limit, cb){
		// console.log('filter: ', filter);
		Ride.find({
			where: {
				date: {
					between: [filter.initial_date, filter.final_date]
				}
			},
			include: ["students", "route"],
			skip: skip,
			limit: limit
		}, (err, rides) => {
			if (err) console.log('err: ', err);
			else console.log('rides: ', rides);
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
    	Ride.count({
			where: {
				date: {
					between: [filter.initial_date, filter.final_date]
				}
			},
			include: ["students", "route"],
			skip: skip,
			limit: limit
		}, (err, result) => {
			if (err) console.log('err: ', err);
			else console.log("result: ", result);
			cb(err, result);
		});
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
};

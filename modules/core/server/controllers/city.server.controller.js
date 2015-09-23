'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    City = mongoose.model('City');

exports.list = function(req, res) {
   //    console.log(req.countries);
    var query=req.query;
    var search=query.search;
    if(search !=null){
        var re = new RegExp('\\b' + search + '\S*', 'i');
        console.log(re);
        var find = City.find({'city_name':re}).limit(15);

        find.exec(function (err, cities) {
            if (err) {
                console.log(err);
                
            } else {

                console.log('Cities returned:' + cities.length);

                var result = {
                    'CityData': cities,
                    'TotalCities': cities.length
                };
                res.jsonp(result);
            }
        });

    }
    else{
        City.find().exec(function(err, users) {
        if (err) {
           console.log(err);
        } else {
            res.jsonp(users);
        }
    });
    }
};

/**
 * Created by neha on 11/6/14.
 */
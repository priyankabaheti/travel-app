
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Target Schema
 * As of now Schema is similar to CMS Schema
 * TODO : Add categorization,image url,categorization: [String],relatedTargets: [String], showtCoolOff
 */

var CountrySchema = new Schema({

    city_name:String,
    cityID:String

}, { strict: false });

var AirportSchema = new Schema({

    city : String,
    code : String,
    worldareacode : String,
    country : String,
    longitude : Number,
    latitude : Number,
    airportname : String,
    gmt :String

}, { strict: false });



mongoose.model('Airport', AirportSchema);

mongoose.model('City', CountrySchema);
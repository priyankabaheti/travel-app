
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


mongoose.model('City', CountrySchema);
/**
 * Created by neha on 10/16/15.
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var ItinerarySchema = new Schema({
    created:{
        by:{ type: Schema.Types.ObjectId, ref: 'User' },
        at: Date
    },
    title:String,

    notes:String,
    day:Date,
    data: {type: Schema.Types.Mixed},
    shared_with:{type: [Schema.Types.ObjectId], ref: 'User' }
}, { strict: false });




mongoose.model('Itinerary',ItinerarySchema);


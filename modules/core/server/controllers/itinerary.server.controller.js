/**
 * Created by neha on 10/16/15.
 */
'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Itinerary = mongoose.model('Itinerary'),
    nodemailer=require('nodemailer'),
    _ = require('lodash'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a itinerary
 */
exports.create = function (req, res) {
    var itinerary = new Itinerary(req.body);
    itinerary.user = req.user;

    itinerary.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(itinerary);
        }
    });
};

/**
 * Show the current itinerary
 */
exports.read = function (req, res) {
    res.json(req.itinerary);
};

/**
 * Update a itinerary
 */
exports.update = function (req, res) {
    var itinerary = req.body.data;
    var id= req.body.id;

    //itinerary.title = req.body.title;
   // itinerary.content = req.body.content;
console.log(itinerary);
    Itinerary.findById(id).exec(function (err, iti) {
        if (err) {
            return next(err);
        } else {
            iti = _.extend(iti, itinerary);
            iti.save();
            console.log(iti);
            res.jsonp(iti);

        }});
   /* itinerary.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(itinerary);
        }
    });*/
};

/**
 * Delete an itinerary
 */
exports.delete = function (req, res) {
    var itinerary = req.itinerary;

    itinerary.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(itinerary);
        }
    });
};

/**
 * List of itinerarys
 */
exports.list = function (req, res) {
    console.log(req.query.userId);
    var user= mongoose.Types.ObjectId(req.query.userId);
    //var shared= req.body.sharedId
    console.log("USERRRR"+user);
    Itinerary.find({ $or: [{'created.by':user},{'shared_with':user}]}).sort('-created').populate('user', 'displayName').exec(function (err, itinerarys) {
        // use it later
    //Itinerary.find().sort('-created').populate('user', 'displayName').exec(function (err, itinerarys) {
            if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(itinerarys);
        }
    });
};
exports.checkIfExists=function(req,res){

    Itinerary.findOne({'data.id':req.body.id,'created.by':req.body.user}).exec(function (err, data) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
           if(data!=null) {
               res.json({exists:true});
           }
            else{
               res.json({exists:false});
           }
        }
    });
};
exports.createmail = function(req, res) {
    var data = req.body;
    var mailOpts, smtpTrans;
    var mailOptions = {
        from: data.name, // sender name
        text: data.msg,
         to: data.receiver,
         subject: "Find My Itinerary On This Cool Platform"// plaintext body
    };
    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'ntekriwal@gmail.com  ',
            pass: 'Roomno434'
        }
    });

    // NB! No need to recreate the transporter object. You can use
    // the same transporter object for all e-mails

    // setup e-mail data with unicode symbols
   /* var mailOptions = {
        from: 'Fred Foo ✔ <foo@blurdybloop.com>', // sender address
        to: 'ty@radleaf.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ✔', // plaintext body
        html: '<b>Hello world ✔</b>' // html body
    };*/

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
            res.jsonp(info.response);
        }
    });

};

/**
 * itinerary middleware
 */
exports.itineraryByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'itinerary is invalid'
        });
    }
    console.log(id);

    Itinerary.find({ $or: [{'created.by':id},{'shared_with':id}]}).populate('user', 'displayName').exec(function (err, itinerary) {
        if (err) {
            return next(err);
        } else if (!itinerary) {
            return res.status(404).send({
                message: 'No itinerary with that identifier has been found'
            });
        }
        console.log(itinerary);
        req.itinerary = itinerary;
        next();
    });
};

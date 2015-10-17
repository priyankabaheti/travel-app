'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  var city = require('../controllers/city.server.controller');
    var airport = require('../controllers/airport.server.controller');

    var itinerary = require('../controllers/itinerary.server.controller');
 app.route('/api/cities')
    .get(city.list);
app.route('/api/airport')
    .get(airport.list);
    app.route('/api/itinerary')
        .get(itinerary.list)
        .post(itinerary.create)

        .put(itinerary.update);
  // Define error pages
    app.route('/api/itinerary/:itineraryId')
        .get(itinerary.read)
        .put(itinerary.update)
        .delete(itinerary.delete);
    app.route('/api/itinerary_check')
        .post(itinerary.checkIfExists);

    // Finish by binding the article middleware
    app.param('itineraryId', itinerary.itineraryByID);

    app.route('/mail').post(itinerary.createmail);
      app.route('/server-error').get(core.renderServerError);

      // Return a 404 for all undefined api, module or lib routes
      app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

      // Define application route
      app.route('/*').get(core.renderIndex);
};

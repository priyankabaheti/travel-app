'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  var city = require('../controllers/city.server.controller');
 	 var airport = require('../controllers/airport.server.controller');
 app.route('/api/cities')
    .get(city.list);
app.route('/api/airport')
    .get(airport.list);
  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);
};

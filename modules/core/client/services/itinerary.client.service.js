'use strict';

//Itinerary service used for communicating with the Itinerary REST endpoints
angular.module('core').factory('Itinerary', ['$resource',
    function ($resource) {
        return $resource('api/itinerary/:itineraryId', {
           itineraryId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
/**
 * Created by neha on 10/16/15.
 */

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('articles').factory('Airport', ['$resource',
    function($resource) {
        return $resource('api/airport', {
            cityID: '@_id'
        },{

            update: {
                method: 'PUT'
            }
        });
    }
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('core').factory('City', ['$resource',
    function($resource) {
        return $resource('api/cities', {
            cityID: '@_id'
        },{

            update: {
                method: 'PUT'
            }
        });
    }
]);
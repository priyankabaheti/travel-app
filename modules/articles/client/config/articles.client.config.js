'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Travel',
      state: 'articles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Travel Places',
      state: 'articles.list'
    });

      Menus.addSubMenuItem('topbar', 'articles', {
          title: 'My Itinerary',
          state: 'itinerary.view({itineraryId: itinerary._id})',
          roles: ['user']
      });
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Travel Experience',
      state: 'articles.create',
      roles: ['user']
    });
  }
]);

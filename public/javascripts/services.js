// Angular service module for connecting to JSON APIs
angular.module('eventServices', ['ngResource']).
	factory('Event', function($resource) {
		return $resource('/events/:id', {}, {
			// Use this method for getting a list of polls
			query: { method: 'GET', params: { id: 'events' }, isArray: true }
		});
	}).
	factory('Sign', function($resource) {
		return $resource('/sign/:id', {}, {
			query: {method: 'GET', params: { id: 'logins'}, isArray: true }
		});
	}).
	factory('socket', function($rootScope) {
		var socket = io.connect();
		return {
			on: function (eventName, callback) {
	      socket.on(eventName, function () {  
	        var args = arguments;
	        $rootScope.$apply(function () {
	          callback.apply(socket, args);
	        });
	      });
	    },
	    emit: function (eventName, data, callback) {
	      socket.emit(eventName, data, function () {
	        var args = arguments;
	        $rootScope.$apply(function () {
	          if (callback) {
	            callback.apply(socket, args);
	          }
	        });
	      })
	    }
		};
	});
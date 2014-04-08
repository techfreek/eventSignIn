// Angular module, defining routes for the app
angular.module('events', ['eventServices']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/events', { templateUrl: 'partials/list.html', controller: EventListCtrl }).
			when('/event/:eventId', { templateUrl: 'partials/item.html', controller: EventItemCtrl }).
			when('/event/edit/:eventId', {templateUrl: 'partials/edit.html', controller: EventEditCtrl }).
			when('/new', { templateUrl: 'partials/new.html', controller: EventNewCtrl }).
			//when('/edit', {templateUrl: 'partials/edit.html', controller: EventEditCtrl}).
			// If invalid route, just redirect to the main list view
			otherwise({ redirectTo: '/events' });
	}]);
	
// Angular module, defining routes for the app
angular.module('events', ['eventServices', 'ngRoute']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/events', { templateUrl: 'partials/list.html', controller: EventListCtrl })
		$routeProvider.when('/event/:eventId', { templateUrl: 'partials/item.html', controller: EventItemCtrl })
		$routeProvider.when('/event/:eventId/edit', {templateUrl: 'partials/edit.html', controller: EventEditCtrl })
		$routeProvider.when('/event/:eventId/manage', {templateUrl: 'partials/manage.html', controller: EventMgmtCtrl })
		$routeProvider.when('/event/:eventId/view', {templateUrl: 'partials/view.html', controller: EventViewCtrl })
		$routeProvider.when('/new', { templateUrl: 'partials/new.html', controller: EventNewCtrl })
			//when('/edit', {templateUrl: 'partials/edit.html', controller: EventEditCtrl}).
			// If invalid route, just redirect to the main list view
		$routeProvider.otherwise({ redirectTo: '/events' })
	}]);
	
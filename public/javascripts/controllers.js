// Controller for the Event list
function EventListCtrl($scope, Event) {
	$scope.Events = Event.query();
}

// Controller for an individual Event
function EventItemCtrl($scope, $routeParams, socket, Sign, Event) {
	//console.log($routeParams.eventId);
	$scope.Event = Event.get({id: $routeParams.eventId});
	$scope.voted = false;
	$scope.signature = {
		name: '',
		timestamp: '',
		EventID: ''
	}

	socket.on('signIn', function(data) {
		console.dir(data);
		if(data._id === $routeParams.EventId) {
			$scope.Event = data;
		}
	});
	
	socket.on('signed', function(data) {
		console.log(data);
		if(data._id === $routeParams.EventId) {
			$scope.Event.totalAttendee = data.sigs;
		}		
	});
	
	$scope.sign = function() {
		$scope.voted = true;
		var EventId = $scope.Event._id;

		$scope.signature.EventID = EventId;
		$scope.signature.timestamp = Date.now();

		var signObj = $scope.signature;

		if($scope.signature.name)

		if($scope.signature.name) {
			socket.emit('send:vote', signObj);
		} else {
			alert('You must select an option to vote for');
		}
	};
}

// Controller for creating a new Event
function EventNewCtrl($scope, $location, Event) {
	// Define an empty Event model object
	$scope.Event = {
		name: '',
		club: '',
		pw: '',
		open: true
	}
	
	// Validate and save the new Event to the database
	$scope.createEvent = function() {
		// Check that an event and club were provided
		if($scope.Event.name != '') {
			if($scope.Event.club  != '') {
				var newEvent = new Event($scope.Event);
				console.log(newEvent);
				newEvent.$save(function(p, resp) {
					if(!p.error) {
						//If there is no error, redirect to main view
						$location.path('event');
						console.log("Success!");
					} 
					else {
						alert('Could not create event');
						console.log(p);
					}
					console.log(resp);
				});
			};
		};
	};
}
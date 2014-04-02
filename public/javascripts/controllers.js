// Controller for the Event list
function EventListCtrl($scope, Event) {
	$scope.Events = Event.query();
}

// Controller for an individual Event
function EventItemCtrl($scope, $routeParams, socket, Event) {	
	$scope.Event = Event.get({EventId: $routeParams.EventId});
	
	socket.on('signIn', function(data) {
		console.dir(data);
		if(data._id === $routeParams.EventId) {
			$scope.Event = data;
		}
	});
	
	socket.on('sign', function(data) {
		console.dir(data);
		if(data._id === $routeParams.EventId) {
			$scope.Event.choices = data.choices;
			$scope.Event.totalVotes = data.totalVotes;
		}		
	});
	
	$scope.vote = function() {
		var EventId = $scope.Event._id,
				choiceId = $scope.Event.userVote;
		
		if(choiceId) {
			var voteObj = { Event_id: EventId, choice: choiceId };
			socket.emit('send:vote', voteObj);
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
		open: '',
	};
	
	
	// Validate and save the new Event to the database
	$scope.createEvent = function() {
		var Event = $scope.Event;
		
		// Check that a question was provided
		if(Event.name.length > 0) {
			if(Event.club.length > 0) {
				var newEvent = new Event(Event);
				newEvent.$save(function(p, resp) {
					if(!p.error) {
						//If there is no error, redirect to main view
						$location.path('event');
					} else {
						alert('Could not create event');
					}
				})
			}
		}
	};
}
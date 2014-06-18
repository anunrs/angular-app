angular.module('app', [
	'ngRoute',
	'projectsinfo',
	'dashboard',
	'projects',
	'admin',
	'users',
	'services.breadcrumbs',
	'services.i18nNotifications',
	'services.httpRequestTracker',
	'services.locationHistory',
	'security',
	'directives.crud',
	'directives.icon',
	'templates.app',
	'templates.common',
	'ui.bootstrap',
	'underscore',
	'moment'
]);

angular.module('app').constant('MONGOLAB_CONFIG', {
	baseUrl: '/databases/',
	dbName: 'ngpmtool'
});

angular.module('app').constant('ATHENAWEBAPP_CONFIG', {
	baseUrl: '/projectile'
	// baseUrl: '/databases/',
	// dbName: 'ngpmtool'
});

//TODO: move those messages to a separate module
angular.module('app').constant('I18N.MESSAGES', {
	'errors.route.changeError':"Route change error: {{reason}}",

	'crud.unsaved':"Page has unsaved changes. Please save/revert the changes and try again",

	'crud.user.save.success':"User was saved successfully. (id :'{{id}}')",
	'crud.user.save.error':"An error occurred while saving the user: '{{error}}'",

	'crud.user.remove.success':"User was removed successfully. (id :'{{id}}')",
	'crud.user.remove.error':"An error occurred while removing the user : '{{error}}'.",

	// --------------------------------------------------
	'crud.project.save.success':"Project was saved successfully. (id :'{{id}}')",
	'crud.project.save.error':"An error occurred while saving the project: '{{error}}'",

	'crud.project.remove.success':"Project was removed successfully. (id :'{{id}}')",
	'crud.project.remove.error':"An error occurred while removing the project : '{{error}}'.",

	// --------------------------------------------------
	'crud.backlog.save.success':"Backlog Item was saved successfully. (id :'{{id}}')",
	'crud.backlog.save.error':"An error occurred while saving the backlog item: '{{error}}'",

	'crud.backlog.remove.success':"Backlog item was removed successfully. (id :'{{id}}')",
	'crud.backlog.remove.error':"An error occurred while removing the backlog item : '{{error}}'.",

	// --------------------------------------------------
	'crud.task.save.success':"Task was saved successfully. (id :'{{id}}')",
	'crud.task.save.error':"An error occurred while saving the task: '{{error}}'",

	'crud.task.remove.success':"Task was removed successfully. (id :'{{id}}')",
	'crud.task.remove.error':"An error occurred while removing the task : '{{error}}'.",

	// --------------------------------------------------
	'crud.sprint.save.success':"Sprint was saved successfully. (id :'{{id}}')",
	'crud.sprint.save.error':"An error occurred while saving the sprint: '{{error}}'",
	'crud.sprint.expired.error':"Cannot edit an expired sprint",

	'crud.sprint.remove.success':"Sprint was removed successfully. (id :'{{id}}')",
	'crud.sprint.remove.error':"An error occurred while removing the sprint : '{{error}}'.",

	// --------------------------------------------------
	'login.reason.notAuthorized':"You do not have the necessary access permissions.  Do you want to login as someone else?",
	'login.reason.notAuthenticated':"You must be logged in to access this part of the application.",
	'login.error.invalidCredentials': "Login failed.  Please check your credentials and try again.",
	'login.error.serverError': "There was a problem with authenticating: {{exception}}."
});

angular.module('app').config([
	'$routeProvider',
	'$locationProvider',
	function (
		$routeProvider,
		$locationProvider
	) {
		$locationProvider.html5Mode(true);
		$routeProvider.otherwise({redirectTo:'/projects'});
	}
]);

angular.module('app').run(['security', function(security) {
  // Get the current user when the application starts
  // (in case they are still logged in from a previous session)
  security.login();
  security.requestCurrentUser();
}]);

angular.module('app').controller('AppCtrl', [
	'$scope',
	'i18nNotifications',
	'localizedMessages',
	'locationHistory',
	'$rootScope',
	'$location',
	function(
		$scope,
		i18nNotifications,
		localizedMessages,
		locationHistory,
		$rootScope,
		$location
	) {
		$scope.notifications = i18nNotifications;
		// $scope.locationHistory = locationHistory;

		$scope.removeNotification = function (notification) {
			i18nNotifications.remove(notification);
		};
		$scope.removeAllNotifications = function () {
			i18nNotifications.removeAll();
		};

		locationHistory.init();

		// $rootScope.$on('$routeChangeSuccess', function(event, current, previous, other){
		// 	locationHistory.push($location.$$path);
		// 	console.log("Route changed");
		// 	console.log({
		// 		history: locationHistory.getHistory(),
		// 		lhcurrent: locationHistory.getCurrent(),
		// 		future: locationHistory.getFuture(),
		// 		location: $location,
		// 		event: event,
		// 		current: current,
		// 		previous: previous,
		// 		other: other
		// 	});
		// });

		$scope.$on('$routeChangeError', function(event, current, previous, rejection){
			i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {reason: rejection}, {rejection: rejection});
			// console.log({rejection: rejection});
		});
	}
]);

angular.module('app').controller('HeaderCtrl', [
	'$scope',
	'$location',
	'locationHistory',
	'$route',
	'security',
	'breadcrumbs',
	'notifications',
	'httpRequestTracker',
	function (
		$scope,
		$location,
		locationHistory,
		$route,
		security,
		breadcrumbs,
		notifications,
		httpRequestTracker
	) {
		$scope.location = $location;
		$scope.breadcrumbs = breadcrumbs;

		$scope.isAuthenticated = security.isAuthenticated;
		$scope.isAdmin = security.isAdmin;

		$scope.home = function () {
			if (security.isAuthenticated()) {
				$location.path('/dashboard');
			} else {
				$location.path('/projectsinfo');
			}
		};

		$scope.back = function () {
			locationHistory.prev();
		};

		$scope.showBackLink = function () {
			return locationHistory.hasHistory();
		};

		$scope.isNavbarActive = function (navBarPath) {
			return navBarPath === breadcrumbs.getFirst().name;
		};

		$scope.hasPendingRequests = function () {
			return httpRequestTracker.hasPendingRequests();
		};
	}
]);

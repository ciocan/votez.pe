var _ = lodash;

var app = angular.module('votez.pe',['angular-meteor','ui.router', 'ui.bootstrap', 'ngAnimate']);

Meteor.startup(function () {
	angular.bootstrap(document, ['votez.pe']);
});


app.constant("candidates", 
	[
        {'name': 'Monica Macovei',			'slug': 'macovei',		'_id': 11, 'org': 'Candidat independent'},
        {'name': 'Klaus Iohannis',			'slug': 'iohannis',		'_id': 12, 'org': 'ACL'},
        {'name': 'Victor Ponta',			'slug': 'ponta',		'_id': 13, 'org': 'PSD'},
        {'name': 'Elena Udrea',				'slug': 'udrea',		'_id': 14, 'org': 'PMP'},
        {'name': 'Dan Diaconescu',			'slug': 'diaconescu',	'_id': 15, 'org': 'PP-DD'},
        {'name': 'Kelemen Hunor',			'slug': 'hunor',		'_id': 16, 'org': 'UDMR'},
        {'name': 'Calin Popescu Tariceanu',	'slug': 'tariceanu',	'_id': 17, 'org': 'Candidat independent'},
        {'name': 'Teodor Melescanu',		'slug': 'melescanu',	'_id': 18, 'org': 'Candidat independent'},
        {'name': 'William Brânza',			'slug': 'branza',		'_id': 19, 'org': 'PER'},
        {'name': 'Corneliu Vadim Tudor',	'slug': 'vadim',		'_id': 20, 'org': 'PRM'},
        {'name': 'Szilagy Zsolt',			'slug': 'zsolt',		'_id': 21, 'org': 'PPMT'},
        {'name': 'Constantin Rotaru',		'slug': 'rotaru',		'_id': 22, 'org': 'PAS'},
        {'name': 'Mirel Mircea Amaritei',	'slug': 'amaritei',		'_id': 23, 'org': ''},
        {'name': 'Gheorghe Funar',			'slug': 'funar',		'_id': 24, 'org': 'Candidat independent'},
        {'name': 'Nu votez',				'slug': 'niciunul',		'_id': 25, 'org': ''}
    ]);

app.constant("quotes",
	[
		{'title': 'Votez întotdeauna din moment ce am acest drept. Dacă nu-ţi place niciun candidat, anulează-ţi votul, dar arată că ai o atitudine civică. Dacă stai acasă, n-ai niciun drept să te plângi!', 'author': 'Ileana Vulpescu', 'url': 'http://ro.wikipedia.org/wiki/Ileana_Vulpescu'},
		{'title': 'Un buletin de vot este mai puternic decât un glonte.', 'author': 'Abraham Lincoln', 'url': 'http://ro.wikipedia.org/wiki/Abraham_Lincoln'},
		{'title': 'Votează mereu pentru principii şi-ai putea înţelege că votul tău nu este pierdut.', 'author': 'John Quincy Adams', 'url':'http://ro.wikipedia.org/wiki/John_Quincy_Adams'},
		{'title': 'Ceea ce generalizează voinţa nu este atât numărul voturilor cât interesul comun care le uneşte.', 'author': 'Jean-Jacques Rousseau', 'url':'http://ro.wikipedia.org/wiki/Jean-Jacques_Rousseau'},
		{'title': 'Nu mâna care semnează legile este cea care ţine frâiele destinului tarii, ci mâna care votează.', 'author': 'Harry Truman', 'url':'http://ro.wikipedia.org/wiki/Harry_S._Truman'},
		{'title': 'Un om fără un vot este un om fără protecție.', 'author': 'Lyndon B. Johnson', 'url':'http://ro.wikipedia.org/wiki/Lyndon_B._Johnson'},
		{'title': 'Că avem votul nu înseamnă nimic. Să-l folosim în mod corect înseamnă totul.', 'author': 'Lou Henry Hoover', 'url':'http://en.wikipedia.org/wiki/Lou_Henry_Hoover'},
		{'title': 'Oficialii proşti sunt cele aleși de către cetățeni buni care nu votează.', 'author': 'George Jean Nathan', 'url':'http://en.wikipedia.org/wiki/George_Jean_Nathan'},
		{'title': 'Votul este dreptul cel mai de preț al fiecărui cetățean, și noi avem o obligație morală de a asigura integritatea procesului de votare.', 'author': 'Hillary Clinton', 'url':'http://ro.wikipedia.org/wiki/Hillary_Rodham_Clinton'},
		{'title': 'Cred că votarea pentru cel mai mic dintre două rele, în teoria jocurilor duce întotdeauna la mai rău.', 'author': 'Penn Jillette', 'url':'http://en.wikipedia.org/wiki/Penn_Jillette'},
		{'title': 'Este foarte important să votezi. Oamenii au murit pentru acest drept.', 'author': 'Lenny Kravitz', 'url':'http://ro.wikipedia.org/wiki/Lenny_Kravitz'},
		{'title': 'Democrația nu poate avea succes decât dacă cei care îşi exprimă alegerea, sunt pregătiţi pentru a alege cu înțelepciune. Adevărata garanție a democrației, prin urmare, este educația.', 'author': 'Franklin D. Roosevelt', 'url':'http://ro.wikipedia.org/wiki/Franklin_Delano_Roosevelt'},
		// {'title': '', 'author': '', 'url':''},
	]);

app.provider('AllVotes', function(){
	var data = [];
	var total = 0;

	var get = function(candidate) {
		return _.find(data, {'c': candidate});
	};
	var getTotal = function() {
		return total;
	};

	return {
		add: function(candidate) {
			data.push(candidate);
			total += candidate.v;
		},
		update: function(candidate) {
			var match = _.find(data, {'_id': candidate._id});
		    _.each(candidate, function(v,k) {
		    	match[k] = v;
		    });
		    total++;
		},
		$get: function() {
        	return {
        		data: data,
        		get: get,
        		getTotal: getTotal,
        	}
        }
    }
});

app.config(['$urlRouterProvider', '$stateProvider', '$locationProvider', '$provide', 'candidates', 'AllVotesProvider',
	function($urlRouterProvider, $stateProvider, $locationProvider, $provide, candidates, AllVotesProvider){

	    Meteor.subscribe("userData");	
		Meteor.subscribe("myVote");
		Meteor.subscribe("totalVotes");

		var totalVotes = TotalVotes.find();
		totalVotes.observe({
			added: function (candidate) {				
				AllVotesProvider.add(candidate);
			}, 
			changed: function(candidate) {				
				AllVotesProvider.update(candidate);
			}
		});

        // googleExperimentsProvider.configure({
        //     experimentId: 'vp-head'
        // });

	    $locationProvider.html5Mode(true);

	    $stateProvider
	    	.state('home', {
	    		url:'/',
	    		template: UiRouter.template('home.html'),
				controller: 'HomeCtrl'
	    	});	

	    	_.each(candidates, function(candidate) {
				$stateProvider.state(candidate.slug, {
					url: '/'+candidate.slug,
					template: UiRouter.template('candidate.html'),
					controller: 'CandidateCtrl',
					data: { candidate: candidate }
				});
				$stateProvider.state(candidate.slug+'info', {
					url: '/'+candidate.slug+'/:voteId',
					template: UiRouter.template('candidate.html'),
					controller: 'CandidateCtrl',
					data: { candidate: candidate }
				});
	    	});

	    $urlRouterProvider.otherwise("/");
	}
]);

app.directive("candidate", function() {
	return {
		restrict: 'E',
		scope: {
			info: '=info',
			vote: '=vote',
			light: '@light',			
		},		
		templateUrl: 'candidate-directive'
	}
});

app.directive("vpProgress", function() {
	return {
		restrict: 'E',
		scope: {
			total: '=total'
		},
		templateUrl: 'vp-progress-directive',
		link: function(scope, element, attrs) {
			scope.$watch('total', function() {
				if(scope.total > 0 && scope.total < 1000)
					scope.max = 1000;
				if(scope.total > 1000 && scope.total < 10000)
					scope.max = 10000;
				if(scope.total > 10000 && scope.total < 100000)
					scope.max = 100000;
				if(scope.total > 100000 && scope.total < 1000000)
					scope.max = 1000000;
				if(scope.total > 1000000 && scope.total < 5000000)
					scope.max = 5000000;
				scope.percent = Math.round(scope.total * 100 / scope.max);
			});

			var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
			var today = new Date();
			var lastDate = new Date("November 02, 2014 23:59:00");

			scope.days = Math.round(Math.abs((today.getTime() - lastDate.getTime())/(oneDay)));
		}		
	}
});

app.service('Auth', ['Vote', function(Vote) {
	this.isLogged = function() {
		return Meteor.userId();
	}

	this.login = function(candidate) {

		Meteor.loginWithFacebook({loginStyle: 'popup'}, function(err){
			if (err){
				//console.log(err);
				return false;
			} else {
				Vote.save(candidate);
				Tracker.flush();
				return true;
			}
		});  
	}

	this.logout = function() {
		Meteor.logout();
	}
}]);

app.service('Vote', ['$rootScope', function($rootScope) {
	this.save = function(candidate) {
		swal({  
				title: "Sigur vrei sa votezi pe "+candidate.name+'?',
				text: "",
				type: null,
				showCancelButton: true,
				cancelButtonText: 'NU',
				confirmButtonColor: "#4285f4",   
				confirmButtonText: "DA, vreau sa votez!" },  
				function(){
					Meteor.call('vote', candidate._id);
				});
	}
}]);

app.controller("HomeCtrl", ['$scope', '$state', 'candidates', 'Auth', 'quotes', 
	function($scope, $state, candidates, Auth, quotes){

		// shuffle candidates
		var c = _.shuffle(candidates);
		var nimeni = _.indexOf(c, candidates[c.length-1]);
		var tmp = c[nimeni];
		c[nimeni] = c[c.length-1];
		c[c.length-1] = tmp;			
		$scope.candidates = c;

		$scope.quote = _.shuffle(quotes)[0];
}]);


app.controller("CandidateCtrl", ['$scope', '$stateParams', '$state', 'candidates', 'Auth', '$user', 'quotes', 'AllVotes', 'Vote', '$rootScope', '$modal',
	function($scope, $stateParams, $state, candidates, Auth, $user, quotes, AllVotes, Vote, $rootScope, $modal) {

    	$scope.slug = $state.current.data.candidate.slug;
    	$scope.candidate = _.find(candidates, {'slug': $state.current.data.candidate.slug});
		$rootScope.title = $scope.candidate.name;
		$scope.quote = _.shuffle(quotes)[0];
		$scope.argument = '';
		$scope.anonim = true;
		$scope.me = '';
		$scope.fbpic = '';
		$scope.ready = false;


		// -------------------------------------------------------------------------------------------------------------
		$scope.allVotes = function(candidate) {
			if(AllVotes.get(candidate)) {
				return AllVotes.get(candidate).v	
			} else {
				return 0;
			}			 
		}
		$scope.allArguments = function(candidate) {
			if(AllVotes.get(candidate)) {
				return AllVotes.get(candidate).a	
			} else {
				return 0;
			}			 
		}
		$scope.percent = function(candidate) {
			if(AllVotes.get(candidate)) {
				return AllVotes.get(candidate).v * 100 / AllVotes.getTotal();
			} else {
				return '%';
			}
		}
		$scope.total = function() {		
			if(AllVotes.getTotal()) {
				return AllVotes.getTotal();
			} else {
				return 0;
			}		 	
		}

		// -------------------------------------------------------------------------------------------------------------
		if($state.params.voteId) {
			Meteor.subscribe('selectedArgument', $state.params.voteId, $scope.candidate._id);
		}
		

		// -------------------------------------------------------------------------------------------------------------
		$scope.argumentsList = [];
		$scope.spinner = true;
		$scope.limit = 10;
		var sub = null;

		$scope.loadMore = function() {
			$scope.limit += 10;
		}

		$scope.$watch('limit', function(val) {
			//console.log(val);
			sub = Meteor.subscribe("argumentsList", $scope.candidate._id, val, function() {
				//console.log('subscribed');
				$scope.spinner = false;
				if(!$scope.$$phase) {
					$scope.$apply();
				}			
			});			
		});		


		// -------------------------------------------------------------------------------------------------------------		
		var votes = Votes.find();

		votes.observe({
			added: function (doc) {
				// console.log("added");
				if(Meteor.userId()) { 
					// selected argument
					if(doc._id == $state.params.voteId) {
						$("body").animate({scrollTop: 0}, "slow");
						$scope.selectedArgument = doc;
						if(!$rootScope.$$phase) {
							$rootScope.$apply();
						}						
					}

					// my argument
					if(doc.o == Meteor.userId()) {
						// console.log("me");
						// console.log(doc);
						$scope.argument = doc.a || '';
						$scope.me = doc.f || '';	
						$rootScope.myVote = doc;
						if(!$rootScope.$$phase) {
							$rootScope.$apply();
						}
					} else {
						$scope.argumentsList.push(doc);
						if(!$scope.$$phase) {
							$scope.$apply();
						}						
					}
				} else {
					$scope.argumentsList.push(doc);
					if(!$scope.$$phase) {
						$scope.$apply();
					}
				}

			}
		});
		votes.observeChanges({
			changed: function(id, fields) {				
				//console.log('changed2:');
				//console.log(id, fields);

				// myvote
				if($rootScope.myVote) {
					if(id == $rootScope.myVote._id) {
					    _.each(fields, function(v,k) {
					    	// console.log(k,v);
					    	$rootScope.myVote[k] = v;
							if(!$scope.$$phase) {
								$scope.$apply();
							}				    	
					    });					
					}					
				}
				// others
				var match = _.find($scope.argumentsList, {'_id': id});				
				if (match) {
				    _.each(fields, function(v,k) {
				    	// console.log(k,v);
				    	match[k] = v;
				    });
				}
				if(!$scope.$$phase) {
					$scope.$apply();
				}
			}
		});


		// -------------------------------------------------------------------------------------------------------------

		$scope.$watch('anonim', function(val) {
			if(val == false) {
				$scope.myfbpic = "//graph.facebook.com/"+Meteor.user().services.facebook.id+"/picture/?width=60&height=60";
				$scope.me = Meteor.user().services.facebook.id;
			}
		});

		$scope.voteFor = function(candidate) {
			if(Auth.isLogged()) {				
				Vote.save(candidate);
			} else {
				Auth.login(candidate);
			}			
		}

		$scope.updateArgument = function() {
			if($scope.argument.length > 0) {
				Meteor.call('updateArgument', $scope.argument.slice(0,139), $scope.anonim, $scope.candidate._id);
			}			
		}

		$scope.thumbs = function(id, c) {
			// check id
			if($rootScope.myVote) {
				var found = false;
				if($rootScope.myVote.hasOwnProperty('up')) {
					found = _.find($rootScope.myVote.up, function(val) {return val == id});
				}
				if(!found)
				if($rootScope.myVote.hasOwnProperty('dn')) {
					found = _.find($rootScope.myVote.dn, function(val) {return val == id});				
				}

				if(!found) Meteor.call('thumbs', id, c);
			}
		}

		$scope.fbpic = function(url) {
			if(url) {
				return '//graph.facebook.com/'+url+'/picture/?width=40&height=40';
			} else {
				return ''
			}
			
		}

		$scope.invite = function() {
			FB.ui({method: 'apprequests',
				app_id: '115517658476426',
				link: 'https://votez.pe',
				message: 'Tu pe cine votezi?'
			}, function(response) {
				//console.log(response);
			});			
		}

		$scope.share = function() {
			FB.ui({
			  method: 'share',
			  href: 'https://votez.pe',
			}, function(response){
				//console.log(response);
			});
		}

		$scope.whyShare = function() {
		    var modalInstance = $modal.open({
		      templateUrl: 'why-share',
		      controller: 'ModalCtrl',
		      size: 'lg'
		    });			
		}

}]);

app.controller('ModalCtrl', ['$scope','$modalInstance', function($scope, $modalInstance){
	$scope.ok = function() {
		$modalInstance.close();
	}	
}]);
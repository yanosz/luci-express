$juci.module("wifi")
.controller("WifiMacFilterPageCtrl", function($scope, $uci, $hosts, $uci_ex){
	$scope.guest_wifi = { }; 
	$scope.main_wifi = {}; 
	window.uci = $uci_ex; 
	$scope.uci = $uci_ex; 
	
	$uci_ex.sync(["wireless", "hosts"]).done(function(){
		console.log("synced wireless config"); 
		$scope.interfaces = $uci_ex.wireless['@wifi-iface']; 
		$scope.$apply(); 
	}).fail(function(err){
		console.log("failed to sync config: "+err); 
	}); 
	
	
	$scope.onApply = function(){
		$scope.busy = 1; 
		$uci_ex.save().done(function(){
			console.log("Saved wifi config!"); 
		}).fail(function(){
			console.log("Could not save wifi config!"); 
		}).always(function(){
			$scope.busy = 0; 
			$scope.$apply(); 
		}); 
	}
	
	return; 
	function load(){
		$uci.show("wireless").done(function(interfaces){
			var list = Object.keys(interfaces)
				.map(function(x){ return interfaces[x]; });
			$scope.devices = list.filter(function(x) { return x[".type"] == "wifi-device"; }); 
			$scope.interfaces = list.filter(function(x) { return x[".type"] == "wifi-iface"; }); 
			
			$scope.main_wifi = $scope.interfaces[0]; //$scope.interfaces.filter(function(x) { return x[".name"] == "main"; })[0] || {}; 
			$scope.guest_wifi = $scope.interfaces[1]; //$scope.interfaces.filter(function(x) { return x[".name"] == "guest"; })[0] || {}; 
			
			$scope.$apply(); 
		}); 
	} load(); 
	
	$scope.onApply = function(){
		$scope.busy = 1; 
		async.series([
			function(next){
				console.log("Saving object: "+JSON.stringify($scope.main_wifi)); 
				$uci.set("wireless."+$scope.main_wifi[".name"], $scope.main_wifi).done(function(){
					
				}).always(function(){ next(); }); 
			}, 
			function(next){
				console.log("Saving object: "+JSON.stringify($scope.guest_wifi)); 
				$uci.set("wireless."+$scope.guest_wifi[".name"], $scope.guest_wifi).done(function(){
					
				}).always(function(){ next(); }); 
			}, 
			function(next){
				$hosts.commit().always(function() { next(); }); 
			}
		], function(){
			$uci.commit("wireless").done(function(){
				console.log("Saved wifi settings!"); 
			}).fail(function(){
				console.log("Failed to save wifi settings!"); 
			}).always(function(){
				$scope.busy = 0;
				$scope.$apply(); 
			});  
		}); 
	}
	$scope.onCancel = function(){
		load(); 
	}
}); 

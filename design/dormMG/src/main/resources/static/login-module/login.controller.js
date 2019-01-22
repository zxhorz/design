'use strict';
angular.module('loginApp', []).controller('loginController', function ($rootScope,$location, $scope, $http, $timeout) {
	$rootScope.show_login = true;
	$rootScope.show_register = false;
	$rootScope.show_forget = false;
	$rootScope.show_change = false;
	$rootScope.showError = false;
	$rootScope.showSuccess = false;
	$rootScope.key = null;
	getToken();
	getKey();


	function getKey() {
		$http({
			method: 'GET',
			url: '/login/getKey',
		}).success(function (data) {
			// window.location.href = 'http://'+window.location.host + '/static/index.html';
			if (data.message === 'S') {
				$rootScope.key = data.data;
			} else {
				$rootScope.msg = "Error";
				$rootScope.showError = true;
			}
		}).error(function (data) {
			console.info(data);
		});
	}

	function getToken(){
		var token = $location.absUrl();
		if(token){
			$http({
				method: 'POST',
				url: '/login/getMessage',
				params: {
					'token': token
				}
			}).success(function (data) {
				// window.location.href = 'http://'+window.location.host + '/static/index.html';
				if (data.message === 'S'){
					var user = data.data;
					$rootScope.userName = user.username;
					$rootScope.password = user.password;
				}
				else if (data.message === 'N'){
				}
				else {
					$rootScope.msg = "Link wrong or overdue";
					$rootScope.showError = true;
					$timeout(function () {
						window.location.href = 'http://' + window.location.host;
					}, 3000);
				}
			}).error(function (data) {
				console.info(data);
			});
		}
	}

    $scope.signIn = function () {
    	var loginDto = {};
    	loginDto.userName = $scope.userName;
    	loginDto.password = $scope.password;
    	loginDto.captcha = $scope.captcha_login;

    	if (!loginDto.password && !loginDto.userName) {
    		$rootScope.msg = "please enter username/password"
    		$rootScope.showError = true;
    	} else if (!loginDto.password) {
    		$rootScope.msg = "please enter password"
    		$rootScope.showError = true;
    	} else if (!loginDto.userName) {
    		$rootScope.msg = "please enter username"
    		$rootScope.showError = true;
    	} else {
			var encrypt = new JSEncrypt();
			encrypt.setPublicKey($rootScope.key);
			loginDto.userName = encrypt.encrypt(loginDto.userName);
			loginDto.password = encrypt.encrypt(loginDto.password);
			loginDto.captcha = encrypt.encrypt(loginDto.captcha);
    		$http({
    			method: 'POST',
    			url: '/login/login',
    			headers: {
    				'Content-Type': 'application/x-www-form-urlencoded'
    			},
    			data: $.param(loginDto)
    		}).success(function (data) {
    			// window.location.href = 'http://'+window.location.host + '/static/index.html';
    			if (data.message === 'S') {
    				$rootScope.showError = false;
    				window.location.href = 'http://' + window.location.host + '/index.html';
    			} else {
    				$scope.changeImg("#imgCaptcha_login");
    				$rootScope.msg = data.data;
    				$rootScope.showError = true;
    			}
    		}).error(function (data) {
    			console.info(data);
    		});
    	}
    }
	
	$rootScope.changePassword = function () {
		var loginDto = {};
		if (checkPassword()) {
			loginDto.userName = $scope.userName;
			loginDto.password = $rootScope.password;
			loginDto.newPassword = $scope.newPassword1;

			var encrypt = new JSEncrypt();
			encrypt.setPublicKey($rootScope.key);
			loginDto.userName = encrypt.encrypt(loginDto.userName);
			loginDto.password = encrypt.encrypt(loginDto.password);
			loginDto.newPassword = encrypt.encrypt(loginDto.newPassword);
			$http({
				method: 'POST',
				url: '/login/changePassword',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data:  $.param(loginDto)
			}).success(function (data) {
				// window.location.href = 'http://'+window.location.host + '/static/index.html';
				if (data.message === 'S')
					window.location.href = 'http://' + window.location.host + '/index.html';
				else {
					$rootScope.msg = "userName/password not correct or the account is not activated!";
					$rootScope.showError = true;
				}
			}).error(function (data) {
				console.info(data);
			});
		} else {
			$rootScope.showError = true;
		}
    }
    
    $rootScope.register = function() {
		var regex = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
		if(!regex.test($scope.email)){
			$rootScope.msg = "Invalid Email"
			$rootScope.showError = true;
			return;
		}
        $http({
            method: 'POST',
            url: '/login/register',
            params: {
				'email': $scope.email,
				'captcha': $scope.captcha_register
            }
        }).success(function (data) {
        	$rootScope.msg = data.data;
        	var code = data.code;
        	if (code === "S") {
        		$rootScope.showSuccess = true;
        		$rootScope.showError = false;
        		$timeout(function () {
        			// $rootScope.show_login = !$rootScope.show_login;
	            	// $rootScope.show_register = !$rootScope.show_register;
	            	// $rootScope.userName = $scope.email;
					// $rootScope.msg = "Activate your account in your email and login!";
					window.location.href = 'http://' + window.location.host;
				}, 3000);
        	} else if (code === "E") {
				$rootScope.changeImg("#imgCaptcha_register");
        		$rootScope.showSuccess = false;
        		$rootScope.showError = true;
        	}
        }).error(function (data) {
            console.info(data);
        });
	}
	
    $rootScope.checkForgotActivationCode = function() {
        $http({
            method: 'POST',
            url: '/login/checkForgotActivationCode',
            params: {
				'email': $scope.email,
				'activationCode':$scope.activationCode
            }
        }).success(function (data) {
        	$rootScope.msg = data.data;
        	var message = data.message;
        	if (message === "S") {
				$scope.activationCode = "";
        		$rootScope.showSuccess = false;
        		$rootScope.showError = false;
				$rootScope.show_forget = false;
				$rootScope.show_change = true;
        	} else if (message === "F") {
        		$rootScope.showSuccess = false;
        		$rootScope.showError = true;
        	}
        }).error(function (data) {
            console.info(data);
        });
    }

    $rootScope.forget = function() {
        $http({
            method: 'POST',
            url: '/login/forget',
            params: {
                'email': $scope.email
            }
        }).success(function (data) {
        	$rootScope.msg = data.data;
        	var code = data.code;
        	if (code === "S") {
        		$rootScope.showSuccess = true;
        		$rootScope.showError = false;
        		$timeout(function () {
					window.location.href = 'http://' + window.location.host;
				}, 3000);
        	} else if (code === "E") {
        		$rootScope.showSuccess = false;
        		$rootScope.showError = true;
        	}
        }).error(function (data) {
            console.info(data);
        });
    }

	$rootScope.index = function(){
		window.location.href = 'http://' + window.location.host;
	}

	$rootScope.changeImg = function(id) {  
        var imgSrc = $(id);  
        var src = imgSrc.attr("src");  
        imgSrc.attr("src", $rootScope.changeUrl(src));  
	}  
	
    //为了使每次生成图片不一致，即不让浏览器读缓存，加上时间戳  
    $rootScope.changeUrl = function(url) {  
        var timestamp = (new Date()).valueOf();  
        var index = url.indexOf("?",url);  
        if (index > 0) {  
            url = url.substring(index, url.indexOf(url, "?"));  
        }  
        if ((url.indexOf("&") >= 0)) {  
            url = url + "×tamp=" + timestamp;  
        } else {  
            url = url + "?timestamp=" + timestamp;  
        }  
        return url;  
    } 
	
	function checkPassword() {

		if ($scope.newPassword1 !== $scope.newPassword2) {
			$rootScope.msg = "Different password";
			return false;
		}

		if (!$scope.newPassword1 || !$scope.newPassword2) {
			$rootScope.msg = "Please enter password";
			return false;
		}

		if (!$scope.newPassword1 || $scope.newPassword1.length < 6) {
			$rootScope.msg = "Password length should be greater than 6";
			return false;
		}

		if (!$scope.newPassword1.match(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/)) {
			$rootScope.msg = "Password needs to contain upper and lower case letters and numbers!";
			return false;
		}

		return true;
	}

	$scope.$watch('newPassword1', function () {
		if (!$scope.newPassword1 && !$scope.newPassword2) {
			$rootScope.showError = false;
			return;
		}
		if (!checkPassword())
			$rootScope.showError = true;
		else
			$rootScope.showError = false;
	});

	$scope.$watch('newPassword2', function () {
		if (!$scope.newPassword1 && !$scope.newPassword2) {
			$rootScope.showError = false;
			return;
		}
		if (!checkPassword())
			$rootScope.showError = true;
		else
			$rootScope.showError = false;
	});

	$rootScope.toggleLogin = function() {
		$rootScope.changeImg("#imgCaptcha_login");
		$scope.userName = "";
		$scope.password = "";
		$scope.oldPassword = "";
		$scope.newPassword1 = "";
		$scope.newPassword2 = "";
		$rootScope.captcha_login = "";
		$rootScope.activationCode = "";
		$rootScope.email = "";
		$rootScope.show_login = true;
		$rootScope.show_register = false;
		$rootScope.show_forget = false;
		$rootScope.show_change = false;
		$rootScope.showError = false;
		$rootScope.showSuccess = false;
	}
	
	$rootScope.toggleForget = function() {
		$rootScope.show_login = false;
		$rootScope.show_register = false;
		$rootScope.show_forget = true;
		$rootScope.show_change = false;
		$rootScope.showError = false;
		$rootScope.showSuccess = false;
	}

	$rootScope.toggleRegister = function() {
		$rootScope.changeImg("#imgCaptcha_register");
		$rootScope.captcha_register = "";
		$rootScope.show_login = false;
		$rootScope.show_register = true;
		$rootScope.show_forget = false;
		$rootScope.show_change = false;
		$rootScope.showError = false;
		$rootScope.showSuccess = false;
	}

	$rootScope.toggleChange = function() {
		$rootScope.show_login = false;
		$rootScope.show_register = false;
		$rootScope.show_forget = false;
		$rootScope.show_change = true;
		$rootScope.showError = false;
		$rootScope.showSuccess = false;
	}
});
'use strict';

/*jshint sub:true*/

function AuthService($http, $q, API_ENDPOINT) {
  var BASE_URL = API_ENDPOINT.url;
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var isAuthenticated = false;
  var authToken;


  function loadUserCredentials() {
    //maybe I can use session if checkbox is uncheck
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }

  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }

  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;

    // Set the token as header for your requests!x-access-token'
    $http.defaults.headers.common['Authorization'] = "Bearer "+authToken;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  var register = function(user){
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/signup', user).then(function(result){
        if (result.data.success) {
          resolve(result.data.msg);
        }else{
          reject(result.data.msg);
        }
      });
    });
  };

  var login = function(user) {
    return $q(function(resolve, reject) {
      $http.post(BASE_URL + '/authenticate', user).then(function(result){
        if (result.data.success) {
          storeUserCredentials(result.data.token);
          resolve(result.data.msg);
        }else{
          reject(result.data.msg);
        }
      });
    });
  };

  //@TODO login with facebook implementation
  var loginFacebook = function(user) {
    //@TODO autheticate with facebook get token on client side
    //@TODO send received token from fb, user name, email to our Server
  };

  var logout = function() {
    destroyUserCredentials();
  };

  loadUserCredentials();





  return {
    login : login,
    register: register,
    logout: logout,
    isAuthenticated: function() {return isAuthenticated;}
  };


}

module.exports = ['$http', '$q', 'API_ENDPOINT', AuthService];

/*
 * AuthService Controller handle authorization methods
 * by: Guelor Emanuel
 */
'use strict';

/*jshint sub:true*/

function AuthService($http, $q, API_ENDPOINT, localStorageService,
                     $cordovaFacebook) {

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
          console.log("this is the data " +JSON.stringify(result.data));
          storeUserCredentials(result.data.token);
          localStorageService.set(LOCAL_TOKEN_KEY, result.data);
          resolve(result.data.msg);
        }else{
          reject(result.data.msg);
        }
      });
    });
  };


  //@TODO login with facebook: Need to change the login strategy on the server to incorporate facebook access
  var loginFacebook = function() {
    //@TODO autheticate with facebook get token on client side
    $cordovaFacebook.login(["public_profile", "email"]).then(function(success){
      console.log(success);

      //Need to convert expiresIn format from FB to date
      var expiration_date = new Date();
      expiration_date.setSeconds(expiration_date.getSeconds() + success.authResponse.expiresIn);
      expiration_date = expiration_date.toISOString();

      var facebookAuthData = {
        "id": success.authResponse.userID,
        "access_token": success.authResponse.accessToken,
        "expiration_date": expiration_date
      };
    }, function(error){
      console.log("User cancelled the Facebook login or did not fully authorize.");
    });
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
    loginFacebook: loginFacebook,
    isAuthenticated: function() {return isAuthenticated;},
    getKey: function() {return LOCAL_TOKEN_KEY;}
  };


}

module.exports = ['$http', '$q', 'API_ENDPOINT', 'localStorageService',
                  '$cordovaFacebook', AuthService];

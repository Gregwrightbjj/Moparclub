/* global app:true */
/* exported app */

'use strict';

/**
 * @ngdoc overview
 * @name bigprojectApp
 * @description
 * # bigprojectApp
 *
 * Main module of the application.
 */
var app = angular.module('bigprojectApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'door3.css',
    'duScroll'

  ]);

  app.constant('FIREBASE_URL', 'https://brilliant-heat-7204.firebaseio.com/');
  
  app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'PostsCtrl'
      })
       .when('/posts', {
        templateUrl: 'views/posts.html',
        controller: 'PostsCtrl'
      })
       .when('/events', {
        templateUrl: 'views/events.html',
        controller: 'PostsCtrl'
      })
      .when('/posts/:postId', {
        templateUrl: 'views/showpost.html',
        controller:'PostViewCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'AuthCtrl',
        resolve: {
          user: function(Auth) {
            return Auth.resolveUser();
          }
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AuthCtrl',
        resolve: {
          user: function(Auth) {
            return Auth.resolveUser();
          }
        }
      })
      .when('/users/:userId', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

'use strict';
//Auth
app.controller('AuthCtrl', function ($scope, $location, Auth, user) {
  if (Auth.signedIn()) {
    $location.path('/posts');
  }

  $scope.login = function () {
    Auth.login($scope.user).then(function () {
      $location.path('/posts');
    }, function (error) {
      $scope.error = error.toString();
    });
  };

 $scope.register = function () {
  Auth.register($scope.user).then(function(user) {
    console.log("hello", user)
    return Auth.login($scope.user).then(function() {
      user.username = $scope.user.username;
      return Auth.createProfile(user);
    }).then(function() {
      $location.path('/');
    });
  }, 
  function(error) {
    $scope.error = error.toString();
  });
};
});

//Profile
app.controller('ProfileCtrl', function ($scope, $routeParams, Profile) {
  var uid = $routeParams.userId;

  $scope.profile = Profile.get(uid);
  Profile.getPosts(uid).then(function(posts) {
    $scope.posts = posts;
  });
});

//Post View
app.controller('PostViewCtrl', function ($scope, $routeParams, Post, Auth) {
  $scope.post = Post.get($routeParams.postId);
  $scope.comments = Post.comments($routeParams.postId);

  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  

  $scope.addComment = function () {
    if(!$scope.commentText || $scope.commentText === '') {
      return;
    }

    var comment = {
      text: $scope.commentText,
      creator: $scope.user.profile.username,
      creatorUID: $scope.user.uid
    };
    $scope.comments.$add(comment);

    $scope.commentText = '';
  };

  $scope.deleteComment = function (comment) {
  $scope.comments.$remove(comment);
};

});

//Posts Control
app.controller('PostsCtrl', function ($scope, $location, Post, Auth) {
  $scope.posts = Post.all;
  $scope.user = Auth.user;
  $scope.post = {url: 'http://', 'title': ''};

  
  $scope.deletePost = function (post) {
    Post.delete(post);
  };

});

//Nav
app.controller('NavCtrl', function ($scope, $location, Post, Auth) {
    $scope.post = {url: 'http://', title: ''};
    $scope.date = new Date();
    $scope.user = Auth.user;
    $scope.signedIn = Auth.signedIn;
    $scope.logout = Auth.logout;
    
    $scope.submitPost = function () {

    
    $scope.post.creator = $scope.user.profile.username;
    $scope.post.creatorUID = $scope.user.uid;
    $scope.post.date =  new Date();
    Post.create($scope.post).then(function (hello) {
      $location.path('/posts/' + hello.name());
      $scope.post = {url: 'http://', title: ''};

    });
  };
    

});
//Angular scroll
app.controller('MyCtrl', function($scope, $document){
    $scope.toTheTop = function() {
      $document.scrollTop(0, 5000);
    }
    var section2 = angular.element(document.getElementById('section-2'));
    $scope.toSection2 = function() {
      $document.scrollTo(section2, 30, 1000);
    }
  }
);
         



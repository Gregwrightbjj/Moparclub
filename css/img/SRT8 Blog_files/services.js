'use strict';

app.factory('Post', function ($firebase, FIREBASE_URL){
  
  var ref = new Firebase(FIREBASE_URL);
  var posts = $firebase(ref.child('posts')).$asArray();

  var Post = {
    all: posts,
    create: function (post) {
      return posts.$add(post).then(function(postRef) {
        $firebase(ref.child('user_posts').child(post.creatorUID))
         .$push(postRef.name());
        return postRef;
      });
    },
    comments: function (postId) {
      return $firebase(ref.child('comments').child(postId)).$asArray();
    },
    get: function (postId) {
      return $firebase(ref.child('posts').child(postId)).$asObject();
    },
    delete: function (post) {
      return posts.$remove(post);
    }
  };

  return Post;
});

app.factory('Profile', function ($window, FIREBASE_URL, $firebase, Post, $q) {
  var ref = new $window.Firebase(FIREBASE_URL);

  var profile = {
    get: function (userId) {
      return $firebase(ref.child('profile').child(userId)).$asObject();
    },
    getPosts: function(userId) {
      var defer = $q.defer();

      $firebase(ref.child('user_posts').child(userId))
        .$asArray()
        .$loaded()
        .then(function(data) {
          var posts = {};

          for(var i = 0; i<data.length; i++) {
            var value = data[i].$value;
            posts[value] = Post.get(value);
          }
          defer.resolve(posts);
        });

      return defer.promise;
    }
  };

  return profile;
});

app.factory('Auth', function ($firebaseSimpleLogin, FIREBASE_URL, $rootScope, $firebase) {
  var ref = new Firebase(FIREBASE_URL);
  var auth = $firebaseSimpleLogin(ref);

  var Auth = {
    register: function (user) {
    return auth.$createUser(user.email, user.password);
    },
    createProfile: function (user) {
      var profile = {
      username: user.username,
      md5_hash: user.md5_hash
      };

    var profileRef = $firebase(ref.child('profile'));
    return profileRef.$set(user.uid, profile);
    },
    login: function (user) {
      return auth.$login('password', user);
    },
    logout: function () {
      auth.$logout();

    },
    resolveUser: function() {
      return auth.$getCurrentUser();
    },
    signedIn: function() {
      return !!Auth.user.provider;
    },
    user: {}
  };

  $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {
    console.log('logged in');
    angular.copy(user, Auth.user);
    Auth.user.profile = $firebase(ref.child('profile').child(Auth.user.uid)).$asObject();

    console.log(Auth.user)
  });
  
  $rootScope.$on('$firebaseSimpleLogin:logout', function() {
    console.log('logged out');

    if(Auth.user && Auth.user.profile) {
    Auth.user.profile.$destroy();
  }
    angular.copy({}, Auth.user);
  });

  return Auth;
});



angular.module("commentsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    comments: function(Comments) {
                        return Comments.getComments();
                    }
                }
            })
            .when("/new/comment", {
                controller: "NewCommentController",
                templateUrl: "comment-form.html"
            })
            .when("/comment/:commentId", {
                controller: "EditCommentController",
                templateUrl: "comment.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Comments", function($http) {
        this.getComments = function() {
            return $http.get("/comments").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("GET error.");
                });
        }
        this.createComment = function(comment) {
            return $http.post("/comments", comment).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("POST error.");
                });
        }
        this.getComment = function(commentId) {
            var url = "/comments/" + commentId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("GET/{id} error.");
                });
        }
        this.editComment = function(comment) {
            var url = "/comments/" + comment._id;
            console.log(comment._id);
            return $http.put(url, comment).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("POST/{id} error.");
                    console.log(response);
                });
        }
    })
    .controller("ListController", function(comments, $scope) {
        $scope.comments = comments.data;
    })
    .controller("NewCommentController", function($scope, $location, Comments) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveComment = function(comment) {
            Comments.createComment(comment).then(function(doc) {
                var commentUrl = "/comment/" + doc.data._id;
                $location.path(commentUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
    .controller("EditCommentController", function($scope, $routeParams, Comments) {
        Comments.getComment($routeParams.commentId).then(function(doc) {
            $scope.comment = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.commentFormUrl = "comment-form.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.commentFormUrl = "";
        }

        $scope.saveComment = function(comment) {
            Comments.editComment(comment);
            $scope.editMode = false;
            $scope.commentFormUrl = "";
        }

    });

(function(){
    
    var app = angular.module("TeachMeWeb",['ngAnimate','ngRoute','gist','TeachMeWebFilters','Rating','ngSanitize','ngFileUpload']);
    
    
    app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/main', {
        templateUrl: 'templates/category.html',
        controller: "CategoryListController"
      }).
      when("/articles/:id",{
        templateUrl: 'templates/articles/template.html',
        controller: 'ListController'
    }).
      when("/category/:id",{
        templateUrl:"templates/category.html",
        controller: "CategoryListController"
    }).
      when("/search/",{
        templateUrl:"templates/category.html",
        controller: "CategoryListController"
    }).
      when("/createtheawesome",{
        templateUrl:"templates/cms.html",
        controller: "ContentManagmentController"
    }).
      when("/modify",{
        templateUrl:"templates/cms.html"
    }).
      otherwise({
        redirectTo: '/main'
      });
  }]);
    
    
    app.run(function($window,$location,$rootScope,articles,$http){
    /*    $rootScope.$on('$routeChangeStart',function(event, currRoute, prevRoute){
		   //$rootScope.animation = currRoute.animation;
          //  $rootScope.articleLoading = true;
            //$location.hash()
           // $anchorScroll(location);
            
       });
       */
        
        $http.get('/api/articleList')
            .success(function(data) {
                
                var tmp = data;
                 angular.forEach(tmp,function(m){
                m.img = "/imgs/articles/"+m._id+"/thumb.png";
                m.href = "#/articles/"+m._id;
                m.url = "templates/"+m.category+"/"+m._id+".html";
            
            });
            
            articles.setIt(tmp);
         
         
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        
        
       $rootScope.$on('$routeChangeStart', function() {
          
       });
        
        $rootScope.$on('$locationChangeSuccess', function() {
            $rootScope.actualLocation = $location.path();
        });        

   $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
        if($rootScope.actualLocation === newLocation) {
            //do not perform scrolltocontent
            scrollToPos(scrollPos);
        }else{
            scrollToContent();

        }
    });
        
    
    
    });
    //reduce the number of controllers, for example slides controller and categorylist controller probably does the same stuff, and searchController
   app.controller("ArticleController",function(articles,$scope,$timeout){
       
    $timeout(function(){
    var art = articles.getAll();
   
           
           $scope.list = art;
         
    },100);
   }); 
    
    
    // CMS
    app.controller("ContentManagmentController",function($scope,$http,logged,Upload){
      
      
    if(typeof localStorage.getItem('logged')!=='undefined'){
      $http.post('/api/verifyUser', {logged: localStorage.getItem('logged')})
            .success(function(data) {
                
             if(data.ok){
                 logged.setValue(true);
                    
                }
             return;
                //console.log(data);
            })
         
    }
        
    $scope.filesStatus = [];
    $scope.files = [];
        $scope.$watch('filesStatus', function () {
            if($scope.filesStatus.length == $scope.files.length && $scope.files.length!=0){
            
                $scope.article = {};
                $scope.files = [];
                $scope.filesStatus = [];
                alert("awww yis");  
            }else{
                console.log($scope.filesStatus);
                console.log($scope.files);
            }
        });

        
        
        $scope.data = { user : "", pass: ""};
        $scope.logged = logged;
      
        $scope.setArticleImg = function(el){
          $scope.articleImg = el.name;
        };

        $scope.login = function(){
         $http.post('/api/login', $scope.data)
            .success(function(data) {
                $scope.data = {}; 
                
             if(data.ok){
                    $scope.logged = data.id;
                    logged.setValue($scope.logged);
                    localStorage.setItem("logged",$scope.logged);
                }
             return;
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        }
        
        
        $scope.post = function(){
            $scope.article.sender = $scope.logged;
            $scope.article.tags = $scope.article.tags.split(",");
                        $http.post('/api/article', $scope.article)
                        .success(function(data) {


                         if(data.ok){
                            //$scope.article = {}; 
                            $scope.articleId = data._id;
                            $scope.upload($scope.files);
                        }
                        
                         return;
                            //console.log(data);
                        })
                        .error(function(data) {
                            console.log('Error: ' + data);
                        });

        
        }
        
        $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                
                var settings = {
                    url: '/upload/articleImg/'+$scope.articleId,
                    fields: {'sender':$scope.logged},
                    file: file
                };
              
                // Checks if there are files selected to be a thumb, if so search for the specific img, else use first one 
                if($scope.articleImg.length==0 && i==0 || file.name===$scope.articleImg){
                  settings.fileName = "thumb.png";
                }
              
                
                Upload.upload(settings).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    if(progressPercentage==100){
                        //$scope.filesStatus.push(evt.config.file.name);
                        
                    }
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                });
            }
        }
        };
        
    });
    
    app.controller("DateController",function($scope){
        var year = new Date().getFullYear();
        this.get = ("2015"+((year=='2015') ? "":"-"+year));
  
    });
    

    app.controller("CategoryListController",function($anchorScroll,$location,$scope,$rootScope,$routeParams,articles,limits,logged){
        $rootScope.articleBrowsing = false;
        $scope.logged = logged.value;
          var art = articles.getAll();
      /* angular.forEach(art,function(m){
            m.img = "imgs/articles/"+m._id+".jpg";
            m.href = "#/articles/"+m._id;
           if(m.category=="lessons"){
                m.url = "templates/articles/"+m.id+".html";
           }else if(m.category=="tools"){
                m.url = "templates/tools/"+m.id+".html";
           }

        });*/
           // loading more articles depends on factory lists, however category.html has static limits.main for limiting, so change it when you will want to have separate limits to different category
           $scope.articles = art;
        if(typeof $routeParams.id == 'undefined'){
            //if(filterSearch=="")
                $scope.category = "!null";
            
        }else{
            $scope.category = $routeParams.id;
        }
        
        // this shit doesnt work
        $scope.filter = $rootScope.filterSearch;
        $scope.orderBy = "-date";
        /*if($scope.category=='main'){
            $scope.orderBy = "-id";
        }
        */
        $scope.limits=limits;;
        
        
        

    });
    app.controller("ListController",function($http,$scope,$rootScope,$routeParams,articles,$sce){
        var article = articles.getById($routeParams.id);
        
        
        var html = "";
         $http.get('/api/article/'+article._id)
            .success(function(data) {
                $scope.test = $sce.trustAsHtml(data[0].html); 
                $scope.article  = article;
             
             //console.log(data[0].html);
             //console.log(article);
                //$scope.article = article;
                /*$scope.articleLoaded = function(a){
                    $rootScope.articleLoading = false;
                }
                $scope.loadingState  = function(){
                    return $rootScope.articleLoading;
                }*/
             
               // $scope.$on('$routeChangeStart', function(next, current) { 
                //    scrollToContent();
                //});
                if(article.rate==true){
                    $rootScope.articleBrowsing = "article:"+$scope.article._id;
                }else{
                   $rootScope.articleBrowsing = false;
                }

                $scope.getPreviousLesson = function(){
                 return articles.getById(article.id-1);
                }

                $scope.getNextLesson = function(){
                 return articles.getById(article.id+1);
                }

             //*/

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
         //$scope.test = $sce.trustAsHtml(html); // change it to ajax :D
     
                
        
       
    });
    
    app.controller("TabController",function($scope,articles,$timeout){
        var arts = [];
        
        // Wait for data to load properly
        $timeout(function(){
            arts = articles.getAll();
            var blog = 0,lessons=0,games=0,tools=0;
            angular.forEach(arts,function(m){
                if(m.search==true){

                    switch(m.category){
                            case "blog": blog++; break;
                            case "lessons": lessons++; break;
                            case "games": games++; break;
                            case "tools": tools++; break;

                    }
                }

            });
            $scope.blog = blog;
            $scope.lessons=lessons;
            $scope.tools = tools;
            $scope.games = games;
        },100);
        
    });
    
   
    app.factory("limits",function(){
        return {
            main: 2,
            tools: 2,
            lessons: 2,
            blog: 2,
            games: 2
        };
    });
    
     app.factory("articles", function ($http) {
         //kurde bel jak to zrobic zeby to nie robilo requestow za kazdym razem kiedy chce miec wszystkie ;-;
         var tmp = {val: null};
         
             
            /*var tmp = [
            {   
                id: 0,
                alt: "image0",
                title: "Języki stron WWW",
                desc:"Poznajemy miejsce i przeznaczenie języków wykorzystywanych do tworzenia stron internetowych",
                search: true,
                slides:true,
                rate: true,
                category: "lessons",
                tags: ["html","css","js","php"]
                
            }, 
            {   
                id: 1,
                alt: "image1",
                title: "HTML: Teoria",
                desc:"Zacznijmy przygotę z technologiami webowymi!" ,
                search: true,
                slides:true,
                rate: true,
                category: "lessons",
                tags: ["html"]
            },
            {   
                id: 2,
                alt: "undiscovered",
                title: "Nieodkryty chapter",
                desc:"Not here" ,
                search: false,
                slides:true,
                rate: true,
                category: "lessons",
                tags: []
            },
            {   
                id: "grades-calc",
                alt: "Kalkulator średniej",
                title: "Kalkulator średniej",
                desc:"Kalkulator średniej z możliwością dodawania i usuwania nowych przedmiotów" ,
                search: true,
                slides: false,
                category: "tools",
                tags: ["html","js"],
                externalUrl:"#"
            },
            {   
                id: "questions",
                alt: "Generator pytań",
                img: "imgs/questions.jpg",
                title: "Generator pytań",
                desc:"Generator pytań stworzony na potrzeby dnia dziecka organizowanego przez ZS3 w Szczecinie" ,
                search: true,
                slides: false,
                category: "tools",
                tags: ["html","js"],
                externalUrl:"#"
            },
            {   
                id: "blog1", // fuck change it
                alt: "Obrazek na powitanie",
                img: "imgs/default.jpg",
                title: "Witajcie na TeachMeWeb!",
                desc:"Kilka słów wstępu o tej stronie." ,
                search: true,
                slides: false,
                category: "blog",
                tags: [],
                externalUrl:"#"
            },
            {   
                id: "otsql",
                alt: "Parser SQL dla planów lekcji Optivum",
                title: "Parser SQL dla planów lekcji Optivum",
                desc:"Parser mySQL dla planów lekcji Optivum napisany w PHP" ,
                search: true,
                slides: false,
                category: "tools",
                tags: ["html","php"],
                externalUrl:"#"
            }
            ];
            
            */
           
       //  console.log(tmp);
            return {
                getAll: function () {
                    return tmp.val
                },
                getById: function (id) {
                    var result = null;
                    angular.forEach(tmp.val, function (m) {
                        if (m._id == id) result = m;
                    });
                    return result;
                },
                setIt: function(a){
                    tmp.val = a;
                }
            };
             
             
             
        });
    
    app.factory('logged', function() {
        var local = {value : false};

    local.setValue = function(val) {
      this.value = val;
    };

    local.getValue = function() {
        return this.value;
    };

    return local;
})
    
    angular.module('TeachMeWebFilters', []).filter('tags',                   function() {
        return function(input) {
            return "imgs/tags/"+input+".png";
        };
    });
    
    angular.module("Rating", [])
.controller("RatingCtrl", function($scope) {
  $scope.rating1 = 5;
  $scope.rating2 = 2;
  $scope.isReadonly = true;
  $scope.rateFunction = function(rating) {
    // do the magic here
      alert(rating);
  };
})
.directive("starRating", function() {
  return {
    restrict : "EA",
    template : "<ul class='rating' ng-class='{readonly: readonly}'>" +
               "  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
               "    <i class='fa fa-star'></i>" + //&#9733
               "  </li>" +
               "</ul>",
    scope : {
      ratingValue : "=ngModel",
      max : "=?", //optional: default is 5
      onRatingSelected : "&?",
      readonly: "=?"
    },
    link : function(scope, elem, attrs) {
      if (scope.max == undefined) { scope.max = 5; }
      function updateStars() {
        scope.stars = [];
        for (var i = 0; i < scope.max; i++) {
          scope.stars.push({
            filled : i < scope.ratingValue
          });
        }
      };
      scope.toggle = function(index) {
        if (scope.readonly == undefined || scope.readonly == false){
          scope.ratingValue = index + 1;
          scope.onRatingSelected({
            rating: index + 1
          });
        }
      };
      scope.$watch("ratingValue", function(oldVal, newVal) {
        if (newVal) { updateStars(); }
      });
    }
  };
});
    
    
    
app.directive("stars", function() { 
    return {
        restrict: "E", 
        templateUrl: "templates/directives/stars.html",
        replace: true,
        controller: [ "$scope", function ($scope) {
    }]
}
});

app.directive("social", function() { 
    return {
        restrict: "E", 
        templateUrl: "templates/directives/social.html",
        replace: true,
        controller: [ "$scope", function ($scope) {
    }]
}
}); 
    
    
app.directive("card", function() { 
    return {
        restrict: "E", 
        templateUrl: "templates/directives/card.html",
        replace: true,
        controller: [ "$scope", function ($scope) {
        }]
    }
}); 
    
app.directive("search", function() { 
    return {
        restrict: "E", 
        templateUrl: "templates/directives/search.html",
        replace: true,
        controller: "ArticleController"
    }
}); 
    
app.directive("gallery3d", function() { 
    return {
        restrict: "E", 
        templateUrl: "templates/directives/3d-gallery.html",
        replace: true,
        controller: "ArticleController"
    }
}); 
    
   /* app.animation('.anim', [function() {
  return {
    // make note that other events (like addClass/removeClass)
    // have different function input parameters
    enter: function(element, doneFn) {
      jQuery(element).delay(1000).fadeIn(1000, doneFn);

      // remember to call doneFn so that angular
      // knows that the animation has concluded
    },
    enter: function

    leave: function(element, doneFn) {
      jQuery(element).fadeOut(1000, doneFn);
    }
  }
}]);
*/
})();
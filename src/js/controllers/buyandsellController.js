'use strict';

angular.module('copayApp.controllers').controller('buyandsellController', function($scope, $ionicHistory, buyAndSellService, externalLinkService, lodash) {

  $scope.openExternalLink = function(url) {
    externalLinkService.open(url);
  };

});

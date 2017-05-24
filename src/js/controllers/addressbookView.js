'use strict';

angular.module('copayApp.controllers').controller('addressbookViewController', function($scope, $state, $timeout, $stateParams, lodash, addressbookService, popupService, $ionicHistory, platformInfo) {
  $scope.isChromeApp = platformInfo.isChromeApp;

  $scope.$on("$ionicView.beforeEnter", function(event, data) {
    addressbookService.get($stateParams.address, function(err, ab) {
        if (ab) {
          $scope.addressbookEntry = ab;
        }
    });
  });

  $scope.remove = function() {
    $timeout(function() {
      addressbookService.remove($stateParams.address, function(err, ab) {
        if (err) {
          popupService.showAlert(gettextCatalog.getString('Error'), err);
          return;
        }
        $ionicHistory.goBack();
      });
    }, 100);
  };

  $scope.sendTo = function() {
    $ionicHistory.removeBackView();
    $state.go('tabs.send');
    $timeout(function() {
      $state.transitionTo('tabs.send.amount', {
        toAddress: $scope.addressbookEntry.address,
        toName: $scope.addressbookEntry.name,
        toEmail: $scope.addressbookEntry.email
      });
    }, 100);
  };

  $scope.remove = function(addr) {
    addressbookService.remove(addr, function(err, ab) {
      if (err) {
        popupService.showAlert(gettextCatalog.getString('Error'), err);
        return;
      }
      $ionicHistory.goBack();
    });
  };

});

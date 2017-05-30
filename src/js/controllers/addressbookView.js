'use strict';

angular.module('copayApp.controllers').controller('addressbookViewController', function($scope, $state, $timeout, $stateParams, lodash, addressbookService, popupService, $ionicHistory, platformInfo, gettextCatalog) {
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
    var title = gettextCatalog.getString('Warning!');
    var message = gettextCatalog.getString('Are you sure you want to delete this contact?');
    popupService.showConfirm(title, message, null, null, function(res) {
      if (!res) return;
      addressbookService.remove(addr, function(err, ab) {
        if (err) {
          popupService.showAlert(gettextCatalog.getString('Error'), err);
          return;
        }
        $ionicHistory.goBack();
      });
    }); 
  };

});

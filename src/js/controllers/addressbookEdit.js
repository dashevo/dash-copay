'use strict';

angular.module('copayApp.controllers').controller('addressbookEditController', function($scope, $state, $stateParams, $timeout, $ionicHistory, gettextCatalog, addressbookService, popupService) {

  $scope.fromSendTab = $stateParams.fromSendTab;

  $scope.addressbookEntry = {
    'address': '',
    'name': '',
    'email': ''
  };

  if ($stateParams.address) {
    addressbookService.get($stateParams.address, function(err, ab) {
      if (ab) {
        $scope.addressbookEntry = ab;
      }
    });
  } else {
    $scope.isNew = true;
  }

  $scope.onQrCodeScannedAddressBook = function(data, addressbookForm) {
    $timeout(function() {
      var form = addressbookForm;
      if (data && form) {
        data = data.replace(/^dash?:/, '');
        form.address.$setViewValue(data);
        form.address.$isValid = true;
        form.address.$render();
      }
      $scope.$digest();
    }, 100);
  };

  $scope.save = function(addressbook) {
    $timeout(function() {
      addressbookService.save(addressbook, function(err, ab) {
        if (err) {
          popupService.showAlert(gettextCatalog.getString('Error'), err);
          return;
        }
        if ($scope.fromSendTab) $scope.goHome();
        else $ionicHistory.goBack();
      });
    }, 100);
  };

  $scope.goHome = function() {
    $ionicHistory.removeBackView();
    $state.go('tabs.home');
  };

});

'use strict';

angular.module('copayApp.controllers').controller('backupRequestController', function($scope, $state, $stateParams, $ionicConfig, popupService, gettextCatalog) {

  $scope.walletId = $stateParams.walletId;

  $scope.$on("$ionicView.enter", function() {
    $ionicConfig.views.swipeBackEnabled(false);
  });

  $scope.$on("$ionicView.beforeLeave", function() {
    $ionicConfig.views.swipeBackEnabled(true);
  });

  $scope.openPopup = function() {

    var title = gettextCatalog.getString('Watch out!');
    var message = gettextCatalog.getString('If this device is replaced or this app is deleted, your funds cannot be recovered by you, The Dash Project, or anyone... without a backup.');
    var okText = gettextCatalog.getString('I understand');
    var cancelText = gettextCatalog.getString('Go back');
    popupService.showConfirm(title, message, okText, cancelText, function(val) {
      if (val) {
        var title = gettextCatalog.getString('Are you sure you want to skip it?');
        var message = gettextCatalog.getString('You can create a backup later from your wallet settings.');
        var okText = gettextCatalog.getString('Yes, skip');
        var cancelText = gettextCatalog.getString('Go back');
        popupService.showConfirm(title, message, okText, cancelText, function(val) {
          var title = gettextCatalog.getString('Seriously?!');
          var message = gettextCatalog.getString('Please backup your wallet. If you do not backup your wallet, there is NO WAY to recover your funds. You are taking a very serious risk with your funds! By Clicking "Skip Backup", you are acknowledging that you have been warned of the risk and are assuming full responsibility for the potential loss of your funds.');
          var okText = gettextCatalog.getString('Skip Backup');
          var cancelText = gettextCatalog.getString('Go back');
          popupService.showConfirm(title, message, okText, cancelText, function(val) {
            if (val) {
              $state.go('onboarding.disclaimer', {
                walletId: $scope.walletId,
                backedUp: false
              });
            }
          });
        });
      }
    });
  }

});

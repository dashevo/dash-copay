'use strict';

angular.module('copayApp.controllers').controller('welcomeController', function($scope, $state, $timeout, $ionicConfig, $log, profileService, startupService, storageService, popupService, gettextCatalog) {

  $scope.$on("$ionicView.afterEnter", function() {
    startupService.ready();
  });

  $scope.$on("$ionicView.enter", function() {
    $ionicConfig.views.swipeBackEnabled(false);
  });

  $scope.$on("$ionicView.beforeLeave", function() {
    $ionicConfig.views.swipeBackEnabled(true);
  });

  $scope.openPopup = function() {
          popupService.showAlert('Important Notice: For testing purposes Dash Copay is currently on the Dash testnet. No real money (Dash funds) is in use right now.', function() {
              $state.go('onboarding.tour')
          });
    }

  $scope.createProfile = function() {
    $log.debug('Creating profile');
    profileService.createProfile(function(err) {
      if (err) $log.warn(err);
    });
  };

});

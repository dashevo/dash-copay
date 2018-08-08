'use strict';

angular.module('copayApp.controllers').controller('backupWarningController', function($scope, $state, $timeout, $stateParams, $ionicModal) {

  $scope.walletId = $stateParams.walletId;

  if ($state.current.name.indexOf('screenshotWarning') > 0) {
    $scope.fromState = $stateParams.from == 'onboarding' ? $stateParams.from + '.backupWarning' : $stateParams.from;
    $scope.toState = $stateParams.from + '.backup'
  } else {
    $scope.fromState = $stateParams.from == 'onboarding' ? $stateParams.from + '.backupRequest' : $stateParams.from;
    $scope.toState = $stateParams.from + '.screenshotWarning'
  }

  $scope.openPopup = function() {
    $ionicModal.fromTemplateUrl('views/includes/screenshotWarningModal.html', {
      scope: $scope,
      backdropClickToClose: true,
      hardwareBackButtonClose: true
    }).then(function(modal) {
      $scope.warningModal = modal;
      $scope.warningModal.show();
    });

    $scope.close = function() {
      $scope.warningModal.remove();
      $timeout(function() {
        $state.go($scope.toState, {
          walletId: $scope.walletId,
          from: $stateParams.from
        });
      }, 200);
    };
  }

  $scope.nextStep = function() {
    $state.go($scope.toState, {
      walletId: $scope.walletId,
      from: $stateParams.from
    });
  }

  $scope.goBack = function() {
    $timeout(function() {
      $state.go($scope.fromState, {
        walletId: $scope.walletId,
        from: $stateParams.from
      });
    }, 200);
  };
});

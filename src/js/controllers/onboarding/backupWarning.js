'use strict';

angular.module('copayApp.controllers').controller('backupWarningController', function($scope, $state, $stateParams) {

  $scope.walletId = $stateParams.walletId;

  if ($state.current.name.indexOf('screenshotWarning') > 0) {
    $scope.toState = $stateParams.from + '.backup'
  } else {
    $scope.toState = $stateParams.from + '.screenshotWarning'
  }

  $scope.nextStep = function() {
    $state.go($scope.toState, {
      walletId: $scope.walletId,
      from: $stateParams.from
    });
  }
});

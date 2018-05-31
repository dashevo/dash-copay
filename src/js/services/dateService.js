angular
.module('copayApp.services')
.service('dateService', function($q, $http, $log) {
  var self = this
  var DATE_ENDPOINT = 'https://bws.dashevo.org/bws/api/v1/status'

  self.getTimestamp = function() {
    return $q(function(resolve, reject) {
      $http.get(DATE_ENDPOINT).then(function(res) {
        if (res.data.timestamp) {
          resolve(res.data.timestamp)
        } else {
          var err = 'No timestamp data received'
          $log.error(err);
          reject(err)
        }
      }, function(err) {
        $log.error(err);
        reject(err)
      })
    })
  }
})

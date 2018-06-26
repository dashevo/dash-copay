'use strict';

//var util = require('util');
//var _ = require('lodash');
//var log = require('../util/log');
//var preconditions = require('preconditions').singleton();
//var request = require('request');

/*
  This class lets interfaces with BitPay's exchange rate API.
*/

var RateService = function(opts) {
  var self = this;

  opts = opts || {};
  self.httprequest = opts.httprequest; // || request;
  self.lodash = opts.lodash;

  self.SAT_TO_BTC = 1 / 1e8;
  self.BTC_TO_SAT = 1e8;
  self.UNAVAILABLE_ERROR = 'Service is not available - check for service.isAvailable() or use service.whenAvailable()';
  self.UNSUPPORTED_CURRENCY_ERROR = 'Currency not supported';

  self._isAvailable = false;
  self._rates = {};
  self._alternatives = [];
  self._ratesBCH = {};
  self._queued = [];

  self.updateRates();
};


var _instance;
RateService.singleton = function(opts) {
  if (!_instance) {
    _instance = new RateService(opts);
  }
  return _instance;
};

RateService.prototype.updateRates = function() {
  var self = this;

  var rateServiceUrl = 'https://rates.blackcarrot.be/rate/DASH_USD.json';
  var bchRateServiceUrl = 'https://bitpay.com/api/rates/bch';

  var retrieve = function() {
    var getRates = function(dashBtcPrice) {
      self
        .httprequest
        .get('https://bitpay.com/api/rates')
        .success(function (res) {
          var addRate = function(code, name, rate) {
            self._rates[code] = rate
            self._alternatives.push({
              name: name,
              isoCode: code,
              rate: rate
            })
          }
          for (var i = 0; i < res.length; i++) {
            var currency = res[i]
            if (['BTC', 'BCH'].indexOf(currency.code) == -1) {
              addRate(currency.code, currency.name, dashBtcPrice * currency.rate)
            }
          }
          self._isAvailable = true;
        })
        .error(function(err) {
          setTimeout(function() {
            getRates(dashBtcPrice)
          }, 1000)
        })
    }

    var getDashRate = function() {
      self
        .httprequest
        .get('https://api.coinmarketcap.com/v1/ticker/dash/?convert=USD')
        .success(function (res) {
          getRates(res[0].price_btc)
        })
        .error(function(err) {
          setTimeout(function() {
            getDashRate()
          }, 1000)
        })
    }

    getDashRate()
  };

  retrieve();
};

RateService.prototype.getRate = function(code, chain) {
  return this._rates[code];
};

RateService.prototype.getAlternatives = function() {
  return this._alternatives;
};

RateService.prototype.isAvailable = function() {
  return this._isAvailable;
};

RateService.prototype.whenAvailable = function(callback) {
  if (this.isAvailable()) {
    setTimeout(callback, 10);
  } else {
    this._queued.push(callback);
  }
};

RateService.prototype.toFiat = function(satoshis, code, chain) {
  if (!this.isAvailable()) {
    return null;
  }

  return satoshis * this.SAT_TO_BTC * this.getRate(code, chain);
};

RateService.prototype.fromFiat = function(amount, code, chain) {
  if (!this.isAvailable()) {
    return null;
  }
  return amount / this.getRate(code, chain) * this.BTC_TO_SAT;
};

RateService.prototype.listAlternatives = function(sort) {
  var self = this;
  if (!this.isAvailable()) {
    return [];
  }

  var alternatives = self.lodash.map(this.getAlternatives(), function(item) {
    return {
      name: item.name,
      isoCode: item.isoCode
    }
  });
  if (sort) {
    alternatives.sort(function(a, b) {
      return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    });
  }
  return self.lodash.uniq(alternatives, 'isoCode');
};

angular.module('copayApp.services').factory('rateService', function($http, lodash) {
  // var cfg = _.extend(config.rates, {
  //   httprequest: $http
  // });

  var cfg = {
    httprequest: $http,
    lodash: lodash
  };
  return RateService.singleton(cfg);
});

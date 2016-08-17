'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _xmlStream = require('xml-stream');

var _xmlStream2 = _interopRequireDefault(_xmlStream);

var _gracefulFs = require('graceful-fs');

var _gracefulFs2 = _interopRequireDefault(_gracefulFs);

var _sanitizeHtml = require('sanitize-html');

var _sanitizeHtml2 = _interopRequireDefault(_sanitizeHtml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parser = function () {
  /**
   * @param  {String}
   * @param  {String}
   * @param  {Object}
   * @return {boolean}
   */
  function Parser(input, output, config) {
    _classCallCheck(this, Parser);

    if (!input || !output) {
      var err = 'Input and output required';
      throw err;
    }

    this.input = input;
    this.output = output;
    this.config = {
      threshold: config.threshold ? config.threshold : 5,
      type: config.type ? config.type : 0
    };
  }

  _createClass(Parser, [{
    key: '_filter',
    value: function _filter(item) {
      var config = this.config;
      var type2 = config.type === 2 && item.PostTypeId === '2';
      var type1 = config.type === 1 && item.PostTypeId === '1';
      var threshold = config.threshold >= parseInt(item.Score) || !config.threshold;
      // checking for config pass if threshold but no type
      if (!config || threshold && config.type === 0) {
        return true;
      }
      // check type
      if (type1 && threshold) {
        return true;
      } else if (type2 && threshold) {
        return true;
      } else {
        return false;
      }
      return false;
    }
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      var rs = _gracefulFs2.default.createReadStream(this.input);
      var ws = _gracefulFs2.default.createWriteStream(this.output);
      var xml = new _xmlStream2.default(rs);
      var sanitized = '';
      xml.on('endElement: row', function (row) {
        var post = row.$;
        //console.log(post.Body)
        if (_this._filter(post)) {
          var sanitized = (0, _sanitizeHtml2.default)(post.Body, { allowedTags: [] }).trim();
          ws.write(sanitized);
        }
      });
      return true;
    }
  }]);

  return Parser;
}();

exports.default = Parser;
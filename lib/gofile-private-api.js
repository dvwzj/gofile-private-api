"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _axios = _interopRequireDefault(require("axios"));

var _axiosCookiejarSupport = _interopRequireDefault(require("axios-cookiejar-support"));

var _toughCookie = _interopRequireDefault(require("tough-cookie"));

var _userAgents = _interopRequireDefault(require("user-agents"));

var _fileUploadEmitter = _interopRequireDefault(require("./file-upload-emitter"));

var _lodash = _interopRequireDefault(require("lodash"));

var _formData = _interopRequireDefault(require("form-data"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var GofilePrivateAPI = /*#__PURE__*/function () {
  function GofilePrivateAPI(apiServer) {
    (0, _classCallCheck2["default"])(this, GofilePrivateAPI);
    Object.defineProperty(this, 'apiServer', {
      enumerable: false,
      writable: true,
      value: apiServer === undefined ? 'apiv2' : apiServer
    });
    Object.defineProperty(this, 'auth', {
      enumerable: false,
      writable: true
    });
    Object.defineProperty(this, 'axios', {
      enumerable: false,
      writable: true,
      value: _axios["default"].create({
        withCredentials: true,
        headers: {
          'user-agent': new _userAgents["default"]().toString()
        }
      })
    });
    Object.defineProperty(this, 'fileUploadEmitter', {
      enumerable: false,
      writable: true,
      value: new _fileUploadEmitter["default"]()
    });
    Object.defineProperty(this, 'cache', {
      enumerable: false,
      writable: true,
      value: {}
    });
    (0, _axiosCookiejarSupport["default"])(this.axios);
    this.axios.defaults.jar = new _toughCookie["default"].CookieJar();
  }

  (0, _createClass2["default"])(GofilePrivateAPI, [{
    key: "token",
    value: function () {
      var _token2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_token) {
        var _this = this;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", new Promise(function (resolve, reject) {
                  try {
                    if (_token === undefined || _lodash["default"].isEmpty(_token)) {
                      throw new Error('TOKEN is required');
                    }

                    _this.axios.get("https://".concat(_this.apiServer, ".gofile.io/verifToken?token=").concat(_token)).then(function (res) {
                      if (res.data.status === 'ok') {
                        _this.axios.get("https://".concat(_this.apiServer, ".gofile.io/getAccountInfo?token=").concat(_token)).then(function (res2) {
                          if (res2.data.status === 'ok') {
                            _this.auth = _lodash["default"].merge({}, res.data.data, res2.data.data);
                            resolve(_this);
                          } else {
                            reject('getAccountInfo: ' + res2.data.status);
                          }
                        })["catch"](reject);
                      } else {
                        reject('verifToken: ' + res.data.status);
                      }
                    })["catch"](reject);
                  } catch (e) {
                    reject(e);
                  }
                }));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function token(_x) {
        return _token2.apply(this, arguments);
      }

      return token;
    }()
  }, {
    key: "uploadsList",
    value: function () {
      var _uploadsList = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        var _this2 = this;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", new Promise( /*#__PURE__*/function () {
                  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(resolve, reject) {
                    return _regenerator["default"].wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            try {
                              _this2.axios.get("https://".concat(_this2.apiServer, ".gofile.io/getUploadsList?token=").concat(_this2.auth.token)).then(function (res) {
                                if (res.data.status === 'ok') {
                                  resolve(res.data.data);
                                } else {
                                  reject('getUploadsList: ' + res.data.status);
                                }
                              })["catch"](reject);
                            } catch (e) {
                              reject(e);
                            }

                          case 1:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x2, _x3) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function uploadsList() {
        return _uploadsList.apply(this, arguments);
      }

      return uploadsList;
    }()
  }, {
    key: "exists",
    value: function () {
      var _exists = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(files) {
        var _this3 = this;

        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", new Promise( /*#__PURE__*/function () {
                  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(resolve, reject) {
                    var uploads, _exists2;

                    return _regenerator["default"].wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            _context7.prev = 0;
                            _context7.next = 3;
                            return _this3.uploadsList();

                          case 3:
                            uploads = _context7.sent;
                            _context7.next = 6;
                            return Promise.all(_lodash["default"].map(uploads, /*#__PURE__*/function () {
                              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(upload) {
                                var a, b;
                                return _regenerator["default"].wrap(function _callee6$(_context6) {
                                  while (1) {
                                    switch (_context6.prev = _context6.next) {
                                      case 0:
                                        a = _lodash["default"].map(upload.files, function (file) {
                                          return "".concat(file.name, "/").concat(file.size);
                                        }).sort();
                                        _context6.next = 3;
                                        return Promise.all(_lodash["default"].map(files, function (file) {
                                          return new Promise( /*#__PURE__*/function () {
                                            var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(resolve2, reject2) {
                                              var name;
                                              return _regenerator["default"].wrap(function _callee5$(_context5) {
                                                while (1) {
                                                  switch (_context5.prev = _context5.next) {
                                                    case 0:
                                                      if (_lodash["default"].isString(file)) {
                                                        if (file.match(/^https?:\/\//)) {
                                                          name = _lodash["default"].last(file.split('?')[0].split('/'));

                                                          _this3.axios.head(file).then( /*#__PURE__*/function () {
                                                            var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(res) {
                                                              return _regenerator["default"].wrap(function _callee4$(_context4) {
                                                                while (1) {
                                                                  switch (_context4.prev = _context4.next) {
                                                                    case 0:
                                                                      if (res.headers['content-length']) {
                                                                        resolve2("".concat(name, "/").concat(res.headers['content-length']));
                                                                      } else {
                                                                        _this3.axios.get(file, {
                                                                          responseType: 'stream'
                                                                        }).then(function (res2) {
                                                                          var start = (0, _momentTimezone["default"])();
                                                                          var buffer = [];
                                                                          res2.data.on('data', function (chunk) {
                                                                            buffer.push(chunk);

                                                                            var current = _lodash["default"].size(Buffer.concat(buffer));

                                                                            _this3.fileUploadEmitter.emit('progress.download', {
                                                                              current: current,
                                                                              total: total,
                                                                              percent: total === 0 ? -1 : current / total * 100,
                                                                              elapsed: (0, _momentTimezone["default"])().diff(start)
                                                                            });
                                                                          });
                                                                          res2.data.on('error', function (e) {
                                                                            reject2(e);
                                                                          });
                                                                          res2.data.on('end', function () {
                                                                            var blob = Buffer.concat(buffer);
                                                                            _this3.cache[file] = blob;
                                                                            resolve2("".concat(name, "/").concat(_lodash["default"].size(blob)));
                                                                          });
                                                                        })["catch"](reject2);
                                                                      }

                                                                    case 1:
                                                                    case "end":
                                                                      return _context4.stop();
                                                                  }
                                                                }
                                                              }, _callee4);
                                                            }));

                                                            return function (_x10) {
                                                              return _ref5.apply(this, arguments);
                                                            };
                                                          }())["catch"](reject2);
                                                        } else {
                                                          resolve2("".concat(_path["default"].basename(file), "/").concat(_fs["default"].statSync(file).size));
                                                        }
                                                      } else if (_lodash["default"].isObject(file) && file.name && file.blob) {
                                                        resolve2("".concat(file.name, "/").concat(_lodash["default"].size(file.blob)));
                                                      } else {
                                                        resolve2(false);
                                                      }

                                                    case 1:
                                                    case "end":
                                                      return _context5.stop();
                                                  }
                                                }
                                              }, _callee5);
                                            }));

                                            return function (_x8, _x9) {
                                              return _ref4.apply(this, arguments);
                                            };
                                          }());
                                        }));

                                      case 3:
                                        b = _context6.sent.sort();
                                        return _context6.abrupt("return", _lodash["default"].isEqual(a, b));

                                      case 5:
                                      case "end":
                                        return _context6.stop();
                                    }
                                  }
                                }, _callee6);
                              }));

                              return function (_x7) {
                                return _ref3.apply(this, arguments);
                              };
                            }())).then(function (results) {
                              return _lodash["default"].filter(_lodash["default"].map(results, function (found, i) {
                                if (found) {
                                  var data = uploads[i];
                                  data.files = _lodash["default"].map(data.files, function (file) {
                                    file.link = "https://".concat(data.server, ".gofile.io/download/").concat(data.code, "/").concat(file.name);
                                    return file;
                                  });
                                  return data;
                                } else {
                                  return false;
                                }
                              }));
                            })["catch"](function (e) {
                              _this3.fileUploadEmitter.emit('error', e);

                              return [];
                            });

                          case 6:
                            _exists2 = _context7.sent;

                            _this3.fileUploadEmitter.emit('exists', _exists2);

                            resolve(_exists2);
                            _context7.next = 14;
                            break;

                          case 11:
                            _context7.prev = 11;
                            _context7.t0 = _context7["catch"](0);
                            reject(_context7.t0);

                          case 14:
                          case "end":
                            return _context7.stop();
                        }
                      }
                    }, _callee7, null, [[0, 11]]);
                  }));

                  return function (_x5, _x6) {
                    return _ref2.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function exists(_x4) {
        return _exists.apply(this, arguments);
      }

      return exists;
    }()
  }, {
    key: "upload",
    value: function upload(files, force) {
      var _this4 = this;

      try {
        if (files === undefined || _lodash["default"].isEmpty(_lodash["default"].filter(files))) {
          this.fileUploadEmitter.emit('error', new Error('Cannot upload EMPTY Files'));
        } else {
          if (!_lodash["default"].isArray(files)) files = [files];
          force = force === undefined ? false : force;
          this.fileUploadEmitter.emit('start', {
            files: files,
            force: force
          });

          if (force === true) {
            this.forceUpload(files);
          } else {
            this.exists(files).then(function (exists) {
              if (_lodash["default"].size(exists)) {
                _this4.fileUploadEmitter.emit('completed', exists[0]);
              } else {
                _this4.forceUpload(files);
              }
            })["catch"](function (e) {
              _this4.fileUploadEmitter.emit('error', e);
            });
          }
        }
      } catch (e) {
        this.fileUploadEmitter.emit('error', e);
      }

      return this.fileUploadEmitter;
    }
  }, {
    key: "forceUpload",
    value: function forceUpload(files) {
      var _this5 = this;

      try {
        this.axios.get("https://".concat(this.apiServer, ".gofile.io/getServer")).then( /*#__PURE__*/function () {
          var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(res) {
            var formData, _total, start;

            return _regenerator["default"].wrap(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    if (!(res.data.status === 'ok')) {
                      _context10.next = 13;
                      break;
                    }

                    formData = new _formData["default"]();
                    formData.append('email', _this5.auth.email);
                    _context10.next = 5;
                    return Promise.all(_lodash["default"].map(files, /*#__PURE__*/function () {
                      var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(file) {
                        var data, name;
                        return _regenerator["default"].wrap(function _callee9$(_context9) {
                          while (1) {
                            switch (_context9.prev = _context9.next) {
                              case 0:
                                if (!file.match(/^https?:\/\//)) {
                                  _context9.next = 11;
                                  break;
                                }

                                if (!_this5.cache[file]) {
                                  _context9.next = 5;
                                  break;
                                }

                                data = _this5.cache[file];
                                _context9.next = 8;
                                break;

                              case 5:
                                _context9.next = 7;
                                return _this5.axios.get(file, {
                                  responseType: 'stream'
                                }).then(function (res) {
                                  return new Promise(function (resolve, reject) {
                                    var total = res.headers['content-length'] || 0;
                                    var start = (0, _momentTimezone["default"])();
                                    var buffer = [];
                                    res.data.on('data', function (chunk) {
                                      buffer.push(chunk);

                                      var current = _lodash["default"].size(Buffer.concat(buffer));

                                      _this5.fileUploadEmitter.emit('progress.download', {
                                        current: current,
                                        total: total,
                                        percent: total === 0 ? -1 : current / total * 100,
                                        elapsed: (0, _momentTimezone["default"])().diff(start)
                                      });
                                    });
                                    res.data.on('error', function (e) {
                                      reject(e);
                                    });
                                    res.data.on('end', function () {
                                      resolve(Buffer.concat(buffer));
                                    });
                                  });
                                })["catch"](function (e) {
                                  _this5.fileUploadEmitter.emit('error', e);
                                });

                              case 7:
                                data = _context9.sent;

                              case 8:
                                name = _lodash["default"].last(file.split('?')[0].split('/'));
                                _context9.next = 13;
                                break;

                              case 11:
                                data = _fs["default"].readFileSync(file);
                                name = _path["default"].basename(file);

                              case 13:
                                formData.append('filesUploaded', data, name);

                              case 14:
                              case "end":
                                return _context9.stop();
                            }
                          }
                        }, _callee9);
                      }));

                      return function (_x12) {
                        return _ref7.apply(this, arguments);
                      };
                    }()))["catch"](function (e) {
                      _this5.fileUploadEmitter.emit('error', e);
                    });

                  case 5:
                    formData.append('category', 'file');
                    formData.append('comments', 0);
                    _total = formData.getLengthSync();
                    start = (0, _momentTimezone["default"])();

                    _this5.fileUploadEmitter.emit('progress.upload', {
                      current: 0,
                      total: _total,
                      percent: -1,
                      elapsed: (0, _momentTimezone["default"])().diff(start)
                    });

                    _this5.axios.post("https://".concat(res.data.data.server, ".gofile.io/upload"), formData, {
                      headers: formData.getHeaders(),
                      responseType: 'stream'
                    }).then(function (res2) {
                      var buffer = [];
                      res2.data.on('data', function (chunk) {
                        buffer.push(chunk);
                      });
                      res2.data.on('error', function (e) {
                        console.error(e);
                      });
                      res2.data.on('end', function () {
                        _this5.fileUploadEmitter.emit('progress.upload', {
                          current: _total,
                          total: _total,
                          percent: 100,
                          elapsed: (0, _momentTimezone["default"])().diff(start)
                        });

                        var $res2 = JSON.parse(Buffer.concat(buffer).toString('utf8'));

                        if ($res2.status === 'ok') {
                          var data = $res2.data;

                          _this5.axios.get("https://".concat(_this5.apiServer, ".gofile.io/getServer?c=").concat($res2.data.code)).then(function (res3) {
                            if (res3.data.status === 'ok') {
                              _this5.axios.get("https://".concat(res3.data.data.server, ".gofile.io/getUpload?c=").concat($res2.data.code)).then(function (res4) {
                                if (res4.data.status === 'ok') {
                                  data = _lodash["default"].merge(data, res4.data.data);
                                  data.files = _lodash["default"].map(data.files, function (file) {
                                    file.name = _lodash["default"].last(file.link.split('?')[0].split('/'));
                                    return file;
                                  });

                                  _this5.fileUploadEmitter.emit('completed', data);
                                } else {
                                  _this5.fileUploadEmitter.emit('error', 'getUpload: ' + res4.data.status);
                                }
                              })["catch"](function (e) {
                                _this5.fileUploadEmitter.emit('error', e);
                              });
                            } else {
                              _this5.fileUploadEmitter.emit('error', 'getServer: ' + res3.data.status);
                            }
                          })["catch"](function (e) {
                            _this5.fileUploadEmitter.emit('error', e);
                          });
                        } else {
                          _this5.fileUploadEmitter.emit('error', 'upload: ' + $res2.data.status);
                        }
                      });
                    })["catch"](function (e) {
                      _this5.fileUploadEmitter.emit('error', e);
                    });

                    _context10.next = 14;
                    break;

                  case 13:
                    _this5.fileUploadEmitter.emit('error', 'getServer: ' + res.data.status);

                  case 14:
                  case "end":
                    return _context10.stop();
                }
              }
            }, _callee10);
          }));

          return function (_x11) {
            return _ref6.apply(this, arguments);
          };
        }())["catch"](function (e) {
          _this5.fileUploadEmitter.emit('error', e);
        });
      } catch (e) {
        this.fileUploadEmitter.emit('error', e);
      }

      return this.fileUploadEmitter;
    }
  }]);
  return GofilePrivateAPI;
}();

var _default = GofilePrivateAPI;
exports["default"] = _default;
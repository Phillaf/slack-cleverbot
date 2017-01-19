'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = Bot;

var _slackbots = require('slackbots');

var _slackbots2 = _interopRequireDefault(_slackbots);

var _cleverbot = require('cleverbot.io');

var _cleverbot2 = _interopRequireDefault(_cleverbot);

var _lodash = require('lodash.sample');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var BAD_REPLIES = ['I don\'t care for this', 'Leave me alone', 'I am not a bot', '%name% is an average nickname', 'I am the one who knocks'];

/**
 * Slack-Cleverbot
 *
 * @example const mybot = Bot({...}).run();
 *
 * @param {objet}  params
 * @param {string} params.token
 * @param {string} params.name
 * @param {Number} params.conversationDuration
 * @param {string} params.cleverbotUser
 * @param {string} params.cleverbotKey
 *
 * @returns {Object} Bot instance
 */
function Bot(_ref) {
    var onMessage = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(message) {
            var reply, user, _ref3, channels, _reply;

            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!(!botUser || !isChatMessage(message) || isFromSelf(message))) {
                                _context.next = 2;
                                break;
                            }

                            return _context.abrupt('return');

                        case 2:
                            reply = void 0;
                            _context.next = 5;
                            return slackbot.getUserById(message.user);

                        case 5:
                            user = _context.sent;
                            _context.next = 8;
                            return slackbot.getChannels();

                        case 8:
                            _ref3 = _context.sent;
                            channels = _ref3.channels;

                            if (!isFromChannel(message, channels)) {
                                _context.next = 19;
                                break;
                            }

                            if (!(isAddressedToMe(message) || inActiveConversation())) {
                                _context.next = 17;
                                break;
                            }

                            _context.next = 14;
                            return getReply(message.text);

                        case 14:
                            _reply = _context.sent;

                            postReply(user, message, _reply);
                            lastActivity = new Date();

                        case 17:
                            _context.next = 20;
                            break;

                        case 19:
                            postReply(user, message, getRandomReply(user.name));

                        case 20:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        return function onMessage(_x) {
            return _ref2.apply(this, arguments);
        };
    }();

    var token = _ref.token,
        name = _ref.name,
        conversationDuration = _ref.conversationDuration,
        cleverbotUser = _ref.cleverbotUser,
        cleverbotKey = _ref.cleverbotKey;

    var botUser = void 0;
    var slackbot = void 0;
    var cleverbot = void 0;
    var lastActivity = void 0;

    function getReply(text) {
        console.log('Fetching reply...');

        return new Promise(function (resolve, reject) {
            cleverbot.ask(text, function (err, response) {
                if (err) return reject(err);
                resolve(response);
            });
        });
    }

    function postReply(user, message, reply) {
        console.log(user.name + ' > ' + message.text);
        console.log(botUser.name + ' > ' + reply);

        slackbot.postMessage(message.channel, reply, { as_user: true });
    }

    function getRandomReply(name) {
        return (0, _lodash2.default)(BAD_REPLIES).replace('%name%', name);
    }

    function isChatMessage(message) {
        return message.type === 'message' && Boolean(message.text);
    }

    function isFromSelf(message) {
        return message.user === botUser.id;
    }

    function isAddressedToMe(message) {
        return message.text.toLowerCase().includes(name);
    }

    function inActiveConversation() {
        var wasActive = (typeof lastActivity === 'undefined' ? 'undefined' : _typeof(lastActivity)) !== undefined;
        var isRecent = new Date() - lastActivity < conversationDuration;

        return wasActive && isRecent;
    }

    function isFromChannel(message, channels) {
        return channels.some(function (channel) {
            return channel.id === message.channel;
        });
    }

    /**
     * Start bot
     */
    function run() {
        var _this = this;

        console.log('Starting Bot...');

        cleverbot = new _cleverbot2.default(cleverbotUser, cleverbotKey);
        cleverbot.setNick(name);
        cleverbot.create(function (err, session) {}); // TODO: Do we care about the result?

        slackbot = new _slackbots2.default({ token: token, name: name });

        slackbot.on('start', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return slackbot.getUser(name);

                        case 2:
                            botUser = _context2.sent;

                        case 3:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this);
        })));

        slackbot.on('message', onMessage);

        slackbot.on('error', function (err) {
            console.log('Slackbot error:', err.message);
        });
    }

    return {
        run: run
    };
}
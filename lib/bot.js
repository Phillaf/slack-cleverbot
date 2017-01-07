'use strict';

var SlackBot = require('slackbots');
var CleverBot = require('cleverbot.io');

class Bot extends SlackBot {

    constructor(params) {
        super(params);
        this.user = null;

        this.conversationDuration = params.conversationDuration;
        this.lastActivity = new Date();

        this.cleverbot = new CleverBot(params.cleverbotUser, params.cleverbotKey);
        this.cleverbot.setNick(params.name);
        this.cleverbot.create((err, session) => {});
    }

    run() {
        this.on('start', this._onStart);
        this.on('message', this._onMessage);
    }

    _onStart() {
        this.user = this.users.find(user => user.name === this.name); 
    }

    _onMessage(message) {
        if (!this._isChatMessage(message) || !this._isChannelConversation(message) || this._isFromSelf(message)) {
            return;
        }

        if (!this._addressedToMe(message) && !this._inActiveConversation()) {
            return;
        }

        this._reply(message);
        this.lastActivity = new Date();
    }

    _reply(message) {
        var channel = this._getChannelById(message.channel);

        this.cleverbot.ask(message.text, (err, response) => {
            this.postMessageToChannel(channel.name, response, {as_user: true});
        });
    }

    _inActiveConversation() {
        var tenMinutesInMillis = 1000 * 60 * 10;
        console.log(new Date() - this.lastActivity);
        return (new Date() - this.lastActivity) < tenMinutesInMillis;
    }

    _addressedToMe(message) {
        return message.text.toLowerCase().indexOf(this.name) > -1;
    }

    _isChatMessage(message) {
        return message.type === 'message' && Boolean(message.text);
    }

    _isChannelConversation(message) {
        var isString = typeof message.channel === 'string';
        var isPublic = message.channel[0] === 'C';
        return isString && isPublic;
    };

    _isFromSelf(message) {
        return message.user === this.user.id;
    }

    _getChannelById(channelId) {
        return this.channels.filter(function (item) {
            return item.id === channelId;
        })[0];
    };
}

module.exports = Bot;

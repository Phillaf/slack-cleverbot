#!/usr/bin/env node

'use strict';

var Bot = require('../lib/bot');
var config = require('../config');

var bot = new Bot({
    token: config.slackToken,
    name: config.botName,
    cleverbotUser: config.cleverbotUser,
    cleverbotKey: config.cleverbotKey,
    conversationDuration: config.conversationDuration,
});

bot.run();

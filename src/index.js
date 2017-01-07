import SlackBot from 'slackbots';
import CleverBot from 'cleverbot.io';
import sample from 'lodash.sample';

const BAD_REPLIES = [
    'I don\'t care for this',
    'Leave me alone',
    'I am not a bot',
    '%name% is an average nickname',
    'I am the one who knocks'
];

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
export default function Bot({
    token,
    name,
    conversationDuration,
    cleverbotUser,
    cleverbotKey
}) {
    let botUser;
    let slackbot;
    let cleverbot;
    let lastActivity;

    async function onMessage(message) {
        if (!botUser || !isChatMessage(message) || isFromSelf(message)) {
            return;
        }

        let reply;
        const user = await slackbot.getUserById(message.user);
        const { channels } = await slackbot.getChannels();

        if (isFromChannel(message, channels)) {
            if ((isAddressedToMe(message) || inActiveConversation())) {
                const reply = await getReply(message.text);
                postReply(user, message, reply);
                lastActivity = new Date();
            }
        } else {
            postReply(user, message, getRandomReply(user.name));
        }
    }

    function getReply(text) {
        console.log('Fetching reply...');

        return new Promise((resolve, reject) => {
            cleverbot.ask(text, (err, response) => {
                if (err) return reject(err);
                resolve(response);
            });
        })
    }

    function postReply(user, message, reply) {
        console.log(`${user.name} > ${message.text}`);
        console.log(`${botUser.name} > ${reply}`);

        slackbot.postMessage(message.channel, reply, { as_user: true });
    }

    function getRandomReply(name) {
        return sample(BAD_REPLIES).replace('%name%', name);
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
        const wasActive = typeof lastActivity !== undefined;
        const isRecent = (new Date() - lastActivity) < conversationDuration;

        return wasActive && isRecent;
    }

    function isFromChannel(message, channels) {
        return channels.some(channel => channel.id === message.channel);
    }

    /**
     * Start bot
     */
    function run() {

        console.log('Starting Bot...');

        cleverbot = new CleverBot(cleverbotUser, cleverbotKey);
        cleverbot.setNick(name);
        cleverbot.create((err, session) => {}); // TODO: Do we care about the result?

        slackbot = new SlackBot({ token, name });

        slackbot.on('start', async () => {
            botUser = await slackbot.getUser(name);
        });

        slackbot.on('start', () => {
            slackbot.getUser(name)
                .then(user => { botUser = user; });
        });

        slackbot.on('message', onMessage);

        slackbot.on('error', (err) => {
            console.log('Slackbot error:', err.message);
        });
    }

    return {
        run
    };
}

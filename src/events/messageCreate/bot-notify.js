const {Client, Message} = require('discord.js');
const NotificationChannel = require("../../models/NotificationChannel");
const discordStringFormat = require("../../utils/formatStringForDiscord");

/**
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (client, message) => {
    //stops messages from other servers that the bot is in
    //and the bot's own messages from triggering the bot
    if (!message.inGuild() || message.author.bot) return;

    //get attributes of the current message
    const guildIDString = message.guild.id;
    const channelIDsString = message.channel.id;

    //this query is looking if the message belongs
    //to a channel that should be alerted
    const query = {
        $and: [
            {guildID: guildIDString},
            //["1231233242352", "23423412431231"] == ["23423412431231"]
            {
                channelIDArray: {$all: [channelIDsString]  }
            }
        ]
    }


    //run the query
    try {
        const notif = await NotificationChannel.findOne(query);

        //if there are results it will return an object
        //otherwise it will return undefined
        if (notif)
        {
            //if there are results
            //send a push notification and also send the message content
            let roleIDArray = notif.roleIDArray;

            const everyoneRoleID = message.guild.roles.everyone.id;

            //everyoneRoleID changes "@@everyone" into "@everyone"
            let roleIDsString = discordStringFormat("role", roleIDArray, everyoneRoleID);

            //we are using .displayName 
            //according to these docs here: https://old.discordjs.dev/#/docs/discord.js/main/class/User?scrollTo=displayName
            //The global name of this user, or their username if they don't have one
            //please note the display name is not the server nickname it is just the Global/Username which shows on your profile

            //change the server nickname of the bot to the user that has just messaged
            //so that the desktop notification shows the right username
            let botUser = message.guild.members.cache.get(client.user.id);
            let botUserNickname = botUser.nickname;
            let userDisplayName = message.author.displayName;

            //only set the username if it is dfifferent from what it is currrently
            if (botUserNickname != userDisplayName)
            {
                await botUser.setNickname(userDisplayName);
            }

            //send the message content "<@&1231242323> <@&122352352342>"
            const notifMessage = `${message.content}\n\n${roleIDsString}`;

            //to not interrupt the flow of conversation
            //delete the message afterwards in 1ms
            message.reply(notifMessage).then(sentMessage => {
                sentMessage.delete(1);
            });
        }

    }
    catch (error){
        console.log(`Error with database query in bot-notify.js: ${error}`);
        message.reply(`There was an error with the bot-notify command. Please contact the developer <@845327968674775061>`);

    }

}
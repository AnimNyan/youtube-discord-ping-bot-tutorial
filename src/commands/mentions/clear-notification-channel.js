const { ApplicationCommandOptionType, PermissionFlagsBits} = require ('discord.js');
const NotificationChannel = require("../../models/NotificationChannel");

module.exports = {
    name: 'clear-notifications-channel',
    description: 'Removes the notification roles and channels',
    // devOnly: Boolean,
    // testOnly: Boolean,
    //deleted: true,

    callback: async (client, interaction) => {
        const guildIDString = interaction.guild.id;

        //console.log (`guildIDString: ${guildIDString}`);

        let query = {
            guildID: guildIDString,
        }

        //want to delete the record for the current Discord guild ID
        try {
            //we want to check if there is an existing row
            const notif = await NotificationChannel.deleteOne( query );
            
            //after the database queries are done, show the success message
            interaction.reply(`Successfully cleared the notification channels and roles!`);
        }
        catch (error){
            console.log(error);
            interaction.reply(`There was an error with the clear-notification-channels command. Please contact the developer <@845327968674775061>`);
        }
    }
}
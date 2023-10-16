const { ApplicationCommandOptionType, PermissionFlagsBits} = require ('discord.js');
const NotificationChannel = require("../../models/NotificationChannel");
const discordStringFormat = require("../../utils/formatStringForDiscord");

module.exports = {
    name: 'add-channel-and-role',
    description: '(Keeps Existing and adds more) Adds a notification role and channel',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'notification-channel',
            description: 'The channel to set for notifications',
            required: true,
            type: ApplicationCommandOptionType.Channel
        },

        {
            name: 'notification-role',
            description: 'The role to set for notifications',
            required: true,
            type: ApplicationCommandOptionType.Role
        }
    ],
    //deleted: true,

    callback: async (client, interaction) => {
        const channel = interaction.options.get('notification-channel').value;
        const role = interaction.options.get('notification-role').value;

        //let channelType = typeof channel;
        //console.log(`channelType: ${channelType}`);
        const guildIDString = interaction.guild.id;

        //console.log (`guildIDString: ${guildIDString}`);

        let query = {
            guildID: guildIDString,
        }

        try {
            //we want to check if there is an existing row
            const notif = await NotificationChannel.findOne( query );
            
            //notif will be undefined if the findOne function returns no results
            //and there are no records for the current discord server ID
            if (notif)
            {
                //there is an existing record in the database for this guild/server id
                //we want to update the existing record
                
                await NotificationChannel.updateOne(
                    {guildID: guildIDString}, 
                    { 
                        $addToSet: 
                        {
                            channelIDArray: channel,
                            roleIDArray: role
                        } 
                    }
                );

                console.log("Existing Row!");
            }

            //if there is no existing record for this guild ID we're going to create a new record
            else
            {
                const newNotifChannel = new NotificationChannel({
                    guildID: guildIDString,
                    channelIDArray: channel,
                    roleIDArray: role
                });

                await newNotifChannel.save();
                console.log("New Row!");
            }



            //-------------------Make database query after the update---------------
            let updatedQuery = {
                guildID: guildIDString,
            }

            const updatedDocument = await NotificationChannel.findOne(updatedQuery);

            //if any results were returned collect the results
            if (updatedDocument)
            {
                let upd_channelIDArray = updatedDocument.channelIDArray;
                let upd_roleIDArray = updatedDocument.roleIDArray;

                const everyoneRoleID = interaction.guild.roles.everyone.id;

                let upd_channelIDString = discordStringFormat("channel", upd_channelIDArray);
                //everyoneRoleID changes "@@everyone" into "@everyone"
                let upd_roleIDString = discordStringFormat("role", upd_roleIDArray, everyoneRoleID);

                //after the database queries are done, show the success message
                interaction.reply(`Updated notifications channels to:\n${upd_channelIDString}\n\nand the roles to notify to:\n${upd_roleIDString}`);
                
            }

            else
            {
                interaction.reply(`There was an error with retrieveing config from the db for the add-channel-and-role command. Please contact the developer <@845327968674775061>`);
            }
            



           
        }
        catch (error){
            console.log(error);
            interaction.reply(`There was an error with the add-channel-and-role command. Please contact the developer <@845327968674775061>`);
        }
    }
}
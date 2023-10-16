# DiscordBotBaseTemplate

## Discord
First things first, I have a discord server for questions, support and bugs find me here: https://discord.gg/JkNp3mnJ6Q

You can find me on discord with the username **@animenyan** and message my username directly as well.

## What does DiscordBotBaseTemplate do?
DiscordBotBaseTemplate is a base template made with NodeJS designed to make it easy for you to build off of to create your own discord bot with NodeJS. It comes with its own Command and Event Handler for which full credit goes to Under Ctrl.

## Credits
Thank you to Under Ctrl for the Advanced Command + Event Handler which is used for this code here: https://www.youtube.com/watch?v=JEEcbVjLyr0
The only minor modifications were to use the following line in src/utils/getApplicationCommands.js:
```
module.exports = async (client) => {
    let applicationCommands = await client.application.commands;
```

and the following line in src/events/ready/01registerCommands.js:
```
const applicationCommands = await getApplicationCommands(client);
```

This is so the discord bot works in all servers.

## Usage:
To use the bot, please use the following steps:
1. git clone this repository from the https url.

2. Go to the Discord Developer portal here: https://discord.com/developers/applications > Create a new app > invite the bot to your server.

3. Create a ".env" file following the .env example file replacing the values for your bot and server id. If you're not using a mongodb database, MONGODB_URI is optional.

4. If you're not using a mongodb database go into src/index.js and use this code instead of the code section using mongodb eventHandler(client); .

5. Please install npm and nodejs on your computer and then change directory into the folder you pulled from github and run the following command:
```
npm install
```
This will install all the npm dependencies from the package.json.

6. If you're using a server to run this, please install pm2 as per the following documentation: https://www.letscloud.io/community/how-to-use-pm2-to-setup-a-nodejs-production and then you can use this command:
```
pm2 start src/index.js
```

If you just want to run it for testing purposes feel free to use node or nodemon like so:
```
node src/index.js
nodemon src/index.js
```
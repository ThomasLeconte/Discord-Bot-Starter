# DiscordBot Starter
Little package for start a discord bot fastly and easily with TypeScript.  
**Disclaimer:** This is not the best way, just my favorite way to build a discord bot. You can propose your own ideas with a pull request 😉

## Summary
[How use it ?](#how-use-it)  
[Commands](#commands)  
[Messages](#message)  
[Message component event handling](#message-component-event-handling)  
[Context menu interaction](#context-menu-interaction)  
[Webhooks](#webhooks)  
[Log](#log)

## How use it

**Because this bot working with Typescript, you need to install Typescript and TS-Node for compilation :  
`npm install -g typescript ts-node`**

First of all, you need to create a `config.json` file on your project root.
Then, just copy this into your new file :
```json
{
  "env": "DEV",
  "environments": {
    "DEV": {
      "name": "YourBotName",
      "token": "YourBotPrivateToken",
      "prefix": "/",
      "slashCommands": false,
      "autoLog": false,
      "adminRole": "admin",
      "options": {
        "intents": [
          "GUILDS",
          "GUILD_MEMBERS",
          "GUILD_MESSAGES"
        ]
      },
      "webhooks": []
    },
    "PROD": {
      "name": "YourBotName",
      "token": "YourBotPrivateToken",
      "prefix": "/",
      "slashCommands": false,
      "autoLog": false,
      "adminRole": "admin",
      "options": {
        "intents": [
          "GUILDS",
          "GUILD_MEMBERS",
          "GUILD_MESSAGES"
        ]
      },
      "webhooks": []
    }
  }
}
```
By default, bot environment will be "DEV". You can change it to "PROD", or to your personalized environment name !
Now, have a look to all properties of an environment :  
- `name`: Your bot name
- `token`: Your bot private token
- `prefix`: Your bot prefix which be used at start of all your commands (when slash command option is not enabled on command)
- `slashCommands`: Precise if you want to use Slash Commands system on all your commands.
- `autoLog`: Define if you want automatic logs when commands are executed for see command name, player and arguments provided.
- `adminRole`: Admin role name who's needed to admin commands. User will need to have a role with this name to allow execution.
- `options`: Options that you want to add on your bot. This property is just a copy of `Discord.CLientOptions` class.
- `webhooks`: List of webhooks that you want to use in your code.

## Commands
Your commands must follow a specific pattern. The file will have to be a module exported, with differents arguments. Basically, a new command without slash command and aliases should be like that :
```ts
import { Message } from "discord.js";
import { Bot } from "../Bot";
import EmbedMessage from "../Tools/EmbedMessage";

module.exports = {
  name: '',
  description: '',
  usage: '',
  slashCommand: {
    enabled: false,
    options: []
  },
  admin: false,
  alias: [],

  async execute(client: Bot, message: Message, args: string[]){
  }
}
```

## Message
DiscordJS v13 has introduced new features like Buttons or Select Menu components. So you can add them easily in your messages, with my tool `MessageFormatter` ! It easy to use, trust me :-)
Just make a new instance of it and look at possibilites :
```ts
// Concider you're on a command file ...

const result = new MessageFormatter();
// add an Embed Message ... Pff, to easy :)
result.addEmbedMessage(EmbedMessage.showSuccess(client, `**Disable - Success**`, `The command "${args[0]}" has been enabled !`));

// add a button ? Dude, I said it was easy to use, trust me !
result.addButton("Get karmated", "💥", "DANGER", "karma_button");

// add a selectMenu ? Look at that
result.addSelectMenu("When you will download my project ?", [
  { label: "NOW IT'S FANTASTIC !", description: "You're too strong dude", value: "now" },
  { label: "NEVER YOU SUCK !", description: "Dude, go back learn HTML", value: "never" }
], "download_menu");

// All at same time ? Why not
result.addEmbedMessage(...)
  .addButton(...)
  .addSelectMenu(...)
  .setContent(...)

return result;
```

## Message component event handling
Imagine that you just added a new button with `my_custom_id` customId property :
```ts
// Concider you're on a command file ...
const result = new MessageFormatter();
result.addButton("Get karmated", "💥", "DANGER", "karma_button");

return result;
```
With the `client` property in your command function `async execute(client: Bot, message: Message, args: any[])`, you can register an event when this new button will be clicked. For example, you want to log the player who clicked on the button. With the `interaction` that you must provide on event declaration, you will be able to get his / her username ! By using `client.setNewEvent()`, you can register an event for a button click or a select menu interaction (for the moment).
Check this out :

```ts
// Concider you're on a command file ...
const result = new MessageFormatter();
result.addButton("Get karmated", "💥", "DANGER", "karma_button");

client.setNewEvent(EventType.BUTTON_EVENT, "karma_button", (interaction: Interaction) => {
  console.log(interaction.member.user.username + " has clicked on the main menu button");
});

return result;
```

## Context menu interaction
DiscordJS makes able creation of context menu items. I've developed more easily way to create it. You just have to use current client bot instance and call `addContextMenuItem()` function :
```ts
//Add context menu item
client.addContextMenuItem("test", message.guildId);
```
And obviously, you can declare an event when this menu item is used :
```ts
//Add event triggerer when context menu item is used
client.setNewEvent(EventType.CONTEXT_MENU_EVENT, "test", (interaction: Interaction) => {
  console.log(`${interaction.commandName} has been used...`);
});
```

## Webhooks
You can define all webhooks that you want to use with your bot. For do this, you just have to declare them inside `webhooks` property in environment that you're using.
```json
{
  "env": "DEV",
  "environments": {
    "DEV": {
      ...
      "webhooks": [
        { "name": "myWebHook", "url": "https://discordapp.com/api/webhooks/id/token" }
      ]
    },
    ...
  }
}
```
Then you can call your webhook with your bot client by the function `getWebhook(webhookName)`, inside one of your commands for example :
```ts
import { Message } from "discord.js";
import { Bot } from "../Bot";
import EmbedMessage from "../Tools/EmbedMessage";

module.exports = {
  name: '',
  description: '',
  usage: '',
  slashCommand: {
    enabled: false,
    options: []
  },
  admin: false,
  alias: [],

  async execute(client: Bot, message: Message, args: string[]) {
    client.getWebHook("tata").send("Hi")
    ...
  }
}
```
Errors are catched if webhook is not registered and reply with an error embed message to user, and also log error in your console.

## Log
By default, all environments have `autoLog` property on `false` value. But if you enable this property by changing it value to `true`, when a command (slash or not) will be executed, it will automatically log execution date, username, command name and command arguments.
You can log by yourself if you want, just use `client.log('YourContent')` 😉 UWhen you log something, log is prefixed by default with current date. But you can personalize prefix by using `client.log('YourContent', 'YourPrefix')`


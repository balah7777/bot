const Discord = require("discord.js"); //npm i discord.js
const client = new Discord.Client({intents: 32767}); 
const config = require("./config.json"); 

client.login(config.token); 

client.once('ready', async () => {

    console.log(" O bot "+client.user.username+" está online!")
    client.user.setStatus('online');
    client.user.setActivity('prefixo /', { type: 'PLAYING' });

})

module.exports = client;
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.config = require("./config.json");
require("./handler")(client);
const { glob } = require("glob"); //npm i glob
const { promisify } = require("util"); //npm i util

const globPromise = promisify(glob);

client.on("interactionCreate", async (interaction) => {

    if (!interaction.guild) return;
  
    if (interaction.isCommand()) {

        const cmd = client.slashCommands.get(interaction.commandName);

        if (!cmd)
            return;

        const args = [];

        for (let option of interaction.options.data) {

            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }

        cmd.run(client, interaction, args);
    }

    if (interaction.isContextMenu()) {
        await interaction.deferReply({ ephemeral: false });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
        
    }
});
client.on("guildCreate", async (guild) => {
    
    const fetchedLogs = await guild.fetchAuditLogs({
      limit: 1,
      type: 'BOT_ADD'
    })
    const addAuthorLog = fetchedLogs.entries.first();
    const { executor, target } = addAuthorLog;
    
    executor.send(`Olá ${executor.tag}, muito obrigado por me adicionar no servidor \`${guild.name} (${guild.id})\` \n Meu prefixo é \`b.\` ou slash \`/\` `)
    executor.send("Entre no meu servidor de suporte!  https://discord.gg/tde ;)")
   
})

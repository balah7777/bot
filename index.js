const Discord = require("discord.js"); 
const client = new Discord.Client({intents: 32767});
const config = require("./config.json"); 

client.login(config.token); 

client.once('ready', async () => {

    console.log("✅ - Estou online!")

})

const fs = require("fs");

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync(`./commands/`);

fs.readdirSync('./commands/').forEach(local => {
    const comandos = fs.readdirSync(`./commands/${local}`).filter(arquivo => arquivo.endsWith('.js'))

    for(let file of comandos) {
        let puxar= require(`./commands/${local}/${file}`)
        if(puxar.name) {
            client.commands.set(puxar.name, puxar)
        } 
        if(puxar.aliases && Array.isArray(puxar.aliases))
        puxar.aliases.forEach(x => client.aliases.set(x, puxar.name))
    } 
});

client.on("messageCreate", async (message) => {

    let prefix = config.prefix;
  
      if (message.author.bot) return;
      if (message.channel.type == 'dm') return;     
  
       if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;
    
      if(message.author.bot) return;
      if(message.channel.type === 'dm') return;
  
      if(!message.content.startsWith(prefix)) return;
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
  
      let cmd = args.shift().toLowerCase()
      if(cmd.length === 0) return;
      let command = client.commands.get(cmd)
      if(!command) command = client.commands.get(client.aliases.get(cmd)) 
    
  try {
      command.run(client, message, args)
  } catch (err) { 
 
     console.error('Erro:' + err); 
  }
      });

      const db = require("quick.db");

client.on('messageCreate', async (message) => {

    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;

    let verificando = db.get(`antilink_${message.guild.id}`);
    if (!verificando || verificando === "off" || verificando === null || verificando === false) return;

    if (verificando === "on") {

        if (message.member.permissions.has("MANAGE_GUILD")) return;
        if (message.member.permissions.has("ADMINISTRATOR")) return;

        if (message.content.includes("https".toLowerCase() || "http".toLowerCase() || "www".toLowerCase() || ".com".toLowerCase() || ".br".toLowerCase())) {

        message.delete();
        message.channel.send(`${message.author} Você não pode enviar links aqui!`)

        }


    }

})

//Mudança de status
client.on("ready", () => {
    let activities = [
        `Criado pela Sofia`,
        'discord.gg/tde',
        'TDE no topo',
        'Tenho muita vida!',
        'Prefixo: tde!'
    ];
    i = 0;
  setInterval( () => client.user.setActivity(`${activities[i++ % activities.length]}`, {
     type: "PLAYING", url: "https://www.twitch.tv/balah_77"
      }), 60000); 
  client.user
      .setStatus("online")
});
client.on("messageUpdate", async (message, oldMessage) => {

    let setlogsmsgenv = db.get(`channelLogseditmsg_${message.guild.id}`);
    if (setlogsmsgenv === null) return;

    if (message.author.bot) return;

    let msgchannel = message.channel;
    let msgantiga = message.content;
    let msgeditada = oldMessage.content;

    let embed = new Discord.MessageEmbed()
        .setTitle(`📝 Mensagem editada`)
        .setColor(config.cordaem)
        .addFields(
            {
                name: `Autor da mensagem`,
                value: `${message.author}`,
                inline: false,
            },
        )

        .addFields(
            {
                name: `Canal`,
                value: `${msgchannel}`,
                inline: false,
            },
        )
        .addFields(
            {
                name: `Mensagem antiga`,
                value: `\`\`\`${msgantiga}\`\`\``,
                inline: false
            },
        )
        .addFields(
            {
                name: `Mensagem editada`,
                value: `\`\`\`${msgeditada}\`\`\``,
                inline: false,
            }
        )
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })

    message.guild.channels.cache.get(setlogsmsgenv).send({ embeds: [embed] })
});

client.on("messageDelete", async (message) => {

    let channelDellogs = db.get(`channelLogs_${message.guild.id}`);
    if (channelDellogs === null) return;

    if (message.author.bot) return;

    let user1 = message.author;
    let channel2 = message.channel;
    let msgDelete = message.content;

    let embed = new Discord.MessageEmbed()
        .setTitle(`🗑 Mensagem excluída`)
        .setColor(config.cordaem)
        .addFields(
            {
                name: `Autor da mensagem:`,
                value: `${user1}`,
                inline: false,
            },

        )
        .addFields(
            {
                name: `Canal:`,
                value: `${channel2}`,
                inline: false,
            },
        )
        .addFields(
            {
                name: `Mensagem:`,
                value: `\`\`\`${msgDelete}\`\`\``,
                inline: false,
            }
        )
        .setTimestamp()
        .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true })})
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

        try {

    message.guild.channels.cache.get(channelDellogs).send({ embeds: [embed] })

        } catch (e) { }
});

client.on('guildMemberAdd', async (member) => {

    let canalboa = db.get(`boasvindachannel_${member.guild.id}`)
    let role = db.get(`autorole_${member.guild.id}`)
    if (canalboa === null) return;
    if (role === null) return;

    let brunocargos = db.get(`autorole_${member.guild.id}`);
    if (!brunocargos === null) return;
    member.roles.add(brunocargos)

    let embed = new Discord.MessageEmbed()
        .setDescription(`> ${member.user} \n `)
        .setColor('BLUE')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`Olá ${member.user} bem vindo ao ${server.guild.name} agora temos ${guild.memberCount}`)
        .setAuthor({ name: `${server.guild.name} no topo`, iconURL: member.guild.iconURL({ dynamic: true }) })
        .setFooter(`Seja muito bem vindo(a) á ${member.guild.name}!`, member.guild.iconURL({ dynamic: true }))

    member.guild.channels.cache.get(canalboa).send({ content: `${member.user}`, embeds: [embed] }).catch(e => { }).then(msg => setTimeout(msg.delete.bind(msg), 50000))
 
})  //Bem vindo!

  client.on('guildMemberRemove', async (member) => {

    let canaladeus = db.get(`channeladeus_${member.guild.id}`)
  
    if (canaladeus === null || canaladeus === false) return;
  
    let embed = new Discord.MessageEmbed()
    .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
    .setDescription(`O membro ${member.user} saiu do servidor. 😭`)
    .setColor(config.cordaem);
  
    member.guild.channels.cache.get(canaladeus).send({ embeds: [embed] })

})

client.on('messageCreate', message => {

    if (message.channel.id === "id canal") {
        message.react('emoji');
  
  // não obrigatório ter 2 emojis, apenas 1, e tenha limites de emojis que seu BOT irá botar pro discord não achar que é spam
  
    }
  }); 
  
  client.on("channelCreate", channel => {
  
    const channelcreateId = channel.id;
  
  
    channel.guild.fetchAuditLogs({'type': 'CHANNEL_CREATE'}) 
    .then( logs => logs.entries.find(entry => entry.target.id == channelcreateId) ) 
    .then (entry => {
      author = entry.executor;
  
    const logis = client.channels.cache.get("")
    const easy = new Discord.MessageEmbed()
     
    
    .setDescription(`<:emoji_1:991131430681858139> **O canal** <#${channel.id}> **foi criado por** ${author}`)
    .setColor(config.cordaem)
    .setTimestamp()
  
    logis.send({ embeds: [easy] });
  })
  })

  client.on("channelDelete", channel => {
  
    const channelcreateId = channel.id;
  
  
    channel.guild.fetchAuditLogs({'type': 'CHANNEL_CREATE'}) 
    .then( logs => logs.entries.find(entry => entry.target.id == channelcreateId) ) 
    .then (entry => {
      author = entry.executor;
  
    const logis = client.channels.cache.get("")
    const easy = new Discord.MessageEmbed()
  
    .setDescription(`<:emoji_1:991131430681858139> **O canal** \`${channel.name}\` **foi deletado por** ${author}`)
    .setColor(config.cordaem)
    .setTimestamp()  

    logis.send({ embeds: [easy] });
  })
  })

client.on('interactionCreate', interaction => {

    let cargo = interaction.guild.roles.cache.get(""); // Coloque o ID do cargo de verificação.

    if (interaction.isButton()) {
        if (interaction.customId.startsWith("botao_cargo")) {
            try {

            if (interaction.member.roles.cache.get(cargo.id)) {

                interaction.reply({ content: `\\❌ Você já está verificado no servidor.`, ephemeral: true })

            } else {

            interaction.member.roles.add(cargo)
            interaction.reply({ content: `\\✅ Você foi verificado com sucesso.`, ephemeral: true })

            }
            } catch (er) { console.log(er) }
        } else {}

    }

})

client.on("message", message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (message.content.toLowerCase().startsWith(config.prefix + 'leave')) {
        if(![''].includes(message.author.id)) return message.reply("Apenas o dono do bot pode usar este comando :("); //id do adm aqui
        const args = message.content.split(' ').slice(1);
        let server = client.guilds.cache.get(args[0]);

        if (!args[0]) return message.reply("Coloque o ID da guild para eu sair!");
        if (!server) return message.reply("Não estou em nenhuma guild com esse ID");
    server.leave()
    console.log(`Comando: leave`)
    console.log(`Vazei de um servidor... ${server.name} (${server.id})`)
    const embed = new Discord.MessageEmbed()
    .setDescription("---------------------------------------------------")
    .addFields(
    {name: `Fui removido com sucesso em do servidor!`, value: `> **Nome:** \`${server.name}\`\n> **Id:** \`${server.id}\`\n> **Membros:** \`${server.memberCount}\``})
    .setFooter(`Comando feito por: ${message.author.tag}`)
    .setTimestamp()
    .setColor('RED')
    message.channel.send({ content: `<@${message.author.id}>`, embed: embed })
    }
});

client.on("channelUpdate", async (channel, oldchannel, message)=> {

    let canala = await client.channels.cache.get(""); //canal aqui
  
    let oldname = channel.name;
    let name = oldchannel.name;
    

    let embedaa = new Discord.MessageEmbed()
        .setTitle(`<:emoji_1:991131430681858139> Canal editado`)
        .setColor(config.cordaem)
        .addFields(
            {
                name: `<:emoji_1:991131430681858139> Nome do canal antigo:`,
                value: `**\`${oldname}\`**`,
                inline: true
            },
        )
        .addFields(
            {
                name: `<:emoji_1:991131430681858139> Nome do canal editado:`,
                value: `**\`${name}\`**`,
                inline: false,
            }
        )
        .setTimestamp()
        .setFooter(`Canal editado`)
    canal.send({ embeds: [embedaa] });
    }
)

//Antifake!
const { MessageEmbed } = require("discord.js")
client.on("guildMemberAdd", async (member) => {
    let minAge = ms("3 days")
    let createdAt = new Date(member.user.createdAt).getTime();
    let diff = new Date() - createdAt
    let antifake = db.fetch(`antifake_${member.guild.id}`)
    if( antifake === null ) antifake = "off"
    let dias = Math.floor( diff / 86400000)
    let loganti = db.fetch(`logantifake_${member.guild.id}`)

    let embed = new MessageEmbed()
    .setAuthor(`${member.user.tag} / (${member.user.id})`)
    .setDescription(`**${member.user.tag} foi expulso**`)
    .addField(`**Motivo:**`, `> \`Filtro anti fake ativado\``)
    .addField(`**Conta criada há:**`, `> \`${dias} dias\``)
    .setThumbnail( member.user.avatarURL({ dynamic: true, size: 2048 }))
    .setFooter(member.guild.name, member.guild.iconURL({ dynamic: true }))
    .setColor(config.cordaem)
    .setTimestamp();

    if( antifake === "off" ) return;

    if( antifake === "on" ) {
        if( minAge > diff ) {
            member.kick();
            if(loganti == null ) return;
            const log = client.channels.cache.get(loganti)
            log.send({ embeds:[embed]})        
        }
    } 
})


//Logs all
const Auditlog = require("discord-auditlog");

Auditlog(client, {
    "": {
        auditlog: "991448044627316796",    
        movement: "991448044627316796", // recomendo usar o mesmo canal do auditlog
        auditmsg: true, 
        voice: true, 
        trackroles: true, 
     
    }
});

client.on("ready", () => {

//Entrar em call
    const Voice = require('@discordjs/voice');
        const channel = client.channels.cache.get("991447718197219448") // id do canal
        if(!channel) return console.log("Canal invalido")
              const guild = client.guilds.cache.get("991098156534087690")// id da guild
                    if(!guild) return console.log("Guild invalida")
        let connection = Voice.getVoiceConnection(guild.id);
        if (!connection) {
          connection = Voice.joinVoiceChannel({
            'adapterCreator': guild.voiceAdapterCreator,
            'channelId': channel.id,
            'guildId': guild.id,
            'selfDeaf': true,
          });
        }
  })

 
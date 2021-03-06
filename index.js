if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required to launch this bot, please upgrade Node on your system.");

const Discord = require("discord.js");
const client = new Discord.Client({
    fetchAllMembers: false,
    disableEveryone: true,
    sync: null
});

const instance = require("./package.json");
const { version } = require("discord.js");
const settings = require("./config.js");

client.on("ready", () => {
    console.log(`Logged in as ${client.user.username}.`);
    client.user.setActivity(`In ${client.guilds.size} Servers`);
    client.user.setStatus("dnd");
});

client.on("message", async (message) => {
    if (message.channel.type === "dm") return;
    if (message.author.bot) return;
     
    if (message.content.indexOf(settings.prefix) !== 0) return;

    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        await message.channel.send(`Pong! \`${Date.now() - message.createdTimestamp} ms\``)
    }

    if (command === "stats") {
        const embed = new Discord.RichEmbed()
        .setTitle("System Statistics")
        .addField("Instance Username", `${client.user.tag}`)
        .addField("Instance ID", `${client.user.id}`)
        .addField("Instance Version", `${instance.version}`)
        .addField("Dependencies", `Discordjs **- ${version}**\nExpress **- ${instance.dependencies.express.slice(1)}**`)
        .addField("Memory Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
        .setColor("BLACK")
        await message.channel.send({embed});
    }

    if (command === "warn") {
        if (!message.member.roles.some(r=>["Administrator", "Moderator", "Admin", "Mod"].includes(r.name)) )
        return message.reply("**Sorry, you don't have the required role to execute this command.**");

        const dataWarn = args.join(" ");
        if (!dataWarn) return message.reply("**Please specify a reason in order to warn this user.**");

        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member)
        return message.reply("**Please specify a user in order to warn.**");

        const channel = message.guild.channels.find(ch => ch.name === settings.modLogChannel);
        if (!channel) return;

        const embed = new Discord.RichEmbed()
        .setTitle(`${client.user.username} Warning System`)
        .addField("Possible Moderator", `${message.author.tag}`)
        .addField("Target", `${member.user.username}`)
        .addField("Reason", `${dataWarn}`)
        .setColor("YELLOW")
        await channel.send({embed});

        return message.channel.send(`***${member.user.tag} has been warned.***`);
        return member.send(`You have been warned on **${message.guild.name}** for: **\`${dataWarn}**\`.`);
    }

    if (command === "mute") {
        if (!message.member.roles.some(r=>["Administrator", "Moderator", "Admin", "Mod"].includes(r.name)) )
        return message.reply("**Sorry, you don't have the required role to execute this command.**");

        const mutedRole = message.guild.roles.find(role => role.name === "Muted");
        if (!mutedRole) return message.reply("**There is no muted role found on this server.**");

        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member)
        return message.reply("**Please specify a user in order to mute.**");

        const channel = message.guild.channels.find(ch => ch.name === settings.modLogChannel);
        if (!channel) return;

        const embed = new Discord.RichEmbed()
        .setTitle(`${client.user.username} Warning System`)
        .addField("Possible Moderator", `${message.author.tag}`)
        .addField("Target", `${member.user.username}`)
        .setColor("ORANGE")
        await channel.send({embed});

        return message.channel.send(`***${member.user.tag} has been muted.***`);
        return member.send(`You have been muted on **${message.guild.name}**.`);

        await member.addRole(mutedRole);
    }

    if (command === "unmute") {
        if (!message.member.roles.some(r=>["Administrator", "Moderator", "Admin", "Mod"].includes(r.name)) )
        return message.reply("**Sorry, you don't have the required role to execute this command.**");

        const mutedRole = message.guild.roles.find(role => role.name === "Muted");
        if (!mutedRole) return message.reply("**There is no muted role found on this server.**");

        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member)
        return message.reply("**Please specify a user in order to unmute.**");

        const channel = message.guild.channels.find(ch => ch.name === settings.modLogChannel);
        if (!channel) return;

        const embed = new Discord.RichEmbed()
        .setTitle(`${client.user.username} Warning System`)
        .addField("Possible Moderator", `${message.author.tag}`)
        .addField("Target", `${member.user.username}`)
        .setColor("GREEN")
        await channel.send({embed});

        return message.channel.send(`***${member.user.tag} has been unmuted.***`);
        return member.send(`You have been unmuted on **${message.guild.name}**.`);

        await member.removeRole(mutedRole);
    }

    if (command === "kick") {
        if (!message.member.roles.some(r=>["Administrator", "Moderator", "Admin", "Mod"].includes(r.name)) )
        return message.reply("**Sorry, you don't have the required role to execute this command.**");

        const dataKick = args.join(" ");
        if (!dataKick) return message.reply("**Please specify a reason in order to kick this user.**")

        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member)
        return message.reply("**Please specify a user in order to kick.**");

        const channel = message.guild.channels.find(ch => ch.name === settings.modLogChannel);
        if (!channel) return;

        const embed = new Discord.RichEmbed()
        .setTitle(`${client.user.username} Warning System`)
        .addField("Possible Moderator", `${message.author.tag}`)
        .addField("Target", `${member.user.username}`)
        .addField("Reason", `${dataKick}`)
        .setColor("RED")
        await channel.send({embed});

        return message.channel.send(`***${member.user.tag} has been kick.***`).catch(error => message.channel.send(`**${member.user.tag} was unable to be kick, please try again.`));
        await member.kick(`${dataKick}`);
    }
});

client.login(settings.token);
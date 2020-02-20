const { Client, RichEmbed, Attachment } = require('discord.js')
const kcdc = require('./functions/kcdcHandler')
const bot = new Client()

bot.login(process.env.kcdcToken)
bot.on('ready', () => {
  bot.user.setActivity('질병관리본부', { type: 'WATCHING' })
  kcdc.newEv((ev) => {
    const embed = new RichEmbed()
      .setColor(0xff0000)
      .setTitle(ev.title)
      .setURL(ev.url)
      .setDescription(ev.desc)
      .setThumbnail('https://pbs.twimg.com/profile_images/839355661607555072/wpQw3vbQ_400x400.jpg')
      .setFooter('이 봇은 질병관리본부에서 관리, 운영을 하지 않습니다 - 문의: "TriNet / PMH#7086"')

    bot.channels.forEach((c) => {
      if (c.name.endsWith('-kcdc')) {
        bot.channels.get(c.id).send(embed)
        if (ev.image) bot.channels.get(c.id).send(new Attachment(ev.image))
      }
    })
  })
})

bot.on('guildCreate', (g) => {
  g.owner.send('KCDC봇을 초대해 주셔서 감사합니다\n앞으로의 KCDC 소식이 무엇보다도 빠른속도로 전송될것입니다\n주의: **' + g.name + '의 채널중 채널 이름 맨 뒤에 `-kcdc`가 적힌 채널에만 전송됩니다**')
})

require('dotenv').config();
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const morgan = require('morgan');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { Telegraf } = require('telegraf');
const api = require('covid19-api');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply(`Hello ${ctx.message.from.first_name}!`));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.hears('hi', (ctx) => ctx.reply('Hey there, I am CovidBob!'));
bot.hears('hello', (ctx) => ctx.reply('Hello there, I am CovidBob!'));
bot.hears('hello!', (ctx) => ctx.reply('Hello there, I am CovidBob!'));
bot.hears('how are you?', (ctx) => ctx.reply('Im as fine as a bot can be, and you?'));
bot.hears('thank you', (ctx) => ctx.reply('You are most welcome'));
bot.hears('thanks', (ctx) => ctx.reply('You are most welcome'));
bot.hears('having a hard day', (ctx) => ctx.reply('Sorry I feel your pain bro'));
bot.hears('hello:))))', (ctx) => ctx.reply('Hello there!'));
bot.hears('tell me a joke Bob', (ctx) => ctx.reply('Knock-knock!'));
bot.hears('Who’s there?', (ctx) => ctx.reply('It’s Siri'));
bot.hears('Siri who?', (ctx) => ctx.reply('My thoughts exactly'));
bot.on('text', async (ctx) => {
  let data = {};
  try {
    data = await api.getReportsByCountries(ctx.message.text);
    const formatData = `

country: ${data[0][0].country}
cases: ${data[0][0].cases}
death: ${data[0][0].deaths}
treated cases: ${data[0][0].recovered}
  `;
    await ctx.replyWithPhoto(data[0][0].flag);
    await ctx.reply(formatData);
  } catch {
    // eslint-disable-next-line no-console
    console.log('error');
    ctx.reply(`please input the correct name of the country`);
  }
});

bot.launch();

// eslint-disable-next-line no-console
// console.log(`covidBob is running`);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`The Bot is running on port: ${PORT}`);
});

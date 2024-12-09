const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '7931142994:AAFHsbDY2R96ADZe3W2HhFB1jds3xNetBKw';
const webAppUrl = 'https://all-books-shop.netlify.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text =msg.text;

  if(text === '/start') {

    await bot.sendMessage(chatId, 'Чтобы зайти в интернет магазин, нажми на кнопку', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Купить книги', web_app: {url: webAppUrl}}]
            ]
        }
    })

}
});


app.post('/web-data', async (req, res) => {

    const{queryId, products, totalPrice} = req.body
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {message_text: 'Поздравляю с покупкой, вы приобрели товар на сумму' + totalPrice}
        })
        return res.status(500).json({});
    } catch (e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Не удалось приобрести товар',
            input_message_content: {message_text: 'Не удалось приобрести товар'}
        })
        return res.status(500).json({});
    }
})

const PORT = 8000;
app.listen(PORT, () => console.log('server started on PORT' + PORT))
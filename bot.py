import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton

bot = telebot.TeleBot("7518211833:AAEYU4IlzDfLStPmAkGn4wCDHseiEwFXS1w")

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    markup = InlineKeyboardMarkup()
    button1 = InlineKeyboardButton("Пополнение", callback_data='choice1')
    button2 = InlineKeyboardButton("Помощь", callback_data='choice2')
    button3 = InlineKeyboardButton("На сайт", callback_data='choice3')  # Этот вариант не используется
    markup.add(button1, button2, button3)

    bot.send_message(message.chat.id, "Пожалуйста, выберите один из вариантов:", reply_markup=markup)


@bot.callback_query_handler(func=lambda call: True)
def handle_query(call):
    if call.data == 'choice1':
        # Отправляем текстовое сообщение
        bot.send_message(call.message.chat.id, "Оформите перевод на данные реквизиты и отправьте чек:")

        # Отправляем фото по URL
        photo_url = 'https://avatars.mds.yandex.net/i?id=f87478447042156879c09f62629b85f7-4833780-images-thumbs&n=13'
        bot.send_photo(call.message.chat.id, photo_url)

    elif call.data == 'choice2':
        # Создаем новое меню для второго выбора
        markup = InlineKeyboardMarkup()
        sub_button1 = InlineKeyboardButton("Правила", callback_data='sub_choice1')
        sub_button2 = InlineKeyboardButton("Описание игр", callback_data='sub_choice2')
        markup.add(sub_button1, sub_button2)

        bot.send_message(call.message.chat.id, "С чем требуется помощь?:", reply_markup=markup)

    elif call.data == 'sub_choice1':
        bot.send_message(call.message.chat.id, "Выберите игру.")

    elif call.data == 'sub_choice2':
        # Создаем новое меню для выбора правил
        markup = InlineKeyboardMarkup()
        rule_button1 = InlineKeyboardButton("Фортуна", callback_data='rule_choice1')
        rule_button2 = InlineKeyboardButton("Кейсы", callback_data='rule_choice2')
        rule_button3 = InlineKeyboardButton("Монетка", callback_data='rule_choice3')
        rule_button4 = InlineKeyboardButton("Ставки", callback_data='rule_choice4')
        markup.add(rule_button1, rule_button2, rule_button3, rule_button4)

        bot.send_message(call.message.chat.id, "Выберите правила для игры:", reply_markup=markup)

    elif call.data == 'rule_choice1':
        bot.send_message(call.message.chat.id, "В игре 'Фортуна': ...")  # Добавьте текст правил игры 1

    elif call.data == 'rule_choice2':
        bot.send_message(call.message.chat.id, "В игре 'Кейсы': ...")  # Добавьте текст правил игры 2

    elif call.data == 'rule_choice3':
        bot.send_message(call.message.chat.id, "В игре 'Монетка'': ...")  # Добавьте текст правил игры 3

    elif call.data == 'rule_choice4':
        bot.send_message(call.message.chat.id, "В 'Ставки': ...")  # Добавьте текст правил игры 4

    elif call.data == 'choice3':
        bot.send_message(call.message.chat.id, "Перейдите на наш сайт: [http://127.0.0.1:8000]")  # Добавьте ссылку на сайт


if __name__ == "__main__":  # Исправлено здесь
    bot.polling()


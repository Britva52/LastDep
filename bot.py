import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton

bot = telebot.TeleBot("7518211833:AAEYU4IlzDfLStPmAkGn4wCDHseiEwFXS1w")


@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    markup = InlineKeyboardMarkup()
    button1 = InlineKeyboardButton("Пополнение", callback_data='choice1')
    button2 = InlineKeyboardButton("Помощь", callback_data='choice2')
    button3 = InlineKeyboardButton("", callback_data='choice3')  # Этот вариант не используется
    markup.add(button1, button2, button3)  # Добавим button3, если он нужен

    bot.send_message(message.chat.id, "Пожалуйста, выберите один из вариантов:", reply_markup=markup)


@bot.callback_query_handler(func=lambda call: True)
def handle_query(call):
    if call.data == 'choice1':
        bot.send_message(call.message.chat.id, "Оформите перевод на данные реквизиты и отправьте чек:")

    elif call.data == 'choice2':
        # Создаем новое меню для второго выбора
        markup = InlineKeyboardMarkup()
        sub_button1 = InlineKeyboardButton("Описание игр", callback_data='sub_choice1')
        sub_button2 = InlineKeyboardButton("Правила", callback_data='sub_choice2')
        markup.add(sub_button1, sub_button2)

        bot.send_message(call.message.chat.id, "С чем требуется помощь?:",
                         reply_markup=markup)

    elif call.data == 'sub_choice1':
        bot.send_message(call.message.chat.id, "Выберите игру.")

    elif call.data == 'sub_choice2':
        bot.send_message(call.message.chat.id, "Правила.")


if __name__ == "__main__":  # Исправлено здесь
    bot.polling()
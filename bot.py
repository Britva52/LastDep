import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton

bot = telebot.TeleBot("7518211833:AAEkICjJzR0RXLw2E7uv8UFMOf7vuZ80Kbg")  # Замените на ваш API-ключ

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
        bot.send_message(call.message.chat.id, "Оформите перевод на данные реквизиты и отправьте чек:")
        photo_url = 'https://avatars.mds.yandex.net/i?id=f87478447042156879c09f62629b85f7-4833780-images-thumbs&n=13'
        bot.send_photo(call.message.chat.id, photo_url)

    elif call.data == 'choice2':
        markup = InlineKeyboardMarkup()
        sub_button1 = InlineKeyboardButton("Правила", callback_data='sub_choice1')
        sub_button2 = InlineKeyboardButton("Описание игр", callback_data='sub_choice2')
        markup.add(sub_button1, sub_button2)

        bot.send_message(call.message.chat.id, "С чем требуется помощь?:", reply_markup=markup)

    elif call.data == 'sub_choice1':
        bot.send_message(call.message.chat.id,
                         "Правила онлайн-казино:\n\n"
                         "1. Регистрация: Все игроки должны пройти процедуру регистрации и предоставить удостоверение личности по требованию.\n\n"
                         "2. Честные игры: Проект обязуется предоставлять честные игры и использовать сертифицированные генераторы случайных чисел (ГСЧ) для электронных игр.\n\n"
                         "3. Защита данных: Личная информация игроков будет защищена в соответствии с законами о конфиденциальности и не будет передана третьим лицам без согласия.\n\n"
                         "4. Ставки и выигрыши: Установлены минимальные и максимальные ставки для каждой игры. Все выигрыши будут автоматически зачислены на счет пользователя в соответствии с правилами игры.\n\n"
                         "5. Запрет на ботов: Запрещается использование любых автоматизированных программ или ботов для игры. Нарушение этого правила может привести к блокировке учетной записи.\n\n"
                         "6. Ответственная игра: Проект предлагает инструменты для поддержки ответственной игры, включая возможность установить лимиты на ставки, время игры и самоисключение. Пользователи могут обратиться за помощью в случае необходимости.\n\n"
                         "7. Изменения в правилах: Администрация оставляет за собой право изменять правила и условия игры, о чем будет сообщено игрокам заранее.\n\n"
                         )

    elif call.data == 'sub_choice2':
        markup = InlineKeyboardMarkup()
        rule_button1 = InlineKeyboardButton("Фортуна", callback_data='rule_choice1')
        rule_button2 = InlineKeyboardButton("Кейсы", callback_data='rule_choice2')
        rule_button3 = InlineKeyboardButton("Монетка", callback_data='rule_choice3')
        rule_button4 = InlineKeyboardButton("Ставки", callback_data='rule_choice4')
        markup.add(rule_button1, rule_button2, rule_button3, rule_button4)

        bot.send_message(call.message.chat.id, "Выберите правила для игры:", reply_markup=markup)

    elif call.data == 'rule_choice1':
        bot.send_message(call.message.chat.id,
                         "В игре 'Фортуна':\n"
                         "Играйте с удачей! Правила просты - ставьте и выигрывайте!\n"
                         "1. Минимальная ставка составляет 10 монет.\n"
                         "2. Каждая игра длится около 5 секунд.\n"
                         "3. Выигрыш х35 от ставки если угадываете.\n"
                         "4. Все выигрыши зачисляются на игровой счет автоматически.\n"
                         )

    elif call.data == 'rule_choice2':
        bot.send_message(call.message.chat.id,
                         "В игре 'Кейсы':\n"
                         "Откройте кейсы и получите призы!\n"
                         
                         "1. Каждый кейс содержит случайный приз, который может варьироваться в цене.\n"
                         "2. Открытие кейса стоит N монет.\n"
                         "3. Все выигрыши будут автоматически зачислены на ваш счет после завершения события.\n"
                         "4. В случае неудачи вы можете попробовать еще раз (для лудиков)!\n"
                         )

    elif call.data == 'rule_choice3':
        bot.send_message(call.message.chat.id,
                         "В игре 'Монетка':\n"
                         "Подбросьте монетку и сделайте ставку на орел или решку!\n"
                         "1. Минимальная ставка составляет 5 монет.\n"
                         "2. Если вы угадали сторону монеты, ваша ставка удваивается.\n"
                         "3. Играйте сколько угодно раз, но помните, что вы не лудик и вовремя остановитесь!\n"
                         )

    elif call.data == 'rule_choice4':
        bot.send_message(call.message.chat.id,
                         "В игре 'Ставки':\n"
                         "Делайте ставки на различные события и выигрывайте!\n"
                         "1. Ставки принимаются на спортивные события.\n"
                         "2. Минимальная ставка составляет 20 монет.\n"
                         "3. Коэффициенты зависят от вероятности события и обновляются в реальном времени.\n"
                         "4. Все выигрыши будут автоматически зачислены на ваш счет после завершения события.\n"
                         )

    elif call.data == 'choice3':
        bot.send_message(call.message.chat.id,
                         "Перейдите на наш сайт: [http://127.0.0.1:8000]")  # Добавьте ссылку на сайт


if __name__ == "__main__":
    bot.polling()



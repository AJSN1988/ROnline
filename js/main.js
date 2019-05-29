// JQuery init

$(document).ready(function () {

// Common

    var mobile_status, msEdgeStatus = false;

    if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        mobile_status = true;
    }

    if (/Edge/.test(navigator.userAgent)) {
        msEdgeStatus = true;
        $('body').css('overflow-x', 'auto'); // Fix scroll bug in MS Edge
    }


// Custom scrollbar

    if (!mobile_status && !msEdgeStatus) {
        var params = {
            root : 'html',
            scroller : 'body',
            bar: '.baron__bar'
        };
    
        baron(params);        
    }

// Chatbot section

    // Chat objects
    
    var chat_section = $('.chat-section');
    var chat_canvas = $('.chat-canvas');
    var chat_messanger_section = $('.chat-messanger');
    var top_border = $('#chatInputAreaTopBorder');
    var chat_label = $('#chatTipsLabel');
    var chat_icons_section = $('.chat-icons');
    var user_input_section = $('#chatInputArea');
    var conversation_wrap_section = $('.conversation-wrapper');
    var chat_show_btn = $('#chatButton');
    var chat_close_btn = $('#closeChatBtn');
    var show_help_btn = $('#showHelpChatBtn');
    var show_emoji_btn = $('#showEmojiChatBtn');
    var send_phrase_btn = $('#sendChatBtn');

    var chat_state = false;

    if (!chat_state) {
        user_input_section.html('Задайте свой вопрос Аркадию здесь...');
    }    
    
    // Emoji for chat

    user_input_section.emoji( {
        button: '#showEmojiChatBtn',
        showTab: false,
        animation: 'slide',
        position: 'bottomLeft',
        icons: [{
            name: "chat_emoji",
            path: "assets/img/qq/",
            maxNum: 91,
            excludeNums: [41, 45, 54],
            file: ".gif"
        }]
    });

    // Common chat functions    

    function get_client_date () {
        // Detect work time
        
        var date_obj = new Date();
        var months = {
            0 : 'Января',
            1 : 'Февраля',
            2 : 'Марта',
            3 : 'Апреля',
            4 : 'Мая',
            5 : 'Июня',
            6 : 'Июля',
            7 : 'Августа',
            8 : 'Сентября',
            9 : 'Октября',
            10 : 'Ноября',
            11 : 'Декабря'
        }
        var day = date_obj.getDate().toString();
        var month = months[date_obj.getMonth()];
        var hours = date_obj.getHours().toString(); // Change on a server time     
        var minutes = date_obj.getMinutes().toString(); // Chanbge on a server time
        if (minutes.length == 1) {
            minutes = '0' + minutes;
        }
        var current_time = day + ' ' + month + ' ' + hours + ':' + minutes;
        return current_time;
    }

    function scroll_down() {
        chat_canvas.scrollTop(chat_canvas[0].scrollHeight);
    }

    function add_phrase (side, phrase) {
        var date = get_client_date();
        if (side == 'bot') {
            var phrase_element = '<p class="phrase-date">' + date + '</p>' + 
                            '<div class="bot-phrase"><p>' + phrase + '</p></div>';
        } else if (side == 'user') {
            var phrase_element = '<p class="phrase-date">' + date + '</p>' + 
                            '<div class="user-phrase"><p>' + phrase + '</p></div>';
        }
        conversation_wrap_section.append(phrase_element);
        if (side == 'bot' && chat_state) {
            user_input_section.focus();
        }
        scroll_down();
    }

    function send_user_phrase() {
        var phrase = user_input_section.html();
        if (phrase) {
            add_phrase('user', phrase);
            user_input_section.html('');
            chat_label.text('Ожидайте ответа ...');
            setTimeout(add_default_bot_response, 2000);
        }
    }

    function add_default_bot_response() {
        chat_label.text('Для отправки можно нажать CTRL + ENTER');
        add_phrase('bot', 
            'Стандартный ответ Аркадия.');
    }

    function start_input(){
        chat_messanger_section.css('height', '110px');
        chat_icons_section.css('text-align', 'center').children('button').css('padding', '0 25px');
        user_input_section.attr('placeholder', '').css('text-align', 'left').html('');
        chat_label.show(700);
        top_border.show(700);
        chat_state = true;
        user_input_section.focus();
    }

    function end_input() {
        chat_messanger_section.css('height', '90px');
        chat_state = false;
        chat_icons_section.css('text-align', 'right');
        chat_icons_section.children('button').css('padding', '0 5px');
        user_input_section.attr('placeholder', 'Задайте свой вопрос Аркадию здесь...');
        user_input_section.css('text-align', 'center').html('Задайте свой вопрос Аркадию здесь...');
        conversation_wrap_section.empty();
        chat_label.hide();
        top_border.hide();
        user_input_section.focusout();
    }    

    // Chat events
        
    user_input_section.click(function () {        
        start_input();
    });

    user_input_section.keydown(function (e) {
        if (e.ctrlKey && e.keyCode == 13) {
            send_user_phrase();
        }
    });        

    chat_show_btn.click(function () {
        $(this).hide(300);
        chat_section.toggle(500, function (){
            chat_section.css('min-height', '350px');
            if (!chat_state) {
                add_phrase('bot', 'Здравствуйте. Меня зовут Аркадий, я чат-бот, готовый оказать Вам посильную техническую поддержку по \
                    усугам компании Рошаль Онлайн. Просто задайте свой вопрос и я Вам помогу.');
            }
        });              
    });

    chat_close_btn.click(function () {
        chat_section.css('min-height',0).toggle(500);
        chat_show_btn.show(1000);
        end_input();
    });

    show_help_btn.click(function () {
        if (chat_state) {

        } else {
            start_input();
        }
    });

    show_emoji_btn.click(function () {
        if (!chat_state) {
            start_input();
        }
    });

    send_phrase_btn.click(function () {
        if (chat_state) {
            send_user_phrase();
        } else {
            start_input();
        }        
    });
});
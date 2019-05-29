$(document).ready(function () {

    // 1 Common actions section

    var mobileStatus = false;
    let splittedUrl = $(location).attr('href').split('#');
    // TODo Need refactoring removing old sections and rebuils croll to elements
    let sections = ['ethInetSection', 'xdslInetSection', 'phoneTarifSection', 'mgTarifsSection', 'chanelsServicesSecion'];

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        mobileStatus = true;
    }

    if (splittedUrl.length == 2) {
        $.each(sections, function (k, v) {
            if (splittedUrl[1] == v) {
                var position = $('#' + splittedUrl[1])[0].offsetTop - 80;
                $("html, body").stop().animate({ scrollTop: position }, 500, 'swing');
            }
        });
    }

    $(function () {
        // Enable b4-tooltip

        $('[data-toggle="tooltip"]').tooltip();
    });

    $('.faq-nav').click(function () {
        // Faq sections nav

        if ($(this).hasClass('active-faq-nav')) return false;
        var id = $(this).attr('data-target');

        // Hide prev faq section
        var showedId = $('.faq-nav.active-faq-nav').attr('data-target');
        $('.faq-wrapper[data-id="' + showedId + '"]').addClass('faq-hidden');

        // Show selected faq section
        $('.faq-wrapper[data-id="' + id + '"]').removeClass('faq-hidden');

        //Set active faq nav
        $('.active-faq-nav').removeClass('active-faq-nav');
        $(this).addClass('active-faq-nav');
    });

    // 2 Info services section

    $('.service-nav-item').click(function () {
        // Show needed info section

        var target = $(this).attr('data-id');
        if ($(this).hasClass('active-item')) return false;

        $('.info-services-page:not(.hidden-page)').addClass('hidden-page');
        $('.info-services-page[data-id="' + target + '"]').removeClass('hidden-page');
        $('.service-nav-item.active-item').removeClass('active-item');
        $(this).addClass('active-item');
    });

    $('.info-services-wrapper').hover(function () {
        $(this).find('.top-section-link').removeClass('hidden-link');
    }, function () {
        $(this).find('.top-section-link').addClass('hidden-link');
    });

    // 3 Internet prices section

    $('.price-service-nav-item').click(function () {
        // Select internet connection typr and show the appropriate price carousel

        if ($(this).hasClass('active-service-price-item')) return false;

        var activePriceCarouselId = $('.active-service-price-item').attr('data-target');
        var targetCarouselId = $(this).attr('data-target');

        $('.active-service-price-item').removeClass('active-service-price-item');
        $(this).addClass('active-service-price-item');

        $('#' + activePriceCarouselId).addClass('.hidden-carousel').hide();
        $('#' + targetCarouselId).removeClass('.hidden-carousel').show();
    });

    // 4 Telephone

    $("#mgTarifsInput").on('keypress', function (e) {
        // Enable input for digits only and limiting digits count on 15

        var key = e.keyCode || e.which;
        var value = $(this).val();
        var limit = 15;

        if (value.length == limit) return false;
        if (!(key == '46' || key == '8')) {
            if (isNaN(parseInt(String.fromCharCode(key)))) {
                return false;
            }
        }
    });

    // Mg tarifs object
    var numbers = {
        'Москва (mob) - Билайн': '12.00|13.50|11.00',
        'Индия (mob)': '8.50|10.00|12.50',
        'Москва (mob) - МТС': '5.00|4.50|5.00',
        'Андорра (mob)': '11.50|12.50|11.00',
        'Эстония (fix) - Таллинн': '7.50|8.00|12.00',
        'Вьетнам (mob) - Vietel': '10.00|9.00|9.50',
        'Московская (fix)': '4.00|4.50|5.00'
    } // For demo

    var directionName = $('.mg-direction-name');
    var firstDirPrice = $('.1-price');
    var secondDirPrice = $('.2-price');
    var thirdDirPrice = $('.3-price');

    var getRandomDirKey = function () {
        // Demo function for phone prices section. Retern random key from dirs list

        var keys = Object.keys(numbers);
        var index = Math.floor(Math.random() * (keys.length));
        return keys[index];
    }

    var updatePriceDirection = function () {
        // Demo function changing price text on page.

        var currDirection = getRandomDirKey();
        var currDirPrices = numbers[currDirection].split('|');
        directionName.text(currDirection);
        firstDirPrice.html(currDirPrices[0] + ' &#8381;');
        secondDirPrice.html(currDirPrices[1] + ' &#8381;');
        thirdDirPrice.html(currDirPrices[2] + ' &#8381;');
    }

    // Events

    setInterval(updatePriceDirection, 30000);

    updatePriceDirection();

    // Channels section

    $('.ch-feature').hover(function () {
        // Animate channel section text elements on hover. If agent has small screen device not animate thus 

        if (!mobileStatus && $(window).width() > 992) {
            $(this).find('img').animate({ height: '30px' });
            $(this).find('hr').show();
            $(this).find('.ch-feature-header').animate({
                fontSize: '10px',
                marginTop: '6px',
                marginBottom: '6px'
            });
            $(this).find('.ch-feature-description').animate({
                opacity: '1'
            }, 700);
        }
    }, function () {
        if (!mobileStatus && $(window).width() > 992) {
            $(this).find('img').animate({ height: '50px' });
            $(this).find('hr').hide();
            $(this).find('.ch-feature-header').animate({
                fontSize: '13px',
                marginTop: '16px',
                marginBottom: '16px'
            });
            $(this).find('.ch-feature-description').animate({
                opacity: '0'
            }, 100);
        }
    });

    // Services modal window and purchase form

    var modalTitle = $('.modal-title');
    var modalTarifTypeSection = $('.modal-tarif-type-section');
    var modalTarifHeader = $('.modal-tarif-header');
    var modalTarifParams = $('.modal-tarif-params');

    var changeMonthlyCost = function (value, operation) {
        // Change monthly payment summ

        if (operation == undefined) operation = 'add';
        var currVal = parseInt($('.all-monthly-cost').html());

        if (operation == 'add') {
            $('.all-monthly-cost').html((parseInt(value) + currVal) + '&#8381; <span> / мес. </span>');
        } else if (operation == 'del') {
            $('.all-monthly-cost').html((currVal - parseInt(value)) + '&#8381; <span> / мес. </span>');
        } else if (operation == 'set') {
            $('.all-monthly-cost').html(value + '&#8381; <span> / мес. </span>');
        }
    }

    var changeInstallCost = function (value, operation) {
        // Change install payment summ

        if (operation == undefined) operation = 'add';
        var currVal = parseInt($('.install-cost').html());

        if (operation == 'add') {
            $('.install-cost').html((parseInt(value) + currVal) + ' &#8381;');
        } else if (operation == 'del') {
            $('.install-cost').html((currVal - parseInt(value)) + ' &#8381;');
        } else if (operation == 'set') {
            $('.install-cost').html(value + ' &#8381;');
        }
    }

    $('.purchase-service').click(function () {
        // Compale tarif properties and show purchase modal window

        var tarifParams = $(this).attr('data-tarif-description').split('|');
        var avalible_options = $(this).attr('data-tarif-oprions').split('|');

        if (tarifParams[0] == 'Ethernet') {
            tarifType = 'Тип подключения : Компьютерная сеть';
            modalTitle.text('Подключение услуги доступа к сети интернет с тарифным планом ' + tarifParams[1]);
        } else if (tarifParams[0] == 'DSL') {
            tarifType = 'Тип подключения : Телефонная DSL линия';
            modalTitle.text('Подключение услуги доступа к сети интернет с тарифным планом ' + tarifParams[1]);
        } else if (tarifParams[0] == 'Phone') {
            tarifType = 'Тип подключения : Местная телефонная связь';
            modalTitle.text('Подключение услуги безлимитного доступа к местной телефонной связи');
        }

        modalTarifTypeSection.text(tarifType);

        $('.card').each(function () {
            if (avalible_options.indexOf($(this).attr('data-option-name')) == -1) {
                $(this).css('display', 'none');
            }
        });


        modalTarifHeader.html('Выбранный тариф : <span class="modal-tarif-name">' + tarifParams[1] + '</span>');
        modalTarifParams.html('Подключение - ' + tarifParams[2] + ' &#8381;<span class="modal-tarif-param-delimeter"></span>Максимальная скорость - ' +
            tarifParams[3] + ' Мбит/с<span class="modal-tarif-param-delimeter"></span>Ежемесячный платеж - ' + tarifParams[4] + ' &#8381;');

        changeInstallCost(tarifParams[2]);
        changeMonthlyCost(tarifParams[4]);

        $('#addServicetModal').modal();
    });

    $('.card-header').click(function () {
        // Collapse icon rotating

        var collapse = $(this).parent().find('.collapse');
        $('.card-header i').each(function () {
            if ($(this).hasClass('fa-rotate-90')) {
                $(this).removeClass('fa-rotate-90');
            }
        });
        if (collapse.hasClass('show')) {
            $(this).find('i').toggleClass('fa-rotate-90');
        }
        $(this).find('i').toggleClass('fa-rotate-90');
    });

    $('.tarif-option-selector').hover(function () {
        if ($(this).hasClass('selected-option')) {
            $(this).css('background-color', '#eaeff4');
        }
    }, function () {
        $(this).css('background-color', '');
    });

    $('.tarif-option-selector').click(function () {
        // Select option and edit total monthly or install cost

        var selectedCountEl = $(this).closest('.collapse').prev('.card-header').find('.selected-options-circle');
        var purchaseEl = $(this).find('.modal-purchase-cost');

        if ($(this).hasClass('trigger-selector')) {
            if (!$(this).hasClass('selected-option')) {
                var option_list = $(this).parent('.list-group').find('.tarif-option-selector');
                option_list.each(function () {
                    if ($(this).hasClass('selected-option')) {
                        $(this).removeClass('selected-option');
                        var selected_el_cost = $(this).find('.modal-purchase-cost');
                        if (selected_el_cost.attr('data-type') == 'monthly') {
                            changeMonthlyCost(value = selected_el_cost.attr('data-cost'), operation = 'del');
                        } else {
                            changeInstallCost(value = selected_el_cost.attr('data-cost'), operation = 'del');
                        }
                    }
                });
                selectedCountEl.html('1').css('background-color', 'red');
                if (purchaseEl.attr('data-type') == 'monthly') {
                    changeMonthlyCost(purchaseEl.attr('data-cost'));
                } else {
                    changeInstallCost(purchaseEl.attr('data-cost'));
                }

            } else {
                selectedCountEl.html('0').css('background-color', '#c3c3c3');
                if (purchaseEl.attr('data-type') == 'monthly') {
                    changeMonthlyCost(value = purchaseEl.attr('data-cost'), operation = 'del');
                } else {
                    changeInstallCost(value = purchaseEl.attr('data-cost'), operation = 'del');
                }
            }
            $(this).toggleClass('selected-option');

        } else {
            if (!$(this).hasClass('selected-option')) {
                var all_selected_options_count = parseInt(selectedCountEl.html());
                selectedCountEl.html(all_selected_options_count + 1).css('background-color', 'red');
                if (purchaseEl.attr('data-type') == 'monthly') {
                    changeMonthlyCost(purchaseEl.attr('data-cost'));
                } else {
                    changeInstallCost(purchaseEl.attr('data-cost'));
                }
            } else {
                if (selectedCountEl.html() == 1) {
                    selectedCountEl.html(0).css('background-color', '#c3c3c3');
                } else if (selectedCountEl.html() > 1) {
                    var all_selected_options_count = parseInt(selectedCountEl.html());
                    selectedCountEl.html(all_selected_options_count - 1);
                }
                if (purchaseEl.attr('data-type') == 'monthly') {
                    changeMonthlyCost(value = purchaseEl.attr('data-cost'), operation = 'del');
                } else {
                    changeInstallCost(value = purchaseEl.attr('data-cost'), operation = 'del');
                }
            }
            $(this).toggleClass('selected-option');
        }
    });

    $('.second-tarif-option-item').hover(function () {
        // Show tarif option descripton and hide his after time out

        var el = $(this).parent().find('.option-info');
        setTimeout(function () {
            el.fadeIn(700);
        }, 1000);
    }, function () {
        var el = $(this).parent().find('.option-info');
        setTimeout(function () {
            el.fadeOut(700);
        }, 20000);
    });

    $('.form-control').focus(function () {
        $(this).attr('placeholder', '');
        $(this).next('small').css('opacity', '1');
    });

    $('.form-control').focusout(function () {
        var placeholder = $(this).attr('help');
        $(this).attr('placeholder', placeholder);
        if ($(this).val() == '') {
            $(this).next('small').css('opacity', '0');
        }
    });

    $('#phoneInput').focus(function () {
        if ($(this).val() == '') {
            $(this).val('8-');
        }
    });

    $('#phoneInput').focusout(function () {
        if ($(this).val() == '8-') {
            $(this).addClass('invalid-input');
            $(this).val('');
        }
    });

    $("#phoneInput").on('keypress', function (e) {
        // Enable input for digits only and adding russian style phone number delimeters

        var key = e.keyCode || e.which;
        var currVal = $(this).val();

        if (key == '46' || key == '8') {

        } else {
            if (isNaN(parseInt(String.fromCharCode(key)))) {
                return false;
            }
            if ($(this).val().length == 1 || $(this).val().length == 5 || $(this).val().length == 9 || $(this).val().length == 12) {
                $(this).val(currVal + '-');
            }
        }
    });

    $("#phoneInput").change(function () {
        var curr_count = $(this).val().length;
        if (curr_count != parseInt($(this).attr('maxlength'))) {
            $(this).addClass('invalid-input');
        } else {
            $(this).removeClass('invalid-input');
        }
    });

    $('#emailInput').focusout(function () {
        // Validate email input 

        var pattern = new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
        var currVal = $(this).val();
        if (!pattern.test(currVal)) {
            if ($(this).val() != '') {
                $(this).addClass('invalid-input');
            }
        } else {
            $(this).removeClass('invalid-input');
        }

    });

    $('#commentTextArea').focusout(function () {
        if ($(this).attr('placeholder') == '') {
            $(this).attr('placeholder', 'Ваш комментарий (по желанию)');
        }
    })

    $('.requare-input').focusout(function () {
        if ($(this).val() == '') {
            $(this).addClass('invalid-input');
            $('.modal-purchase-info').html('Для успешного подключения услуги, Вам необходимо заполнить отмеченные поля, обязатнльные для заполнения').css('color', 'red');
        } else {
            if (!$(this).hasClass('invalid-input') || $(this).attr('type') == 'text') {
                $(this).removeClass('invalid-input');
                $('.modal-purchase-info').html('Для того, чтобы перейти к оформлению заявки на подключение услуги, проверьте корректность выбранных опция для тарифного плана и кликните "Продолжить"').css('color', '#101316');
            }

        }
    });

    $('#addServicetModal').on('hidden.bs.modal', function () {
        // Manually reset tarif modal

        $('.card').each(function () {
            if ($(this).css('display') == 'none') {
                $(this).css('display', '');
            }
        });
        $('.selected-options-circle').each(function () {
            if ($(this).html() != 0) {
                $(this).html('0').css('background-color', '#c3c3c3');
            }
        });
        $('.tarif-option-selector').each(function () {
            if ($(this).hasClass('selected-option')) {
                $(this).removeClass('selected-option');
            }
        });
        $('.collapse').each(function () {
            if ($(this).hasClass('show')) {
                $(this).removeClass('show');
            }
        });
        $('.fa-chevron-right').each(function () {
            if ($(this).hasClass('fa-rotate-90')) {
                $(this).removeClass('fa-rotate-90');
            }
        });

        $('small').css('opacity', '0');

        $('.inet-modal-container').show();
        $('.purchase-form-container').hide();

        $('#purchaseModalForm').get(0).reset();

        $('.invalid-input').removeClass('invalid-input');

        $('.purchase-modal-btn').show();
        $('.prev-modal-btn').hide();
        $('.confirm-modal-btn').hide();

        $('.modal-purchase-info').html('Для того, чтобы перейти к оформлению заявки на подключение услуги, проверьте корректность выбранных опция для тарифного плана и кликните "Продолжить"').css('color', '#101316');

        changeInstallCost(value = 0, operation = 'set');
        changeMonthlyCost(value = 0, operation = 'set');
    });

    $('.purchase-modal-btn').click(function () {
        $('.inet-modal-container').toggle();
        $('.purchase-form-container').toggle();

        $('.purchase-modal-btn').toggle();
        $('.prev-modal-btn').toggle();
        $('.confirm-modal-btn').toggle();

        $('.modal-purchase-info').html('Для того, чтобы отправить заявку на подключение услуги, заполните необходимы поля и нажимте "Подключить услугу". Если желаете изменить набор опций, нажимте "Вернуться назад"');
    });

    $('.prev-modal-btn').click(function () {
        $('.inet-modal-container').toggle();
        $('.purchase-form-container').toggle();

        $('small').css('opacity', '0');

        $('.purchase-modal-btn').toggle();
        $('.prev-modal-btn').toggle();
        $('.confirm-modal-btn').toggle();

        $('#purchaseModalForm').get(0).reset();

        $('.invalid-input').removeClass('invalid-input');

        $('.modal-purchase-info').html('Для того, чтобы перейти к оформлению заявки на подключение услуги, проверьте корректность выбранных опция для тарифного плана и кликните "Продолжить"').css('color', '#101316');
    });

    var modalFormSubmit = function () {
        // Submit puschase form

        var validationErr = false;
        $('.requare-input').each(function () {
            if ($(this).val() == '') {
                validationErr = true;
                $(this).addClass('invalid-input');
                $('.modal-purchase-info').html('Ошибка валидации данных пользователя. Возможно вы некорректно заполнили обязательные поля или проигнорировали их. Укажите корректные данные и повторите попытку').css('color', 'red');
            }
        });
        if (!validationErr) {
            $('#purchaseModalForm').submit();
        }
    }

    $('#confirmAddServiceModal').click(function () {
        // Check the acceptance of the personal info security terms

        if ($('#acceptPDNCheck').is(':checked')) {
            modalFormSubmit();
        } else {
            if ($('.check-label-lg').css('display') == 'none') {
                modalFormSubmit();
            } else {
                $('.modal-purchase-info').html('Для продолжения необходимо выразить свое согалсие с условиями обработки и хранения персональных данных оператором связи ООО "Альтес-Р" и посторите попытку').css('color', 'red');
            }
        }
    });

    $('.close-label-sm').click(function () {
        $('#addServicetModal').modal('hide');
    });
});
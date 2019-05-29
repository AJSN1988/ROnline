$(document).ready(function () {

    // Company location section

    var getWorkTime = function () {
        // Return tech support worktime (8AM-17PM 5/2)
        var date_obj = new Date();
        var curr_day = date_obj.getDay();
        var curr_hour = date_obj.getHours();
        if (curr_day == 0 || curr_day == 6) {
            if (curr_hour < 8 && curr_hour > 17) {
                return false;
            }
        }
        if (curr_hour < 8 || curr_hour > 18) {
            return false;
        }
        return true;
    }

    // Events

    // Enable\disable phone calling in worktime
    if (getWorkTime()) {
        $('#supportPhone').attr({
            'title': 'Специалисты онлайн',
            'href': ''
        });
    } else {
        $('#supportPhone').attr({
            'title': 'Специалисты оффлайн',
            'href': ''
        });
    }

    $('.hide-location-plate-btn').hover(function () {
        $(this).css({
            'cursor': 'pointer',
            'color': '#FECE1A'
        })
    }, function () {
        if ($(this).attr('data-state') == 'showed') {
            $(this).css({
                'color': '#fff'
            })
        } else {
            $(this).css({
                'color': '#101316'
            })
        }
    });

    $('.hide-location-plate-btn').click(function () {
        // Hide\show address plate
        if ($(this).attr('data-state') == 'showed') {
            $(this).attr('data-state', 'hidden').css('color', '#101316').attr('data-original-title', 'Показать адресную панель').tooltip('hide');
            $('.location-plate').css('opacity', '0.1');
        } else {
            $(this).attr('data-state', 'showed').css('color', '#fff').attr('data-original-title', 'Скрыть адресную панель').tooltip('hide');
            $('.location-plate').css('opacity', '1');
        }
    });

    // Company bank details section

    var setErrorFormStatus = function (meassge) {
        $('.status-contact-form').text(meassge).addClass('error-form-status');
        setTimeout(function () {
            $('.status-contact-form').text('Для отправки формы заполните обязательные поля и кликните конпку "Оправить".').removeClass('error-form-status');
        }, 5000);
    };

    // Events

    $(function () {
        // Enable b4-tooltip

        $('[data-toggle="tooltip"]').tooltip();
    });

    $('.bank-detail-name').click(function () {
        // Copy detail to clipboard

        $(this).attr('data-original-title', 'Скопировано').tooltip('show');
        var tempEl = $("<input>");
        $('body').append(tempEl);
        tempEl.val($(this).closest('.bank-detail-item').find('.bank-detail').text().trim()).select();
        document.execCommand("copy");
        tempEl.remove();
    });

    $('.bank-detail-name').mouseleave(function () {
        $(this).attr('data-original-title', 'Скопировать');
    });

    $('.info-plate-footer').click(function (e) {
        // Download pdf document

        e.preventDefault();
        var el = $(this).find('.download-document');
        el.attr('download', '').attr('target', '_blank');
        window.location.href = el.attr('data-source-pdf');
    });

    // Contact form

    $('.form-control').change(function () {
        // Control errors after change form inputs

        if ($(this).hasClass('invalid-input') || $(this).is(':invalid')) {
            $('#' + $(this).attr('data-error-id') + ' span').fadeIn(500);
        } else {
            $('#' + $(this).attr('data-error-id') + ' span').fadeOut(500);
        }
    });

    // Add phone prefix    
    $('#phoneInput').focus(function () {
        if ($(this).val() == '') {
            $(this).val('8-');
        }
    });

    $('#phoneInput').focusout(function () {
        var val = $(this).val();
        if (val == '8-' || !val) {
            if ($(this).hasClass('invalid-input')) {
                $(this).removeClass('invalid-input');
                $('#' + $(this).attr('data-error-id') + ' span').fadeOut(500);
            }
            $(this).val('');
        }
    });

    // Filtering user input for only digits
    $("#phoneInput").on('keypress', function (e) {
        var key = e.keyCode || e.which;
        var currVal = $(this).val();

        if (!(key == '46' || key == '8')) {
            if (isNaN(parseInt(String.fromCharCode(key)))) {
                return false;
            }
            if ($(this).val().length == 1 || $(this).val().length == 5 || $(this).val().length == 9 || $(this).val().length == 12) {
                $(this).val(currVal + '-');
            }
        }
    });

    // Add invalid class to input element
    $("#phoneInput").change(function () {
        var curr_count = $(this).val().length;
        if (curr_count != parseInt($(this).attr('maxlength'))) {
            $(this).addClass('invalid-input');
            $('#' + $(this).attr('data-error-id') + ' span').fadeIn(500);
        } else {
            $(this).removeClass('invalid-input');
            $('#' + $(this).attr('data-error-id') + ' span').fadeOut(500);
        }
    });

    // Clear form fields
    $('.clear-form-btn i').click(function () {
        $('.contact-form-container input').each(function () {
            $(this).val('').removeClass('invalid-input');
        });
        $('#messageTextArea').val('').removeClass('invalid-input');
        $('.error-input-container span').fadeOut(500);
        $('.status-contact-form').text('Для отправки формы заполните обязательные поля и кликните конпку "Оправить".').removeClass('error-form-status');
    });

    // Submit contact form
    $('.submit-form-btn').click(function () {
        var error = false;
        $('.requare-input').each(function () {
            if (!($(this).hasClass('invalid-input') || $(this).is(':invalid') || $(this).val() != '')) {
                error = true;
                $('#' + $(this).attr('data-error-id') + ' span').fadeIn(500);
                setErrorFormStatus(meassge = 'Ошибка валидации. Заполните обязательные поля и повторите попытку.');
            }
        });

        console.log(error);
        if (!error) {
            $('#contactForm').submit();
            // Do something on backend
        }
    });
});
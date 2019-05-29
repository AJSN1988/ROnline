$(document).ready(function () {

    $(function () {
        // Enable b4-tooltip

        $('[data-toggle="tooltip"]').tooltip();
    });

    // Top promo section

    // A ratio need changing if window will resize
    var ratio = parseInt($('.promo').eq(1).css('left')) - parseInt($('.promo').eq(0).css('left'));
    var timer;

    $(window).on('resize', function () {
        // Set ration for top promo elements
        if ($(this).width() >= 992 && $(this).width() < 1199) {
            ratio = 96;
        } else if ($(this).width() >= 768 && $(this).width() < 992) {
            ratio = 72;
        } else {
            ratio = 114;
        }
        clearTimeout(timer);
        timer = setTimeout(function () {
            // Reset all promo inline styles when resizing event has stopped
            $('.promo').attr('style', '').removeClass('active-promo').addClass('covered-promo').find('.promo-label-wrapper').fadeOut();
            $('.promo').last().addClass('active-promo').removeClass('covered-promo').find('.promo-label-wrapper').fadeIn();

        }, 250);
    });

    $('.promo').click(function () {
        if ($(this).hasClass('active-promo')) return false;

        var el = $(this);
        $('.promo').each(function () {
            // Prevent crazy animations effects )
            $(this).stop(true, true);
            // Move left other elements using ratio ratio
            if (parseInt(el.css('left')) < parseInt($(this).css('left'))) {
                $(this).animate({
                    left: parseInt($(this).css('left')) - ratio
                }, 1000);
            }

            if (!(el.attr('data-index') == $(this).attr('data-index'))) {
                // Set correct z-index other elements not include clicked
                var index = parseInt($(this).css('left')) / ratio;
                $(this).css('z-index', index);
                // Add covered class and hide promo label element
                $(this).removeClass('active-promo').addClass('covered-promo').find('.promo-label-wrapper').fadeOut();
            }
        });

        // Move clicked element to right direction
        $(this).css('z-index', '99').addClass('active-promo').animate({
            left: '30%'
        }, 1000).find('.promo-label-wrapper').fadeIn(1000);
    });

    $('.promo-nav-item').click(function () {
        if ($(this).hasClass('active-promo-nav')) return false;

        $('.promo-nav-item').removeClass('active-promo-nav');
        $(this).addClass('active-promo-nav');

        $('.mobile-promo.active-mobile-promo').removeClass('active-mobile-promo').addClass('hidden-mobile-promo');
        $('.mobile-promo[data-id="' + $(this).attr('data-target') + '"]').removeClass('hidden-mobile-promo').addClass('active-mobile-promo');
    });


    // Contacts section

    var getWorkTime = function () {
        // Demo func for calculating company worktime
        var dateObj = new Date();
        var currDay = dateObj.getDay();
        var currHour = dateObj.getHours();
        if (currDay == 0 || currDay == 6) {
            if (currHour < 8 && currHour > 17) {
                return false;
            }
        }
        if (currHour < 8 || currHour > 18) {
            return false;
        }
        return true;
    }

    // Contact events

    // Enable\disable phone calling in worktime
    if (getWorkTime()) {
        $('.contact-info a').find('.offline-phone').hide();
        $('.contact-info a').find('.online-phone').show();

        $('#companyPhone').attr({
            'href': 'tel:+74964558160',
            'title': 'Специалисты онлайн'
        });

        $('#supportPhone').attr({
            'href': 'tel:+74964558105',
            'title': 'Специалисты онлайн'
        });
    } else {
        $('.contact-info a').find('.offline-phone').show();
        $('.contact-info a').find('.online-phone').hide();

        $('#companyPhone, #supportPhone').attr({
            'href': '',
            'title': 'Специалисты оффлайн'
        });
    }

    // Services section

    var timeoutState;
    $('.service-wrapper').hover(function () {
        if ($(this).find('.freeze-wrapper-object').is(':visible')) return false;

        var self = $(this);
        if (!timeoutState) {
            // If delay obj is clear show hidden body
            timeoutState = window.setTimeout(function () {
                timeoutState = null;
                self.find('.service-header').find('.service-logo').animate({
                    fontSize: '20px'
                }, 500);
                self.find('.service-footer .fa-plus-square').hide();
                self.find('.service-footer .fa-minus-square').show();
                self.find('.service-annotation').fadeOut(300);
                self.find('.service-body').delay(400).fadeIn(300);
            }, 1000);
        }
    }, function () {
        if ($(this).find('.freeze-wrapper-object').is(':visible')) return false;

        if (timeoutState) {
            window.clearTimeout(timeoutState);
            timeoutState = null;
        }
        else {
            $(this).find('.service-header').find('.service-logo').animate({
                fontSize: '36px'
            }, 500);
            $(this).find('.service-footer .fa-minus-square').stop(true, true).hide();
            $(this).find('.service-footer .fa-plus-square').stop(true, true).show();
            $(this).find('.service-body').stop(true, true).fadeOut(300);
            $(this).find('.service-annotation').stop(true, true).delay(500).fadeIn(300);
        }
    });
});
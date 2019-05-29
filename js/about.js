$(document).ready(function () {

    //  Facts about us section

    $('.plate-block-footer i').click(function () {
        // Turning company facts plates

        if ($(this).hasClass('disabled-arrow')) return false;

        var plates = $('.plate-block');
        var currPlate = plates.filter(':not(.hidden-plate)');

        if ($(this).attr('data-direction') == 'right') {
            var nextPlate = currPlate.next();

            $('.disabled-arrow').removeClass('disabled-arrow');

            currPlate.addClass('hidden-plate');
            nextPlate.removeClass('hidden-plate');

            if (nextPlate.next().next().length == 0) {
                // Disaable arrow if our target plate is last
                $(this).addClass('disabled-arrow');
            }
        } else if ($(this).attr('data-direction') == 'left') {
            var prev = currPlate.prev();

            $('.disabled-arrow').removeClass('disabled-arrow');

            currPlate.addClass('hidden-plate');
            prev.removeClass('hidden-plate');

            if (prev.prev().prev().prev().length == 0) {
                // Dasable arrow if our target is first
                $(this).addClass('disabled-arrow');
            }
        }
    });

    // Partner carousel

    var partnerCase = $('.partner-section');

    partnerCase.hover(function () {
        // Toggle partner link button

        if ($(window).width() > 1200) {
            $(this).find('.common-btn').slideToggle(300);
        } else if ($(window).width() < 768) {
            $('#partnersCarousel').carousel({
                interval: 500000
            });
        }
        $(this).find('hr').css('background-color', '#FECE1A');

    }, function () {
        if ($(window).width() > 1200) {
            $(this).find('.common-btn').slideToggle(300);
        }
        $(this).find('hr').css('background-color', '#fff');
    }
    );

    // Documents section

    $('.card-header').click(function () {
        var collapse = $(this).parent().find('.collapse');
        if ($(window).width() > 575) {
            $('.mb-0-chevron i').each(function () {
                if ($(this).hasClass('fa-rotate-90')) {
                    $(this).removeClass('fa-rotate-90');
                }
            });
            if (collapse.hasClass('show')) {
                $(this).find('i').toggleClass('fa-rotate-90');
            }
            $(this).find('i').toggleClass('fa-rotate-90');
        } else {
            $('.mb-0-chevron .fa-xm').each(function () {
                if ($(this).find('i').hasClass('fa-minus')) {
                    $(this).html('<i class="fas fa-plus fas-xm"></i>Показать');
                }
            });
            var faSpan = $(this).find('.fa-xm');
            if (collapse.hasClass('show')) {
                faSpan.find('i').hasClass('fa-plus') ? faSpan.html('<i class="fas fa-minus fas-xm"></i>Скрыть') : faSpan.html('<i class="fas fa-plus fas-xm"></i>Показать');
            }
            faSpan.find('i').hasClass('fa-plus') ? faSpan.html('<i class="fas fa-minus fas-xm"></i>Скрыть') : faSpan.html('<i class="fas fa-plus fas-xm"></i>Показать');

        }
    });

    $('.dowmload-document span').click(function (e) {
        // Download document

        e.preventDefault();
        $(this).attr('download', '').attr('target', '_blank');
        window.location.href = $(this).attr('data-source-pdf');
    });
});
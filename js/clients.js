$(document).ready(function () {

// Top label section

    var activeTopLabelID = $('.top-label-navs .active').attr('data-label-id');

    var showTopLabel = function (id) {
        // Show selected top label element

        $('.top-label-header h6[data-label-id="' + id + '"]').show();
        $('.top-label-body[data-label-id="' + id + '"]').show();
        $('.top-label-icons-for-id[data-label-id="' + id + '"]').show();
    }

    var hideTopLabel = function (id) {
        // HIde yop label element

        $('.top-label-header h6[data-label-id="' + id + '"]').hide();
        $('.top-label-body[data-label-id="' + id + '"]').hide();
        $('.top-label-icons-for-id[data-label-id="' + id + '"]').hide();
    }

    var clearMultipageElement = function () {
        // Clear top label element if it has any pages

        $('.top-label-body[data-label-id="' + activeTopLabelID + '"]').find('div').hide();
        $('.top-label-buttons-list .next').show();
        $('.top-label-buttons-list .prev').hide();
    }

    // Events
    
    showTopLabel(id=activeTopLabelID);

    $('.top-label-navs li').click(function () {
        // Select top label element

        clearMultipageElement();
        var currID = $(this).attr('data-label-id');
        hideTopLabel(id=activeTopLabelID);
        showTopLabel(id=currID);
        if ($(this).attr('data-multi-page') == '1') {
            $('.top-label-body[data-label-id="' + currID + '"]').find('div').eq(0).show();
        }
        activeTopLabelID = currID;
        $('.top-label-navs .active').removeClass('active');
        $(this).addClass('active');
    });

    $('.top-label-buttons-list .next, .top-label-buttons-list .prev').click(function () {
        // Turn pages in top label
        
        $('.top-label-body[data-label-id="' + activeTopLabelID + '"]').find('div').eq(0).toggle('slide');
        $('.top-label-body[data-label-id="' + activeTopLabelID + '"]').find('div').eq(1).toggle('slide');
        $('.top-label-buttons-list .next').toggle();
        $('.top-label-buttons-list .prev').toggle();
    });

// Legal helper section

    var activeHelperPageID = $('.legal-helper-navs span').attr('data-helper-id');

    var showLegalHelper = function (id) {
        $('.legal-info[data-helper-id="' + id + '"]').show();
    }

    var hideLegalHelper = function (id) {
        $('.legal-info[data-helper-id="' + id + '"]').hide();
    }

    // Events

    showLegalHelper(activeHelperPageID);

    $('.legal-helper-navs span').click(function () {
        var currID = $(this).attr('data-helper-id');
        hideLegalHelper(id=activeHelperPageID);
        showLegalHelper(id=currID);
        activeHelperPageID = currID;
        $('.active-helper-nav').removeClass();
        $(this).addClass('active-helper-nav');
    });

// Legal information section

    var MAX_SYMBOLS_IN_PAGE = 1900; 

    var currentPagesCount = 0;
    var currentShowedPage = 1;

    var paginateInfoText = function (text, limit) {
        // Slice legal info text on pages using text limit

        var stop = false;
        var pages = {};
        var pageCounter = 0;

        if (text.length > limit) {
            while (!stop) {
                // Slice text until to the end of the sentence using usuall delimeters
                var sentenceDelimeters = ['.', '?', '!'];
                var maxDelimeterIndex = 0;
                for(var i = 0; i < sentenceDelimeters.length; i++) {
                    var index = text.lastIndexOf(sentenceDelimeters[i], limit);
                    maxDelimeterIndex = index > maxDelimeterIndex ? index : maxDelimeterIndex;
                }
                // Add text to page object
                pages[pageCounter] = text.slice(0, maxDelimeterIndex+1);
                pageCounter += 1;
                text = text.slice(maxDelimeterIndex+1);
                
                if (text.length < limit) {
                    pages[pageCounter] = text;
                    stop = true;
                }
            }
        } else {
            pages[0] = text;
        }

        // Create HTML elements with info 
        createInfoPages(pagesObj=pages);

        // Set page count
        currentPagesCount = pageCounter + 1;
    }

    var createInfoLinks = function (links) {
        // Create HTML for info links
        
        var linksObj = links.split('|');
        for (var i = 0; i < linksObj.length; i++) {
            var text = linksObj[i].split(':')[0];
            var href = linksObj[i].split(':')[1];
            $('.legal-links-list').append('<li class="list-inline-item links-item"><a href="' + href + '">' + text + '</a></li>')
        }
    }

    var createInfoPages = function (pagesObj) {
        // Create HTML for legal info
        
        // Disable next navs if we have only 1 page
        if (Object.keys(pagesObj).length == 1) $('.next-btn').addClass('disabled-btn');
        
        for(page in pagesObj) {
            if (page == 0) {
                $('.legal-information-body').append('<div class="legal-page active-legal-page" data-page="' + (+page + 1) + '">' + pagesObj[page].trim() + '</div>');
                continue;
            } 
            $('.legal-information-body').append('<div class="legal-page" data-page="' + (+page + 1) + '">' + pagesObj[page].trim() + '</div>');
        }
    }
    
    var renderLegalInfo = function () {
        // Rendering active legal info on page

        var infoId = $('.active-sidebar-nav').attr('data-target');
        var currentInfoBlock = $('.hidden-legal-information[data-id="' + infoId + '"]');

        // Reset navs and links
        $('.prev-btn').addClass('disabled-btn');
        $('.next-btn').removeClass('disabled-btn');
                
        // Remove showed info elements and links
        if ($('.legal-page').length) {
            $('.legal-page').remove();
        }
        $('.legal-links-list li').remove();

        $('.legal-information-header span').text(currentInfoBlock.attr('data-header'));
        
        paginateInfoText(text=currentInfoBlock.text(), limit=MAX_SYMBOLS_IN_PAGE);

        createInfoLinks(links=currentInfoBlock.attr('data-links'));

        currentShowedPage = 1;        
    }

    var turnPage = function (toPage) {
        // Nav to specified page
        $('.legal-page[data-page="' + currentShowedPage + '"]').removeClass('active-legal-page');
        $('.legal-page[data-page="' + toPage + '"]').addClass('active-legal-page');

        currentShowedPage = toPage;
    }

    // Events

    renderLegalInfo();

    $('.sidebar-nav').click(function () {
        if (!$(this).hasClass('active-sidebar-nav')) {
            $('.active-sidebar-nav').removeClass('active-sidebar-nav');
            $(this).addClass('active-sidebar-nav');
            
            renderLegalInfo();
        }
    });

    $('.next-btn').click(function () {        
        if ($(this).hasClass('disabled-btn')) return false;  
        if ($('.prev-btn').hasClass('disabled-btn')) $('.prev-btn').removeClass('disabled-btn');     
        var nextPage = currentShowedPage + 1;
        turnPage(toPage=nextPage);
        if (currentPagesCount == currentShowedPage) $(this).addClass('disabled-btn');
    });

    $('.prev-btn').click(function () {        
        if ($(this).hasClass('disabled-btn')) return false;
        if ($('.next-btn').hasClass('disabled-btn')) $('.next-btn').removeClass('disabled-btn');
        var prevPage = currentShowedPage - 1;
        turnPage(toPage=prevPage);
        if (currentShowedPage == 1) $(this).addClass('disabled-btn');
    });
});
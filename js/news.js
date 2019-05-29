$(document).ready(function () {
    // Hot news carousel

    var tagsList = $('.hot-tags-list');
    var firstHotNewsDescription = $('.hot-news-description span').eq(0);
    var hotNewsPreviews = $('.hot-news-preview');
    var carousel = $('#hotNewsCarousel');

    var setCarouselTags = function (allTags) {
        // Sets list of tags 

        tagsList.find('li').each(function () {
            if (!$(this).hasClass('tags-header')) {
                $(this).remove();
            }
        });

        $.each(allTags, function (k, v) {
            tagsList.append('<li class="list-inline-item"><span class="news-tag">#' + v + '</span></li>');
        });
        $('.hot-tags-list li').css('margin-right', '11px');
    }

    // Events   

    hotNewsPreviews.each(function () {
        // Reduce hot news text for hot preview (1000 symbols)

        var limit = 1000;

        if ($(this).find('.hot-news-data-text').text().length > limit) {
            var allText = $(this).find('.hot-news-data-text').text();
            $(this).find('.hot-news-body p').text(allText.slice(0, 998) + '...');
        }
    });

    setCarouselTags(allTags = firstHotNewsDescription.attr('data-tags').split('|'));

    $('.hot-news-description span').click(function () {
        // Select news preview in hot news list

        var tags = $(this).attr('data-tags').split('|');
        var newsId = $(this).attr('data-target-hot-news');

        if ($(this).hasClass('active-hot-news')) {
            return false;
        } else {
            $('.hot-news-description span').each(function () {
                if ($(this).hasClass('active-hot-news')) {
                    $(this).removeClass('active-hot-news');
                }
            });
            $(this).addClass('active-hot-news');
        }

        setCarouselTags(allTags = tags);

        hotNewsPreviews.each(function () {
            if ($(this).hasClass('active-hot-news-preview') && newsId == $(this).attr('data-hot-news-id')) {
                return false;
            } else {
                $(this).removeClass('active-hot-news-preview').addClass('hidden-hot-news-preview');
            }

            if ($(this).attr('data-hot-news-id') == newsId) {
                $(this).addClass('active-hot-news-preview').removeClass('hidden-hot-news-preview');
            }
        });
    });

    $('.carousel-nav-right').click(function () {
        carousel.carousel('next');
    });

    $('.carousel-nav-left').click(function () {
        carousel.carousel('prev');
    });

    carousel.on('slid.bs.carousel', function () {
        var el = $('.carousel-inner .active');
        var tags = el.find('.hot-news-description').eq(1).find('span').attr('data-tags').split('|')
        var tagsList = el.find('.hot-tags-list');
        var newsPreview = el.find('.hot-news-preview').eq(0);

        tagsList.find('li').each(function () {
            if (!$(this).hasClass('tags-header')) {
                $(this).remove();
            }
        });

        $.each(tags, function (k, v) {
            tagsList.append('<li class="list-inline-item"><span class="news-tag">#' + v + '</span></li>');
        });
        $('.hot-tags-list li').css('margin-right', '11px');

        hotNewsPreviews.each(function () {
            if ($(this).hasClass('active-hot-news-preview')) {
                $(this).removeClass('active-hot-news-preview').addClass('hidden-hot-news-preview');
            }
        });
        newsPreview.removeClass('hidden-hot-news-preview').addClass('active-hot-news-preview');

        el.find('.hot-news-description span').eq(0).addClass('active-hot-news');
    });

    // News navigation

    var anchor = $('#anchorForNewsNav');
    var newsTopNavbar = $('.company-news-nav-container');
    var mobileNewsTopNavber = $('.mobile-company-news-container');
    var newsNavListItems = $('.company-news-nav-list');

    // Events

    $("body").on('scroll', function () {
        // Fix news nav on top screen position

        var position = anchor.position();
        var top = position.top;
        var width = anchor.css('width').slice(0, -2);

        if (+width >= 690) {
            if (top <= 60) {
                newsTopNavbar.addClass('fixed-news-nav');
                newsNavListItems.addClass('fixed-news-list');
            } else {
                newsTopNavbar.removeClass('fixed-news-nav');
                newsNavListItems.removeClass('fixed-news-list');
            }
        }
        else {
            if (top <= 60) {
                mobileNewsTopNavber.addClass('fixed-mobile-news-nav');
            } else {
                mobileNewsTopNavber.removeClass('fixed-mobile-news-nav');
            }
        }
    });

    // News section

    var activeNewsContainer = $('.active-news-container');
    var allNewsItems = $('.news-item');
    var news = $('.news-body span');
    var pagesLinks = null;
    var currentPage = 1;
    var pages = null;
    var newsPerOnePage = 6;

    var changeSocialLabelInNewsFooter = function () {
        // Change news footer if screen width too small

        if ($(window).width() <= 480) {
            $('.social-items-list span').each(function () {
                $(this).text('Комментировать : ');
            });
        } else {
            $('.social-items-list span').each(function () {
                $(this).text('Комментируйте в социальных сетях : ');
            });
        }
    }

    var generateTagsList = function () {
        // Create list of news tags

        var listHeader = $('.tags-list');
        var tags = [];
        allNewsItems.each(function () {
            splitedTags = $(this).attr('data-tags').split('|');
            tags = tags.concat(splitedTags.filter(function (el) {
                return tags.indexOf(el) === -1;
            }));
        });

        $.each(tags, function (k, v) {
            listHeader.append('<li class="list-inline-item"><span class="news-tag">' + v + '</span></li>');
        });
    }

    // Pagination common functions

    var shareNewsOnPages = function (allNews, newsPerPage, filter) {
        // Separate all news in pages

        if (filter == 'none') {
            var pagesCount = Math.ceil(allNews.length / newsPerPage);
            pages = pagesCount;

            for (var i = pagesCount; i >= 1; i--) {
                if (i == 1) {
                    $('.to-left-page').after('<li class="list-inline-item news-page current-page"><a href="javascript:void(0)">' + i + '</a></li>');
                } else {
                    $('.to-left-page').after('<li class="list-inline-item news-page"><a href="javascript:void(0)">' + i + '</a></li>');
                }
            }

            pagesLinks = $('.news-page a');
            var pageAttr = 0;

            allNews.each(function (k, v) {
                if (k % newsPerOnePage == 0) {
                    pageAttr += 1;
                }
                v.setAttribute('page', pageAttr.toString());
            });
            detectSidePage();
            showNewsInPage();
        } else {
            var filtredNews = null;
            var pagesCount = 0;
            if (filter == 'Все') {
                filtredNews = $('.news-item');
            } else if (filter[0] == '#') {
                filtredNews = $('.news-item').filter(function () {
                    return $(this).attr('data-tags').indexOf(filter) != -1;
                });
            } else {
                filtredNews = $('.news-item[category="' + filter + '"]');
            }

            pagesCount = Math.ceil(filtredNews.length / newsPerPage);
            pages = pagesCount;

            var currPageItems = $('.news-page');

            if (currPageItems.length != 0) {
                currPageItems.remove();
            }

            for (var i = pagesCount; i >= 1; i--) {
                if (i == 1) {
                    $('.to-left-page').after('<li class="list-inline-item news-page current-page"><a href="javascript:void(0)">' + i + '</a></li>');
                } else {
                    $('.to-left-page').after('<li class="list-inline-item news-page"><a href="javascript:void(0)">' + i + '</a></li>');
                }
            }

            pagesLinks = $('.news-page a');
            var pageAttr = 0;

            allNews.hide().removeAttr('page');
            filtredNews.show();

            filtredNews.each(function (k, v) {
                if (k % newsPerOnePage == 0) {
                    pageAttr += 1;
                }
                v.setAttribute('page', pageAttr.toString());
            });
            currentPage = 1;

            detectSidePage();
            showNewsInPage();
        }
    }

    var showNewsInPage = function (page) {
        // Render news in page and hide others

        page = page || 1;
        allNewsItems.each(function (k, v) {
            if (v.getAttribute('page') != page.toString()) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    }

    var detectSidePage = function () {
        // Detect first or last page and enable\disable binding nav element

        if (currentPage == 1 && pages == 1) {
            $('.to-first-page, .to-left-page, .to-last-page, .to-right-page').addClass('disable-page-nav');
        } else if (currentPage == 1) {
            if ($('.to-last-page').hasClass('disable-page-nav')) {
                $('.to-last-page, .to-right-page').removeClass('disable-page-nav');
            }
            $('.to-first-page, .to-left-page').addClass('disable-page-nav');
        } else if (currentPage == pages) {
            $('.to-last-page, .to-right-page').addClass('disable-page-nav');
            if ($('.to-first-page').hasClass('disable-page-nav')) {
                $('.to-first-page, .to-left-page').removeClass('disable-page-nav');
            }
        } else {
            $('.disable-page-nav').each(function () {
                $(this).removeClass('disable-page-nav');
            });
        }
    }

    var turnPage = function (direction) {
        // Go to page left\rigth or first\last

        var destPage = null;

        if (direction == 'right') {
            currentPage += 1;
            destPage = $('.current-page').next();

        } else if (direction == 'left') {
            currentPage -= 1;
            destPage = $('.current-page').prev();
        } else if (direction == 'first') {
            currentPage = 1;
            destPage = $('.news-page').eq(0);
        } else if (direction == 'last') {
            currentPage = pagesLinks.length;
            destPage = $('.news-page').last();
        }
        showNewsInPage(page = currentPage);
        $('.current-page').removeClass('current-page');

        destPage.addClass('current-page');
        detectSidePage();
    }

    function showActiveNews(date, header, text, images, files, links) {
        // Show selected news and scrooll to it


        $('.active-news-date').text(date);
        $('.active-news-header span').text(header);
        $('.active-news-body').text(text);

        // Show attached images
        if (images[0]) {
            $('.active-news-images').show();
            // Clear prev images
            $('.mCSB_horizontal .mCSB_container').find('li').remove();
            // Reset scrollBar
            $('.news-images-list').mCustomScrollbar("destroy").removeClass('mCS_destroyed').mCustomScrollbar({
                axis: 'x',
                theme: 'dark'
            });
            // Add images
            $.each(images, function (k, v) {
                $('.mCSB_horizontal .mCSB_container').append('<li class="list-inline-item"><img src="static/img/' + v + '" width="100" height="60"></li>');
            });
            // Select all active images
            // activeNewsImageItems = $('.news-images-list img');            
        } else {
            $('.active-news-images').hide();
        }

        // Show attached files
        if (files[0]) {
            $('.active-news-files').show();
            // Clear prev files
            $('.news-files-list li').remove();
            //Add files
            $.each(files, function (k, v) {
                $('.news-files-list').append('<li class="list-inline-item news-file-item" data-source="static/files/' + v + '"><i class="fas fa-paperclip" title="Загрузить файл"></i><span>' + v + '</span></li>');
            });
        } else {
            $('.active-news-files').hide();
        }

        // Show attached links
        if (links[0]) {
            $('.active-news-links').show();
            // Clear links list
            $('.news-links-list li').remove();
            // Add links
            $.each(links, function (k, v) {
                var href = v.split('#')[0];
                var label = v.split('#')[1];
                $('.news-links-list').append('<li class="list-inline-item news-links-item"><a href="' + href + '">' + label + '</a></li>');
            });
        } else {
            $('.active-news-links').hide();
        }


        var activeNewsPosition;
        if (!activeNewsContainer.is(':visible')) {
            activeNewsContainer.slideDown(400);
            activeNewsPosition = $('.active-news-container')[0].offsetTop - 60;
        } else {
            // Offset visible active news container on 20 px
            activeNewsPosition = $('.active-news-container')[0].offsetTop - 80;
        }

        $('body').stop().animate({ scrollTop: activeNewsPosition }, 500, 'swing');
    }

    // Events    

    $('.news-images-list').mCustomScrollbar({
        // Horizontal scroller in active news image container. Used just for fun. If you want you can use baron.js

        axis: 'x',
        theme: 'dark'
    });

    changeSocialLabelInNewsFooter();

    generateTagsList();

    news.each(function () {
        // Reduce news text for preview (500 symbols)

        var limit = 500;

        if ($(this).closest('.news').find('.news-data-text').text().length > limit) {
            var allText = $(this).closest('.news').find('.news-data-text').text();
            $(this).text(allText.slice(0, 498) + '...');
        }
    });

    $(window).resize(function () {
        changeSocialLabelInNewsFooter();
    });

    $('.read-news-btn').click(function () {
        // Show news selected from hot news preview 

        var hotNewsDate = $(this).closest('.hot-news-preview').attr('data-date');
        var hotNewsHeader = $(this).closest('.hot-news-preview').find('h5').text();
        var hotNewsDataText = $(this).closest('.hot-news-preview').find('.hot-news-data-text').text();
        var hotNewsDataImages = $(this).closest('.hot-news-preview').find('.hot-news-data-img').attr('data-images').split('|');

        var hotNewsDataFiles = $(this).closest('.hot-news-preview').find('.hot-news-data-files').attr('data-files').split('|');
        var hotNewsDataLinks = $(this).closest('.hot-news-preview').find('.hot-news-data-links').attr('data-links').split('|');

        showActiveNews(date = hotNewsDate, header = hotNewsHeader, text = hotNewsDataText, images = hotNewsDataImages, files = hotNewsDataFiles, links = hotNewsDataLinks);
    });

    $('.read-news').click(function () {
        // Read news

        var newsDate = $(this).closest('.news-item').attr('data-date');
        var newsHeader = $(this).closest('.news-item').find('.news-header span').html();
        var newsDataText = $(this).closest('.news-item').find('.news-data-text').text();
        var newsDataImages = $(this).closest('.news-item').find('.news-data-img').attr('data-images').split('|');
        var newsDataFiles = $(this).closest('.news-item').find('.news-data-files').attr('data-files').split('|');
        var newsDataLinks = $(this).closest('.news-item').find('.news-data-links').attr('data-links').split('|');

        showActiveNews(date = newsDate, header = newsHeader, text = newsDataText, images = newsDataImages, files = newsDataFiles, links = newsDataLinks);
    });

    $('.active-news-header i, .mobile-active-news-close').click(function () {
        activeNewsContainer.slideUp(500);
    });

    $(".news-images-list").on("click", "img", function () {
        // Show image modal 

        var splitedPath = $(this).attr('src').split('/');
        var imageName = splitedPath[splitedPath.length - 1];

        $('.image-modal-title').text('Изображение (' + imageName + ')');
        $('.modal-body img').attr('src', $(this).attr('src'));
        $('#imageModal').modal();
    });

    $('.news-files-list').on('click', 'li', function (e) {
        // Download active news files

        e.preventDefault();
        $(this).attr('download', '').attr('target', '_blank');
        window.location.href = $(this).attr('data-source');
    });

    // News pagination

    shareNewsOnPages(allNews = allNewsItems, newsPerOnePage = newsPerOnePage, filter = 'none');

    $('.view-type-nav-menu-dropdown a').click(function () {
        // Get news sorted by date on a serverside

        $('.view-type-nav-menu-dropdown a').removeClass('active-news-date-filter');
        $(this).addClass('active-news-date-filter');
        // Do something on a backend )
    });

    $('.pagination-list').on("click", '.news-page a', function () {
        // Go to specified page (1,2,etc)

        if (!$(this).parent().hasClass('current-page')) {
            currentPage = +$(this).text();
            showNewsInPage(currentPage);
            $('.current-page').removeClass('current-page');
            $(this).parent().addClass('current-page');
            detectSidePage();
        }
    });

    $('.to-left-page a').click(function () {
        if (currentPage != 1) {
            turnPage(direction = 'left');
        }
    });

    $('.to-right-page a').click(function () {
        if (currentPage != pages) {
            turnPage(direction = 'right');
        }
    });

    $('.to-first-page').click(function () {
        turnPage(direction = 'first');
    });

    $('.to-last-page').click(function () {
        turnPage(direction = 'last');
    });

    $('.news-category a').click(function () {
        // Filtering shoed news by catehory in news body

        var category = $(this).text();
        $('.news-category-selector').removeClass('active-news-category').each(function () {
            if ($(this).text().trim() == category) {
                $(this).addClass('active-news-category');
            }
        });
        $('.tags-list span').removeClass('active-news-tag');
        shareNewsOnPages(allNews = allNewsItems, newsPerOnePage = newsPerOnePage, filter = $(this).text());
    });

    $('.mobile-news-category-item').click(function () {
        // Filtering showed news by category on a small screnn devices

        var category = $(this).text();
        $('.mobile-news-category-item').removeClass('active-mobile-news-category').each(function () {
            if ($(this).text().trim() == category) {
                $(this).addClass('active-mobile-news-category');
            }
        });
        $('.tags-list span').removeClass('active-news-tag');
        shareNewsOnPages(allNews = allNewsItems, newsPerOnePage = newsPerOnePage, filter = $(this).text());
    })

    $('.all-news-tags-list a').click(function () {
        // Filtering news by tags

        var tagText = $(this).text();
        $('.news-category-selector').removeClass('active-news-category');
        $('.tags-list span').removeClass('active-news-tag').each(function () {
            if ($(this).text() == tagText) {
                $(this).addClass('active-news-tag');
            }

        });
        shareNewsOnPages(allNews = allNewsItems, newsPerOnePage = newsPerOnePage, filter = $(this).text().trim());
    });

    $(".hot-tags-list").on("click", ".news-tag", function () {
        // Filtering news by tags from hot news preview

        var tagText = $(this).text();
        $('.news-category-selector').removeClass('active-news-category');
        $('.tags-list span').removeClass('active-news-tag').each(function () {
            if ($(this).text() == tagText) {
                $(this).addClass('active-news-tag');
            }
        });
        shareNewsOnPages(allNews = allNewsItems, newsPerOnePage = newsPerOnePage, filter = $(this).text().trim());
    });

    $(".mobile-search-news-menu-dropdown").on("click", ".news-tag", function () {
        // Filtering news by tags on a small screen devices

        var tagText = $(this).text();
        $('.mobile-news-category-item').removeClass('active-mobile-news-category');
        $('.tags-list span').removeClass('active-news-tag').each(function () {
            if ($(this).text() == tagText) {
                $(this).addClass('active-news-tag');
            }
        });
        shareNewsOnPages(allNews = allNewsItems, newsPerOnePage = newsPerOnePage, filter = $(this).text().trim());
    });

    $('.news-category-selector').click(function () {
        // Filtering news by category by cateories list

        $('.news-category-selector').removeClass('active-news-category');
        $('.tags-list span').removeClass('active-news-tag');
        $(this).addClass('active-news-category');
        shareNewsOnPages(allNews = allNewsItems, newsPerOnePage = newsPerOnePage, filter = $(this).text().trim());
    });

    // Subscribe news section

    var subscribe_error = $('.subscribe-error-msg');

    var validateClientEmail = function ($email) {
        // Validate email pattern

        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailReg.test($email);
    }

    // Events

    $('#subscribeBtn').click(function () {
        // Validate and send subscribe form

        if ($('#confirmPDNCheckbox').is(':checked')) {
            // Need accept terms in modal text
            if (!validateClientEmail($('#emailInput').val()) || $('#emailInput').val() == '') {
                subscribe_error.show(700).delay(2000).hide(700);
            } else {
                console.log('SUCCESS SUBSCRIBE');
                // Add subscribe logic below
            }
        } else {
            $('#PDNTextModal').modal('toggle');
        }
    });

    $('#confirmPDNTextModal').click(function () {
        // Accept terms in modal

        if (!$('#confirmPDNCheckbox').is(':checked')) {
            $('#confirmPDNCheckbox').prop("checked", true);
            $('#PDNTextModal').modal('toggle');
        }
    });
});
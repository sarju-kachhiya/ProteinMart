var $ = jQuery.noConflict();
$(document).ready(function() {
    $(function() {
        $(".close-icon").hide();
        $('ul.menu > li:has(.sub-menu)').addClass('hassub');
        $('.menu li:has(.sub-menu) li ul').addClass('hassub-child');
        $(".menu").on("mouseenter", "li:not(li li)", function(e) {
            $(this).find(".sub-menu > li").first().addClass("active");
        });
        $("#u_0_0").css("width", "100%");
    });
    $(".sub-menu > li").on("mouseover", function() {
        $("li").removeClass("active");
        $(this).addClass("active");
    });
    $(".toggler").click(function(e) {
        e.preventDefault();
        $(".menu-content-list>div").addClass("visible");
        $(".close-icon").show();
        $("body").addClass("no-scrolling");
        $('.menu li li ul').parent().addClass('hasSubChild');
        $(".list-view ul li:not(li li):nth-child(2)").addClass('selected');
    });
    $(".close-icon").click(function(e) {
        $(".menu-content-list>div").removeClass("visible");
        $(".close-icon").hide();
        $("body").removeClass("no-scrolling");
    });
    if ($(window).width() < 992) {
        $("ul.menu li:not(li li)").click(function(e) {
            $("ul.menu > li").removeClass('selected');
            $(this).toggleClass('selected');
        });
    }
    $(window).on("scroll", function() {
        if ($(window).scrollTop() > 50) {
            $("#site-header").addClass("headerScroll");
            $("#site-navigation").addClass("headerScroll");
        } else {
            $("#site-header").removeClass("headerScroll");
            $("#site-navigation").removeClass("headerScroll");
        }
    });
    $('.slider').slick({
        lazyLoad: 'ondemand',
        autoplay: true,
        draggable: true,
        arrows: true,
        dots: true,
        fade: true,
        speed: 900,
        infinite: true,
        cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
        touchThreshold: 100
    });
    $(".category-buttons-single").click(function() {
        var button = $(this);
        if (!button.hasClass('category-buttons-single-active')) {
            $.ajax({
                url: ajax_params.url,
                data: {
                    'action': 'fetch_category_articles',
                    'category_id': $(this).data('val'),
                    'type': $(this).data('type'),
                },
                type: 'POST',
                beforeSend: function(xhr) {
                    $(".explore-articles").css('visibility', 'hidden');
                    $(".explore-articles-loader").addClass("d-block").removeClass("d-none");
                },
                success: function(data) {
                    $(".category_articles_container").html('');
                    $(".explore-articles-loader").addClass("d-none").removeClass("d-block");
                    if (data) {
                        $(".category_articles_container").html(data);
                        $(".explore-articles-slider").slick({
                            infinite: true,
                            prevArrow: '<button class="slide-arrow next-arrow"><i class="fa fa-arrow-left"></i></button>',
                            nextArrow: '<button class="slide-arrow prev-arrow"><i class="fa fa-arrow-right"></i></button>',
                            dots: false,
                            speed: 900,
                            slidesToShow: 2,
                            slidesToScroll: 2,
                            mobileFirst: true,
                            responsive: [{
                                breakpoint: 769,
                                settings: 'unslick'
                            }]
                        });
                        $(".category-buttons-single").removeClass("category-buttons-single-active");
                        button.addClass("category-buttons-single-active");
                    }
                }
            });
        }
    })
    $(".nested-section-chips .single-chip").click(function() {
        var button = $(this);
        $.ajax({
            url: ajax_params.url,
            data: {
                'action': 'fetch_category_alphaposts',
                'posts_letter': $(this).data('value'),
                'cat': $(".nested-section-posts").data('cat'),
            },
            type: 'POST',
            beforeSend: function(xhr) {
                $(".nested-section-posts-wrapper").fadeTo(200, 0, function() {
                    $(this).css("visibility", "hidden");
                    $(".nested-section-posts-loader").addClass("d-block").removeClass("d-none");
                });
            },
            success: function(data) {
                $(".nested-section-posts-wrapper").html('');
                if (data) {
                    $(".nested-section-posts-loader").addClass("d-none").removeClass("d-block");
                    $(".nested-section-posts-wrapper").fadeTo(200, 1, function() {
                        $(".nested-section-posts-loader").addClass("d-none").removeClass("d-block");
                        $(this).css("visibility", "visible");
                    });
                    $(".nested-section-posts-wrapper").html(data);
                    $(".nested-section-chips .single-chip").removeClass("active");
                    button.addClass("active");
                }
            }
        });
    })
    $(window).scroll(function() {
        if ($(".nested-section-chips").length && $(window).width() < 1024) {
            if (isScrolledIntoView(".nested-section-posts")) {
                $(".nested-section-chips").css("display", "flex");
            } else {
                $(".nested-section-chips").css("display", "none");
            }
        }
        if ($(".category-list-view").length && $(window).width() < 767 && ($(window).scrollTop() > $(".category-list-view .category-post-row .recent-post:last").position().top) && canBeLoaded == true) {
            canBeLoaded = false;
            var url = new URL(window.location.href);
            var page = url.searchParams.get("page");
            page = parseInt(page) + 1;
            get_category_posts(page, false);
        }
    });
    if ($(".category-list-view").length && $(window).width() < 767) {
        var url = new URL(window.location.href);
        var page = url.searchParams.get("page");
        if (page) {
            get_category_posts(page);
        } else {
            get_category_posts(1);
        }
    }
    $(".widget_media_image a").click(function(e) {
        e.preventDefault();
        window.open($(this).attr('href'), '_blank');
    });
    $(".nested-section-subcategory-content").slick({
        draggable: true,
        arrows: true,
        dots: false,
        speed: 900,
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
            }
        }, {
            breakpoint: 767,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerMode: true,
                centerPadding: '30px'
            }
        }]
    });
    $('.nested-section-subcategory-content').on('afterChange', function(event, slick, currentSlide) {
        var total = $(this).find(".recent-post").length;
        if (total - currentSlide <= 4) {
            $(this).find('.slick-next').hide();
        } else {
            $(this).find('.slick-next').show();
        }
        if (currentSlide < 4) {
            $(this).find('.slick-prev').hide();
        } else {
            $(this).find('.slick-prev').show();
        }
    });
    $('.nested-section-subcategory-content .slick-prev').hide();
    $("#searchBtn").click(function() {
        $("#searchform").submit();
    });
    $("#searchform").on('submit', function(e) {
        e.preventDefault();
        window.location = $("#searchform").attr('action') + '/' + $("#searchform #search").val().replace(/ /g, '+');
    });
    $(".read-these-next-content").slick({
        draggable: true,
        arrows: true,
        dots: false,
        speed: 900,
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
            }
        }, {
            breakpoint: 767,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerMode: true,
                centerPadding: '30px'
            }
        }]
    });
    $('.read-these-next-content').on('afterChange', function(event, slick, currentSlide) {
        var total = $(this).find(".recent-post").length;
        if (total - currentSlide <= 4) {
            $(this).find('.slick-next').hide();
        } else {
            $(this).find('.slick-next').show();
        }
        if (currentSlide < 4) {
            $(this).find('.slick-prev').hide();
        } else {
            $(this).find('.slick-prev').show();
        }
    });
    $('.read-these-next-content .slick-prev').hide();
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });
    $('#back-to-top').click(function() {
        $('body,html').animate({
            scrollTop: 0
        }, 400);
        return false;
    });
});
let canBeLoaded = true;

function get_category_posts(category_page, remove_posts = false) {
    var url = new URL(window.location.href);
    var data = {
        'action': 'fetch_category_page_articles',
        'page': category_page,
        'category': $(".category-list-view").data('category'),
        'type': $(".category-list-view").data('type'),
        'taxonomy': $(".category-list-view").data('taxonomy'),
        'taxtype': $(".category-list-view").data('taxtype'),
        'search': $("#search").val(),
    };
    $.ajax({
        url: ajax_params.url,
        data: data,
        type: 'POST',
        beforeSend: function(xhr) {
            $('.category-list-view .category-loader').addClass("d-flex").removeClass("d-none");
            setParam('page', category_page);
        },
        success: function(data) {
            if (remove_posts) {
                $(".recent-post:first")
                $(".category-list-view").html('');
                $(".category-loader").addClass("d-none").removeClass("d-block");
            } else {
                $(".category-filler").parent().remove();
                $(".category-loader").remove();
            }
            if (data) {
                $('.category-list-view').append(data);
                canBeLoaded = true;
                category_page++;
                if (remove_posts) {
                    $([document.documentElement, document.body]).animate({
                        scrollTop: $(".category-list-view").offset().top
                    }, 1000);
                }
            }
        }
    });
}

function setParam(param, mode = '') {
    var url = new URL(location.href);
    if (mode) {
        url.searchParams.set(param, mode);
    } else {
        url.searchParams.delete(param);
    }
    url.search = url.searchParams.toString();
    var new_url = url.toString();
    window.history.pushState('page2', 'Title', new_url);
}

function getPageList(totalPages, page, maxLength) {
    page = parseInt(page);
    if (maxLength < 5) throw "maxLength must be at least 5";

    function range(start, end) {
        return Array.from(Array(end - start + 1), (_, i) => i + start);
    }
    var sideWidth = maxLength < 9 ? 1 : 2;
    var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    var rightWidth = (maxLength - sideWidth * 2 - 2) >> 1;
    if (totalPages <= maxLength) {
        return range(1, totalPages);
    }
    if (page <= maxLength - sideWidth - 1 - rightWidth) {
        return range(1, maxLength - sideWidth - 1).concat([0]).concat(range(totalPages - sideWidth + 1, totalPages));
    }
    if (page >= totalPages - sideWidth - 1 - rightWidth) {
        return range(1, sideWidth).concat([0]).concat(range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
    }
    return range(1, sideWidth).concat([0]).concat(range(page - leftWidth, page + rightWidth)).concat([0]).concat(range(totalPages - sideWidth + 1, totalPages));
}

function isScrolledIntoView(elem) {
    var scrollTop = $(window).scrollTop();
    var scrollBottom = $(window).scrollTop() + $(window).height();
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    return ((elemTop - $(window).height() + 100 < scrollTop) && (elemBottom + $(window).height() > scrollBottom));
}
$(function() {
    var numberOfItems = $(".category-list-view").data('count');
    var limitPerPage = 24;
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    var paginationSize = 7;
    var currentPage;

    function showPage(whichPage) {
        $(".category-loader").addClass("d-block").removeClass("d-none");
        if (whichPage < 1 || whichPage > totalPages) return false;
        currentPage = whichPage;
        $(".category-list-view .category-post-row").css('visibility', 'hidden');
        $(".pagination li").slice(1, -1).remove();
        if (whichPage == 1) {
            $("#previous-page").addClass("disabled");
        } else {
            $("#previous-page").removeClass("disabled");
        }
        if (whichPage == totalPages) {
            $("#next-page").addClass("disabled");
        } else {
            $("#next-page").removeClass("disabled");
        }
        getPageList(totalPages, currentPage, paginationSize).forEach(item => {
            $("<li>").addClass("page-item " +
                (item ? "current-page " : "") +
                (item === currentPage ? "active " : "")).attr('data-page', item).append($("<a>").addClass("page-link").attr({
                href: "javascript:void(0)"
            }).text(item || "...")).insertBefore("#next-page");
        });
        get_category_posts(whichPage, true);
        return true;
    }
    if ($(".category-list-view").length && $(window).width() > 767) {
        var url = new URL(window.location.href);
        var page = url.searchParams.get("page");
        currentPage = page;
        if (!$(".pagination li[data-page='" + page + "']").hasClass('active')) {
            $(".pagination li[data-page='" + page + "']").addClass('active');
        }
    }
    $(document).on("click", ".pagination li.current-page:not(.active)", function(e) {
        e.preventDefault();
        return showPage(+$(this).text());
    });
    $(document).on("click", ".pagination #next-page:not(.disabled)", function(e) {
        e.preventDefault();
        return showPage(currentPage + 1);
    });
    $(document).on("click", ".pagination #previous-page:not(.disabled)", function(e) {
        e.preventDefault();
        return showPage(currentPage - 1);
    });
});
$(document).ready(function() {
    $(".blog_featured_img img").click(function() {
        $(".popupOverlay").css("display", "flex");
    });
    $(".popupOverlay").click(function() {
        $(this).css("display", "none");
    });
});
$(function() {
    $(".explore-articles-slider").slick({
        infinite: true,
        prevArrow: '<button class="slide-arrow next-arrow"><i class="fa fa-arrow-left"></i></button>',
        nextArrow: '<button class="slide-arrow prev-arrow"><i class="fa fa-arrow-right"></i></button>',
        dots: false,
        speed: 900,
        slidesToShow: 2,
        slidesToScroll: 2,
        mobileFirst: true,
        responsive: [{
            breakpoint: 769,
            settings: 'unslick'
        }]
    });
    $(".explore-cat-slider").slick({
        prevArrow: '<button class="slide-arrow next-arrow"><i class="fa fa-arrow-left"></i></button>',
        nextArrow: '<button class="slide-arrow prev-arrow"><i class="fa fa-arrow-right"></i></button>',
        dots: false,
        speed: 300,
        infinite: true,
        cssEase: 'linear',
        variableWidth: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        centerPadding: '30px',
    });
});
$(document).ready(function() {
    $(window).on('resize', function() {
        $('.explore-articles-slider').slick('resize');
    });
});
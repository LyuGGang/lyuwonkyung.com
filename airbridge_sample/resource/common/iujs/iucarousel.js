function reloadCarousel(carousel) {
    destroyCarousel(carousel);
    initCarousel(carousel);
}

function initCarousel(carousel) {

    var isLoaded = $(carousel).data('isLoaded');
    if (isLoaded) {
        return;
    }

    //balance between items and pagers
    var wrapper = $(carousel).find('.IUCarousel-wrapper');
    var count = $(wrapper).children().length;

    //handling pager
    var pager = $(carousel).find('.IUCarousel-Pager');
    var pagerCount = $(pager).children().length;
    //count of pagers is not equal to the number of items
    if (count != pagerCount) {
        if (pagerCount > count) {
            //remove redundant pagers
            pager.children().slice(count, pagerCount).remove();
        } else {
            //add pagers
            for (var i = 0; i < count - pagerCount; i++) {
                pager.append($('<li></li>'));
            }

        }
    };
    if (count < 2) {
        //if the number of items < 2, not working in carousel
        //just put on, and hide control of carousel
        $(carousel).children().not(wrapper).css('display', 'none');
        return;
    }

    //set carousel loaded
    $(carousel).data('isLoaded', true);


    //copy first & last Obj
    var firstObj = $($(wrapper).children()[0]).clone(true);
    firstObj.addClass('carousel_copy');

    var lastObj = $($(wrapper).children()[count - 1]).clone(true);
    lastObj.addClass('carousel_copy');

    //insert copy objects
    $(firstObj).insertAfter($($(wrapper).children()[count - 1]));
    $(lastObj).insertBefore($($(wrapper).children()[0]));

    //set position
    var width = 100 * (count + 2);
    window.requestAnimFrame(function() {
        $(wrapper)[0].style.width = width + '%';
    });

    var childrenWidth = 100 / (count + 2);
    $(wrapper).children().each(function() {
        var child = $(this)[0];
        window.requestAnimFrame(function() {
            child.style.width = childrenWidth + '%';
        });

    });

    $(carousel).data('index', 1);
    var left = 100 * -1;
    $(wrapper)[0].style.left = left + '%';

    //click binding
    $(carousel).find('.IUCarousel-Prev').click(function() {
        pauseCarousel(false);
        prevCarousel(carousel);
        restartCarousel(false);
    });

    $(carousel).find('.IUCarousel-Next').click(function() {
        pauseCarousel(false);
        nextCarousel(carousel);
        restartCarousel(false);
    });

    /* caoursel item binding */
    $(carousel).find('.IUCarouselItem')
        .on('movestart', function(e) {
            // If the movestart is heading off in an upwards or downwards
            // direction, prevent it so that the browser scrolls normally.
            if ((e.distX > e.distY && e.distX < -e.distY) ||
                (e.distX < e.distY && e.distX > -e.distY)) {
                e.preventDefault();
            }
            pauseCarousel(false);
        })
        .on('move', function(e) {
            // Move slides with the finger
            moveXCarouselItem(carousel, e.distX);
        })
        .on('moveend', function(e) {
            endMoveCarouselItem(carousel, e.distX);
            restartCarousel(false);
        });


    $(carousel).find('.IUCarousel-Pager >li').each(function(index) {
        $(this).click(function() {
            pauseCarousel(false);
            moveCarousel(carousel, index + 1);
            restartCarousel(false);
        })
    });

    //timer
    var timer = $(carousel).attr('timer');
    if (timer != undefined) {
        var time = parseInt(timer);
        if (time < 1000) {
            time = 1000;
        }
        $(carousel).data('timer', window.setInterval(function() {
            nextCarousel(carousel);
        }, time));
    }

    activeCarousel(carousel);
}

function resizeCarousel() {
    $('.IUCarousel').each(function() {
        //image lazy load check
        var carousel = $(this);
        var isLoaded = carousel.data('isLoaded');
        if (isLoaded) {

            var wrapper = $(carousel).find('.IUCarousel-wrapper');
            var index = $(carousel).data('index');
            var width = $(wrapper).children()[index].offsetWidth;
            $(wrapper).velocity({
                translateX: width * -1 * (index - 1) + 'px'
            }, {
                duration: 0
            });

            var $item = $($(wrapper).children()[index]);
            var heightCss = $item.css('height');
            if (heightCss.indexOf('%') > 0) {
                $.Velocity.hook($(carousel), 'height', '');
            } else {
                var height = $item.height();
                $.Velocity.hook($(carousel), 'height', height + 'px');

            }
        }
    });

}

function pauseCarousel(reset) {
    $('.IUCarousel').each(function() {
        var isLoaded = $(this).data('isLoaded');
        if (isLoaded) {
            if ($(this).data('timer') != undefined) {
                window.clearInterval($(this).data('timer'));
                $(this).removeData('timer');
            }
            if (reset) {
                rePositionCarousel(carousel);
            }
        };
    });
}

function restartCarousel(reset) {
    //timer
    $('.IUCarousel').each(function() {
        var isLoaded = $(this).data('isLoaded');
        if (isLoaded) {
            var carousel = this;
            var timer = $(this).attr('timer');
            if (timer != undefined) {
                var time = parseInt(timer);
                if (time < 1000) {
                    time = 1000;
                }
                $(this).data('timer', window.setInterval(function() {
                    nextCarousel(carousel);
                }, time));
            }
            if (reset) {
                if (timer != undefined) {
                    nextCarousel(this);
                } else {
                    currentCarousel(this);
                }
            } else {
                activeCarousel(this);
            }
        }
    });

}

function destroyCarousel(carousel) {
    var isLoaded = carousel.data('isLoaded');
    if (isLoaded) {
        $(carousel).data('isLoaded', false);
        var wrapper = $(carousel).find('.IUCarousel-wrapper');
        var copyObjects = $(wrapper).find('.carousel_copy');
        copyObjects.each(function() {
            $(this).remove();
        })
    }
}

function nextCarousel(carousel) {
    var wrapper = $(carousel).find('.IUCarousel-wrapper');
    var index = $(carousel).data('index') + 1;
    if (index >= $(wrapper).children().length) {
        index = 1;
    }
    moveCarousel(carousel, index);
}

function currentCarousel(carousel) {
    var wrapper = $(carousel).find('.IUCarousel-wrapper');
    var index = $(carousel).data('index');
    if (index >= $(wrapper).children().length) {
        index = 1;
    }
    moveCarousel(carousel, index);
}

function rePositionCarousel(carousel) {
    var wrapper = $(carousel).find('.IUCarousel-wrapper');
    var index = $(carousel).data('index');
    if (index >= $(wrapper).children().length) {
        index = 1;
    }
    moveCarousel(carousel, index, true);
}

function prevCarousel(carousel) {
    var wrapper = $(carousel).find('.IUCarousel-wrapper');
    var index = $(carousel).data('index') - 1;
    if (index < 0) {
        index = $(wrapper).children().length - 2;
    }
    moveCarousel(carousel, index);
}

function moveCarousel(carousel, toIndex, reset) {
    var index = $(carousel).data('index');

    var wrapper = $(carousel).find('.IUCarousel-wrapper')[0];
    if ($(wrapper).hasClass('velocity-animating')) {
        return;
    }
    var wrapper = $(carousel).find('.IUCarousel-wrapper')[0];
    var count = $(wrapper).children().length;
    var carouselWidth = $(carousel)[0].clientWidth;
    if (index == 0) {
        var x = carouselWidth * -1 * (count - 2);
        $.Velocity.hook($(wrapper), 'translateX', x + 'px');
    } else if (index == count - 1) {
        var x = carouselWidth * -1;
        $.Velocity.hook($(wrapper), 'translateX', x + 'px');
    }

    var moveLeft = carouselWidth * -1 * (toIndex - 1);
    $(carousel).data('index', toIndex);
    var duration = reset ? 0 : 400;
    $(wrapper).velocity({
        translateX: moveLeft + 'px'
    }, {
        duration: duration,
        complete: function() {
            if (toIndex == 0) {
                $(carousel).data('index', count - 2);
                $.Velocity.hook($(wrapper), 'translateX', (-1 * (count - 3) * carouselWidth) + 'px');
            } else if (toIndex == count - 1) {
                $(carousel).data('index', 1);
                $.Velocity.hook($(wrapper), 'translateX', '0px');
            }

            var $item = $($(wrapper).children()[toIndex]);
            var heightCss = $item.css('height');
            if (heightCss.indexOf('%') > 0) {
                $.Velocity.hook($(carousel), 'height', '');
            } else {
                var height = $item.height();
                $.Velocity.hook($(carousel), 'height', height + 'px');

            }

            reframeCenterIU(carousel);

        }
    });
    activeCarousel(carousel);

}

function moveXCarouselItem(carousel, distX) {

    var carouselWidth = $(carousel)[0].clientWidth;
    var wrapper = $(carousel).find('.IUCarousel-wrapper')[0];


    ///////////////// 이전 코드
    if ($(wrapper).hasClass('transition') == false) {
        var currentLeft = wrapper.offsetLeft;
        $(wrapper).addClass('transition');
        $(carousel).data('startLeft', currentLeft);
    }
    /////////////////


    var preDistX = $(carousel).data('prevDistX');
    if (preDistX == undefined) {
        preDistX = 0;
    }

    var prevTranslateX = parseInt($(wrapper).css('transform').split(',')[4]);

    if (Math.abs(distX) > carouselWidth) {
        distX = distX < 0 ? carouselWidth * -1 : carouselWidth;
    }
    var changedX = distX - preDistX;
    var currentTranslateX = prevTranslateX + changedX;
    $.Velocity.hook(wrapper, "translateX", currentTranslateX + 'px');
    $(carousel).data('prevDistX', distX);
}

function endMoveCarouselItem(carousel, distX) {
    var carouselWidth = $(carousel)[0].offsetWidth;
    var wrapper = $(carousel).find('.IUCarousel-wrapper')[0];
    if ($(wrapper).hasClass('transition') == false) {
        return;
    }
    $(wrapper).removeClass('transition');
    if (distX < 0 && Math.abs(distX) > carouselWidth / 4) {
        nextCarousel(carousel);
    } else if (distX > 0 && Math.abs(distX) > carouselWidth / 4) {
        prevCarousel(carousel);
    } else {
        currentCarousel(carousel);
    }
    $(carousel).data('prevDistX', 0);
}


function activeCarousel(carousel) {
    var wrapper = $(carousel).find('.IUCarousel-wrapper');
    var count = $(wrapper).children().length;
    var index = $(carousel).data('index');

    //select li class active
    var selectIndex = index - 1;
    if (index == count - 1) {
        selectIndex = 0;
    } else if (index == 0) {
        selectIndex = count - 3;
    }
    $(carousel).find('.IUCarousel-Pager').children().each(function(i) {
        if (i == selectIndex) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });

}
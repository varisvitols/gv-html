$(function(){
    $('#m-online, #m-offline').find('.default').each(function(){
        $(this).click(function(){
            $('.drop-down').fadeIn(250);
        });
    });
    $('#m-online, #m-offline').find('.dd').each(function(){
        $(this).click(function(){
            $('.drop-down').fadeOut(250);
        });
    });
    
    $('#toggle-comments').click(function(){
        var comms = $('.article-comments');
        //$('.article-comments').toggleClass('open');
        
        /*if(!comms.is(':visible'))
            comms.slideDown(800);
        else comms.slideUp(800);*/

        if(!comms.is(':visible'))
            comms.fadeIn(800);
        else comms.fadeOut(800);
        
    });
    
    $('.image-upload input[type=file]').change(function(){
        $(this).prev().html($(this).val().replace('C:\\fakepath\\', ''));
    });
    
    $('.read-more').click(function(){
        var $section = $(this).parent();
        if($section.hasClass('section-exp')){
            var $button = $(this);
            var $container = $section.find('.inner');
            var initHeight = $container.data('collapsedheight')+'px';
            var fullHeight = 2;
            if($section.hasClass('collapsed')){
                $container.children().each(function(){
                    if( ! $(this).hasClass('evt-star-image'))
                    fullHeight += $(this).outerHeight(true);
                });
                $container.animate({ height: fullHeight });
                $section.removeClass('collapsed');
                $button.html($button.data('alt'));
            }else{
                $container.animate({ height: initHeight });
                $section.addClass('collapsed');
                $button.html($button.data('default'));
            }
        }
    });
});

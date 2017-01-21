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



    /* Event edit */
    // Change image type
    $('#change-image-type').click(function(){
        var $eventHeader = $('.event-header');
        var currentType = $eventHeader.hasClass('event-header-compact') ? 2 : 1;
        var linkTxt = currentType === 2 ? $(this).data('small') : $(this).data('large');

        $(this).html(linkTxt);
        $eventHeader.toggleClass('event-header-compact');
        //$('.add-image-img').find('input[name="event_image"]').val('');
        $('.add-image-img').find('input[name="event_image_type"]').val(currentType);
    })

    // Image file selection
    $('input[name="event_image"]').change(function(event){
        // Display selected image
        var $img = $(this).closest('.add-image-img');
        var f = event.target.files[0];
        var fr = new FileReader();
        fr.onload = function(event2) {
            $img.css('background-image', 'url('+ event2.target.result + ')');
        };
        fr.readAsDataURL(f);

        $img.parent().addClass('image-added');
    });

    // Remove selected image
    $('.remove-image').click(function(){
        var $img = $(this).closest('.add-image-img');
        $img.find('.input-image').val('');
        $img.css('background-image', '');
        $img.parent().removeClass('image-added');
    })

    // My Own Select
    $('.my-own-select').click(function(e){
        //console.log();
        //console.log(this);
        $select = $(this);
        $origSelect = $select.prev();
        $options = $select.find('.select-options');
        $selItem = $('.selected-item');

        if($(e.target).hasClass('selected-item')){
            // Open dropdown options
            $options.width($select.width());
            $options.toggle(200);
        }

        if($(e.target).hasClass('select-option')){
            // Set the new value
            var $opt = $(e.target);
            var value = $opt.data('value');
            $origSelect.val(value).change();
            //console.log($origSelect.val());
            $selItem.html($opt.html());
            $options.fadeOut(200);
        }
    })

    // Remaining characters counter
    $('.char-limit').each(function(){
        var $el = $(this);
        var $counter = $el.find('.char-counter').find('.num');
        var max = $el.attr('max');
        var length = 0;

        $counter.html(max);

        $el.find('textarea').keyup(function(e){
            length = $(this).val().length;
            $counter.html(max - length);
            //if ( max - length <= 0) e.preventDefault();
            if ( max - length < 0){
                $el.addClass('too-many-chars');
            } else {
                $el.removeClass('too-many-chars');
            }
        })
    })

    $(function() {
        $('input[name="event_time"]').daterangepicker({
            timePicker: true,
            timePicker24Hour: true,
            timePickerIncrement: 30,
            autoUpdateInput: false,
            locale: {
                format: 'DD/MM/YYYY H:mm',
                cancelLabel: 'Notīrīt'
            }
        });
    });
    $('input[name="event_time"]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY H:mm') + ' - ' + picker.endDate.format('DD/MM/YYYY H:mm'));
    });
    $('input[name="event_time"]').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });



    // Event Gallery Images
    var $crEventAddFilesLink = $('.add-files-link');
    var $crEventGalleryList = $('.event-gallery');
    var crEventGalleryCount = $crEventGalleryList.find('.saved').length;
    var crEventImagesAdded = 0;
    $('#gallery_images').on('change', function(e){

        var $input = $(this);

        // Remove temporary items / placeholders each time when changed, as the input value will always change, even when cancelling
        $crEventGalleryList.find('.empty, .temporary').remove();
        crEventImagesAdded = e.target.files.length;
        if (e.target.files.length > 0){
            // Update input status information
            $input.prev().html($input.data('filesp1') + e.target.files.length + $input.data('filesp2'));
            // Update link text
            $crEventAddFilesLink.html($crEventAddFilesLink.data('alt'));

            // Append & display selected images
            $.each(e.target.files, function(){
                // Display valid images as temporary items
                if (this.type == 'image/jpeg' || this.type == 'image/png') {
                    var f = this;
                    var fr = new FileReader();
                    fr.onload = function(event2) {
                        var $imgLi = $('<li class="temporary">');
                        $imgLi.attr('data-temp', $crEventGalleryList.data('temp'));
                        $imgLi.css('background-image', 'url('+ event2.target.result + ')');
                        $crEventGalleryList.append($imgLi);
                    };
                    fr.readAsDataURL(f);
                } else {
                    alert($input.data('error'));
                }
            })
        } else {
            // Update input status information
            $input.prev().html($input.data('nofiles'));
            // Update link text
            $crEventAddFilesLink.html($crEventAddFilesLink.data('default'));

            // If no images have been selected or found on list, add placeholders
            crEventGalleryPlaceholders();
        }
    })

    // Each time when clicked, if some images have been already selected, warn user that old selection will be removed
    $('#gallery_images').on('click', function(){
        // .... Is this really needed?
    })

    // Activate gallery_images input when clicked on link
    $crEventAddFilesLink.on('click', function(){
        $('#gallery_images').trigger('click');
    })

    // Delete saved images
    $crEventGalleryList.find('.saved').on('click', function(){
        var remove = confirm($crEventGalleryList.data('confirm'));
        if (remove){
            // Add some ajax calls to backend here...
            // ......
            // ......
            $(this).remove();
        }
        crEventGalleryCount = $crEventGalleryList.find('.saved').length;
        if (crEventGalleryCount == 0 && crEventImagesAdded == 0){
            crEventGalleryPlaceholders();
        }
    })

    // Activate gallery_images input when clicked on placeholder
    function crEventGalleryTrigger(){
        $crEventGalleryList.find('.empty').on('click', function(){
            $('#gallery_images').trigger('click');
        })
    }
    crEventGalleryTrigger();

    // If no images are added, show placeholders
    function crEventGalleryPlaceholders(){
        if (crEventGalleryCount == 0){
            for (i = 0; i < 5; i++){
                var $emptyLi = $('<li class="empty">');
                $emptyLi.attr('data-add', $crEventGalleryList.data('add'));
                $crEventGalleryList.append($emptyLi);
            }
            crEventGalleryTrigger();
        }
    }
});

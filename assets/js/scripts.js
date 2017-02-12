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
        $select = $(this);
        $origSelect = $select.prev();
        $options = $select.find('.select-options');
        $selItem = $('.selected-value');

        if($(e.target).hasClass('selected-value')){
            // Open dropdown options
            $options.width($select.width());
            $options.toggle(200);
        }

        if($(e.target).hasClass('select-option')){
            // Set the new value
            var $opt = $(e.target);
            var value = $opt.data('value');
            $origSelect.val(value).change();
            $selItem.html($opt.html());
        }
    });

    // Check custom select if any items are selected upon page load
    $('.my-own-select-element').each(function(){
        console.log('mos');
        $selected = $(this).find('[selected]');
        selectedItem = $selected.index() + 1;
        if ($selected.length > 0){
            $(this).next().find('.selected-value').html($selected.html());
            $(this).next().find('.select-option').removeClass('selected');
            $(this).next().find('.select-option:nth-child(' + selectedItem + ')').addClass('selected');
        }
    });

    // Close custom select on click
    $(document).on('click', function(e){
        $options = $('.my-own-select').find('.select-options');
        if($options.css('opacity') == '1'){
            $options.fadeOut(200);
        }
    })

    // Remaining characters counter
    $('.char-limit').each(function(){
        var $el = $(this);
        var $counter = $el.find('.char-counter').find('.num');
        var max = $el.attr('max');
        var length = $(this).find('textarea, input').val().length;

        $counter.html(max - length);

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

    $inputTime = $('input[name="event_time"]');
    $inputTime.daterangepicker(
        {
            timePicker: true,
            timePicker24Hour: true,
            timePickerIncrement: 30,
            autoUpdateInput: false,
            locale: {
                format: 'DD/MM/YYYY H:mm',
                cancelLabel: $inputTime.data('cancel'),
                applyLabel: $inputTime.data('apply')
            }
        }
    );
    $inputTime.on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY H:mm') + ' - ' + picker.endDate.format('DD/MM/YYYY H:mm'));
        $('input[name="event_start"]').val(picker.startDate.format('DD/MM/YYYY H:mm'));
        $('input[name="event_end"]').val(picker.endDate.format('DD/MM/YYYY H:mm'));
    });
    $inputTime.on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
        $('input[name="event_start"], input[name="event_end"]').val('');
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
            // If ajax request successful, remove the item
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



    /*
    * Edit Event: add Event Stars - teachers
    */
    $starsContainer = $('#event_stars');
    if ($starsContainer.length > 0){
        var $tpl = $('#new_star_tpl');
        var teacherCount = 0;
        var blankId = 'event_star_';

        if (Object.keys(eventStars).length > 0)
        { // Edit event - some teachers already exist, so take the template and create elements from teacher data
            $.each(eventStars, function(key, data){
                crEventTeacherForm(key, data);
                teacherCount++;
            });
        }
        else
        { // No teachers added yet, display blank form
            crEventNewTeacher();
        }

        // Create blank form
        function crEventNewTeacher(){
            teacherCount++;
            var data = {
                'name': '',
                'desc': '',
                'image': '',
                'saved': false
            };
            crEventTeacherForm( blankId + teacherCount, data);
        }

        // Populate form with existing teacher data
        function crEventTeacherForm(id, data){
            // Clone the template and append it to container
            var $teacher = $tpl.clone();
                $addImgLink = $teacher.find('.add-star-img');
            $starsContainer.append($teacher);

            // Populate the new teacher inputs with data accordingly
            $teacher.attr('id', id);
            if (data.saved) $teacher.data('saved', true);
            $teacher.find('.input-star-name').val(data.name).attr('name', id + '_name');
            $teacher.find('.input-star-desc').val(data.desc).attr('name', id + '_desc');
            /* INIT THE WYSIWYG TEXT EDITOR HERE */
            $teacher.find('.input-star-img').attr('name', id + '_img');
            if (data.image.length > 0){
                $teacher.find('.evt-star-image').css('background', 'url(' +  data.image + ')');
                $addImgLink.html($addImgLink.data('alt'));
                $addImgLink.removeClass('link-add').addClass('link-remove');
            }
            $teacher.show();

            var $thisTeacher = $('#' + id);
            var $thisAddImgLink = $thisTeacher.find('.add-star-img');
            // Add or Change teacher's image
            $thisTeacher.find('.input-star-img').change(function(event){
                // Display selected image
                var $img = $(this).closest('.evt-star-image');
                if ($thisTeacher.find('.input-star-img').val() != ''){
                    var f = event.target.files[0];
                    var fr = new FileReader();
                    fr.onload = function(event2) {
                        $img.css('background', 'url('+ event2.target.result + ') center / cover no-repeat');
                    };
                    fr.readAsDataURL(f);

                    $thisAddImgLink.html($thisAddImgLink.data('alt'));
                    $thisAddImgLink.removeClass('link-add').addClass('link-remove');
                } else {
                    $img.css('background', '#faf9f6 url(assets/css/img/buddha-avatar.png) no-repeat 12px bottom');
                    $thisAddImgLink.html($thisAddImgLink.data('default'));
                    $thisAddImgLink.removeClass('link-remove').addClass('link-add');
                }
            });

            // Remove an existing teacher
            $thisTeacher.find('.remove-star').on('click', function(){
                var remove = confirm($(this).data('confirm'));
                if (remove){
                    if ($thisTeacher.data('saved'))
                    { // If teacher has already been saved on database, send request to the backend
                        // Add some ajax calls to backend here...
                        // ......
                        // ......
                        // If ajax request successful, remove the item
                        console.log('ajax call first');
                        $thisTeacher.remove();
                    }
                    else
                    { // Otherwise simply remove added item from user's view
                        console.log('just remove');
                        $thisTeacher.remove();
                    }
                }
            });
        }

        // Add another teacher
        $('.add-more-stars').on('click', function(){
            crEventNewTeacher();
        });
    }
});

(function($){

    /////////////////////////////////////-+++-
    // Responsive resize utility function
    // fire something after the event has ended, often used for at the end of a window resize.
    // via http://stackoverflow.com/questions/2854407/javascript-jquery-window-resize-how-to-fire-after-the-resize-is-completed

        var waitForFinalEvent = (function () {
            var timers = {};
            return function (callback, ms, uniqueId) {
                if (!uniqueId) {
                    uniqueId = "Don't call this twice without a uniqueId";
                }
                if (timers[uniqueId]) {
                    clearTimeout (timers[uniqueId]);
                }
                timers[uniqueId] = setTimeout(callback, ms);
            };
        })();


    // this makes all videos responsive inside the main content area
      $("#main").fitVids();

    ///////////////////////////////////////-+++-
    // Dropdowns in the header and elsehwer
    // this needs to be in JS instead of plain CSS because of some weird bugs


        var DropDownHoverMenu = function(elementer, classer) {

            // add accessibility attributes
            $(elementer).each(function() {
                if( $(this).find('ul').length !== 0) {
                    $(this).attr("aria-haspopup", "true");
                }
            });
            $(elementer).children('ul').attr("aria-hidden", "true").attr("role", "menu");
            $(elementer).parent('ul').attr("role", "menubar");
            $(elementer).attr('role', 'menuitem');
            $(elementer).children('ul').children('li').attr("role", "menuitem");

            // listen for the user to press the escape key
            var PollForEscape = function(e) {
                var escapeKeyCode = 27;
                if (e.which !== undefined && e.which === escapeKeyCode) {
                    Close();
                }
            };

            // listen for the user to move their mouse outside the element selected
            var PollForMouseOutside = function(e) {
                if(!$(e.target).closest(elementer).length) {
                    Close();
                }
            };

            // listen to see if the new element in focus is a child of the original element
            var PollForFocusOut = function(e) {
                setTimeout(function() {
                    if ( $(document.activeElement).parent(elementer + ' > ul > li').length) {
                    } else if ($(document.activeElement).parent(elementer).length) {
                    } else {
                        Close();
                    }
                }, 500);
            };

            var Close = function(e, thingie) {
                // update the class/styles
                $(elementer).removeClass(classer);

                // stop listening for stuff
                $(document).off('mouseover', PollForMouseOutside);
                $(document).off('keydown', PollForEscape);
                $(elementer).children('a').off('focusout', PollForFocusOut);
                $(elementer).children('ul').children('li').children('a').off('focusout', PollForFocusOut);

                // update accessibility attributes
                $(elementer).children('ul').attr("aria-hidden", "true");
            };

            var Open = function(e, thingie) {
                // update the class/styles
                thingie.addClass(classer);

                // start listning for stuff
                $(document).mouseover(PollForMouseOutside);
                $(document).keydown(PollForEscape);
                $(elementer).children('a').focusout(PollForFocusOut);
                $(elementer).children('ul').children('li').children('a').focusout(PollForFocusOut);

                // update accessibility attributes
                thingie.children('ul').attr("aria-hidden", "false");
            };

            $(elementer).on('mouseover', function(e) {
                Close(e);
                Open(e, $(this));
            });

            // when you tab focus onto a dropmenu
            $(elementer).children('a').on('focus', function(e) {
                Close(e);
                Open(e, $(this).parent('li'));
            });

        };

        //DropDownHoverMenu("#primary-nav > ul > li", "js-hover");
        //DropDownHoverMenu("#institutional-nav > ul > li", "js-hover");


        var DropDownHover = function(arg) {

            var trigger         = arg.trigger;
            var dropdown        = arg.dropdown;

            // add accessibility attributes
            $(trigger).attr("aria-haspopup", "true");

            // listen for the user to press the escape key
            var PollForEscape = function(e) {
                var escapeKeyCode = 27;
                if (e.which !== undefined && e.which === escapeKeyCode) {
                    Close();
                }
            };

            // listen for the user to move their mouse outside the elements selected
            var PollForMouseOutside = function(e) {
                if(!$(e.target).closest(trigger).length && !$(e.target).closest(dropdown).length) {
                    Close();
                }
            };

            // listen to see if the new element in focus is a child of the original element
            var PollForFocusOut = function(e) {
                setTimeout(function() {
                    if ( $(document.activeElement).parents(dropdown).length || $(document.activeElement).parents(trigger).length ) {
                    } else {
                        Close();
                    }
                }, 400);
            };

            // listen to see if the new element in focus is a child of the original element
            var PollForFocusOutTrigger = function(e) {
                setTimeout(function() {
                    if ( $(document.activeElement).parents(dropdown).length ) {
                    } else {
                        Close();
                    }
                }, 400);
            };

            var Close = function(e, thingie) {
                // update the class/styles
                $(trigger).removeClass('js-open');

                // stop listening for stuff
                $(document).off('mouseover', PollForMouseOutside);
                $(document).off('keydown', PollForEscape);
                $(dropdown).find('a').off('focusout', PollForFocusOut);
                $(trigger).find('a').off('focusout', PollForFocusOutTrigger);

                // update accessibility attributes
                $(dropdown).attr("aria-hidden", "true");
            };

            var Open = function(e) {
                // update the class/styles
                $(trigger).addClass('js-open');

                // start listning for stuff
                $(document).mouseover(PollForMouseOutside);
                $(document).keydown(PollForEscape);
                $(dropdown).find('a').focusout(PollForFocusOut);
                $(trigger).find('a').focusout(PollForFocusOutTrigger);

                // update accessibility attributes
                $(dropdown).attr("aria-hidden", "false");
            };

            $(trigger).on('mouseover', function(e) {
                Close(e);
                Open(e);
            });

            // when you tab focus onto a dropmenu
            $(trigger).children('a').on('focus', function(e) {
                Close(e);
                Open(e);
            });

        };

        // DropDownHover({
        //     trigger         : "#institutional-nav > ul > li:last-child",
        //     dropdown        : ".header__login-subnav"
        // });



    /////////////////////////////////////-+++-
    // modal
    // this is a utility function that shows and hides things inside of a dialog or modal

        // show and hide a modal
        var modal = function(arg) {

            var elementer         = arg.elementer;
            var showTrigger       = arg.showTrigger;
            var hideTrigger       = arg.hideTrigger;
            var focuser           = arg.focuser;

            // some variables if the modal contains a video
            var videor            = arg.videor;
            var video_suffix      = '?autoplay=1&loop=1&rel=0&wmode=transparent&showinfo=0';
            var video_src         = $(elementer).find('iframe').attr("src");
            var video_src_new     = video_src + video_suffix;

            // close the modal if you press the 'esc' key
            var PollForEscape = function(e) {
                var escapeKeyCode = 27;
                if (e.which !== undefined && e.which === escapeKeyCode) {
                    close();
                }
            };

            // close the modal
            var close = function(e) {

                $(elementer).removeClass('js-visual-show');
                setTimeout(function(){
                    $(elementer).removeClass('js-show');
                }, 500);

                // adjust accessibility attributes
                $(elementer).attr("aria-hidden", "true");
                $(elementer).removeAttr("tab-index");

                // Stop listening for keypress.
                $(document).off('keydown', PollForEscape);

                // set focus on trigger after it closes
                setTimeout(function() {
                    $(showTrigger).focus();
                }, 100);

                // stop video
                if (videor) {
                    $(elementer).find('iframe').attr("src", "");
                    $(elementer).find('iframe').attr("src",video_src);
                }
            };

            // open the modal
            var open = function(e) {

                // if there is a video in here, autoplay it
                if (videor) {
                    $(elementer).find('iframe').attr("src", "");
                    $(elementer).find('iframe').attr("src",video_src_new);
                }

                $(elementer).addClass('js-show');
                setTimeout(function(){
                    $(elementer).addClass('js-visual-show');
                }, 100);

                // adjust accessibility attributes
                $(elementer).attr("aria-hidden", "false");
                $(elementer).attr("tabindex",-1);

                // set focus on new element
                setTimeout(function() {
                    if (focuser) {
                        $(elementer).find(focuser).focus();
                    } else {
                        $(elementer).focus();
                    }
                }, 150);

                // start listening for escape keypress
                $(document).keydown(PollForEscape);
            };

            // click the open modal trigger
            $(showTrigger).click(function(e) {
                e.preventDefault();
                open(e);
            });

            // click the close modal trigger
            $(hideTrigger).click(function(e) {
                e.preventDefault();
                close(e);
            });

        };


    /////////////////////////////////////-+++-
    // home page tab slider toolbar thing
    //

        var tabs = function(arg) {

            var tab_nav_item = arg.tab_nav_item;
            var tab_nav = arg.tab_nav;
            var tab_content = arg.tab_content;
            var tab_content_item = arg.tab_content_item;
            var tab_wrapper = arg.tab_wrapper;

            // add a hard height via js so that we can animate the height value in CSS
            $("body").imagesLoaded( function() {
                $(tab_content).each(function(){
                    var new_height = $(this).children('div').children('div[aria-hidden="false"]').height();
                    $(this).children('div').height(new_height);
                });
            });

            // // clone tab titles inside each tab content, so they can show up in a stack on mobile
            // $('.tabs__content-item').each(function(){
            //     var label = $(this).attr('aria-labelledby');
            //     var title = $('#' + label).text();
            //     $(this).prepend($("<div class='mobile-tab-title' >" + title + "</div>"));

            // });

            $(tab_nav_item).find('a').on( "click", function(e) {
                e.preventDefault();
                $(this).closest('li').siblings('li').removeClass('is-active');
                $(this).closest('li').addClass("is-active");

                var id = $(this).attr('aria-controls');

                $(this).closest(tab_wrapper).find(tab_content_item).attr("aria-hidden", true);
                $('#' + id).attr("aria-hidden", false);
                $(this).closest(tab_wrapper).find(tab_content_item).not($('#' + id)).removeClass('js-visual-show');

                $(this).closest('li').siblings('li').find('a').attr("aria-expanded", false);
                $(this).closest(tab_nav).removeClass('has-shadow');
                var element = $(this);

                setTimeout(function(e){
                    $('#' + id).addClass('js-show');
                    var new_height = $('#' + id).outerHeight();
                    setTimeout(function(){
                        $('#' + id).addClass('js-visual-show');
                        element.closest(tab_wrapper).find(tab_content).outerHeight(new_height);
                        element.closest(tab_nav).addClass('has-shadow');
                        element.attr("aria-expanded", true);
                    }, 10);
                }, 10);

                setTimeout(function(e){
                    element.closest(tab_wrapper).find(tab_content_item).not($('#' + id)).removeClass('js-show');
                }, 400);

            });
        };

        tabs({
            tab_nav_item: ".homehero-item",
            tab_nav: ".homehero__top",
            tab_content: ".homehero__bottom",
            tab_content_item: ".homehero-item__bottom",
            tab_wrapper: ".homehero"
        });



    /////////////////////////////////////-+++-
    // Move mobile things around
    //

        // Clone fix utility function
        // then iterate over all the elements with IDs and 'for' labels and add a string to it (so we dont have duplicates)
        // function to replace 'ID' and 'for' attributes when cloning

        var clone_fix = function(mobileElements, mobileArea, mobileID) {
            $.each(mobileElements, function(index, item) {
                $(item).clone(true).prependTo(mobileArea).find("[id!=''][id]").addBack("[id!=''][id]").each(function(i, e){
                    $(this).attr('id', $(this).attr('id') + mobileID);
                });
                $(mobileArea).find($(item)).find("[for!=''][for]").each(function(i, e){
                    $(this).attr('for', $(this).attr('for') + mobileID);
                });
            });
        };


        modal({
            elementer       : "#mobile-area-offcanvas",
            showTrigger     : "#mobile-trigger",
            hideTrigger     : "#offcanvas-close",
        });

        $(document).ready(function() {
            clone_fix(['.main-search', '.header__login-subnav', '#institutional-nav', '#primary-nav'], '#mobile-area-offcanvas .overlay__content', '--mobile');
        });


    ///////////////////////////////////////-+++-
    // WYSIWYG Image/Figure alignment

        $('.WYSIWYG img').each(function(index) {
          var image = $(this);
          var alignClass;

          if (image.parent('figure.caption-image').length) {
            alignClass = $(this).attr('class');
            image.removeClass(alignClass);
            image.parent().addClass(alignClass);
          }
        });



    ///////////////////////////////////////-+++-
    // Header sticky stuff

        // The nav needs to become sticky once you hit the first issue 'chapter'
        // uses jquery waypoints plugin with the Sticky shortcut. positioning handled in css
            // var header = new Waypoint({
            //     element: $('.header__middle'),
            //     handler: function(direction) {
            //         if (direction === 'down') {
            //             $('.header').addClass('js-stickynav');
            //         } else if (direction === 'up') {
            //             $('.header').removeClass('js-stickynav');
            //         }
            //     }
            // });
            // var stickyheader = new Waypoint.Sticky({
            //   element: $('.header__middle')[0]
            // });


}(jQuery, Drupal, drupalSettings));

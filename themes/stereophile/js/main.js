/* jshint undef: true, unused: true, white: false */
/* global console, $*/


// I use 1 global var named mpax. 
if( typeof( window.mpax ) !== 'undefined' ){

    console.warn( '********************** mpax is already defined.' );

}else{

    var mpax = {};

}


//My global variable. mpax is passed into the function and refered to as ctx within this scope 
(function( ctx ) {

    "use strict";
    //buffer to throttle event triggering when window is resized.
    ctx.resize_int = null;
    ctx.scroll_bar_width = 0;
    ctx.mbl_breakpoint = 1000;

})( mpax ); 

//mpax global variable is passed into this function and refered to as gbl within this scope
(function( gbl ) {
    
    'use strict';

    function window_resize_buffer(){
       
        clearTimeout( gbl.resize_int );
        gbl.resize_int = setTimeout( screen_size_change, 200 );

    }


    function reset_zoom(){

        var anitzoom = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0',
            viewportmeta = document.querySelector('meta[name="viewport"]'),
            viewmetaval = viewportmeta.content;

        if( viewmetaval === anitzoom ){ return; }

        viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
            
        setTimeout( function(){

            viewportmeta.content = viewmetaval;

        }, 100 );

        clearTimeout( gbl.resize_int );
    }

    function screen_size_change(){

        clearTimeout( gbl.resize_int );

        console.log( 'screen_size_change' );

        const w = document.body.clientWidth;

        if( w < gbl.mbl_breakpoint ){

            if(! $('body').hasClass('menu-open') ){
                
                $('.main-header').removeAttr('style');
            }

        }else{
            
            close_main_nav();

            $('.main-header').attr('style', 'position: sticky; top:' + (-1 * $('.header-top').outerHeight()) + 'px' );

            $('.sub-menu-inner').masonry({
              columnWidth: 200,
              itemSelector: '.sub-menu-category'
            });
        }

        //if( w > 400 ){

            $('.js-article-suggestion-wrapper').masonry({
                //columnWidth: 100,
                itemSelector: '.js-article-suggestion'
                //columnWidth: '.grid-sizer',
                // percentPosition: true,
                //gutter: 10
            });
        //}

        scale_images_to_wrap();

        reset_zoom();
    }



    function scale_image(srcwidth, srcheight, targetwidth, targetheight, fLetterBox) {

        var result = { width: 0, height: 0, fScaleToTargetWidth: true };

        if ((srcwidth <= 0) || (srcheight <= 0) || (targetwidth <= 0) || (targetheight <= 0)) {
            return result;
        }

        // scale to the target width
        var scaleX1 = targetwidth,
            scaleY1 = (srcheight * targetwidth) / srcwidth,
            // scale to the target height
            scaleX2 = (srcwidth * targetheight) / srcheight,
            scaleY2 = targetheight,
            // now figure out which one we should use
            fScaleOnWidth = (scaleX2 > targetwidth);

        if (fScaleOnWidth) {
        
            fScaleOnWidth = fLetterBox;
        
        } else {
        
           fScaleOnWidth = !fLetterBox;
        
        }

        if (fScaleOnWidth) {
        
            result.width = Math.floor(scaleX1);
            result.height = Math.floor(scaleY1);
            result.fScaleToTargetWidth = true;
        
        } else {
        
            result.width = Math.floor(scaleX2);
            result.height = Math.floor(scaleY2);
            result.fScaleToTargetWidth = false;
        }

        result.targetleft = Math.floor((targetwidth - result.width) / 2);
        result.targettop = Math.floor((targetheight - result.height) / 2);

        return result;
    }

    function set_img_scale( img ){

        var w = $(img).width(),
            h = $(img).height(), 
            tw = $(img).parent().width(), 
            th = $(img).parent().height(), 
            result = scale_image(w, h, tw, th, false);

        if( img && result.width || result.height ){

            $(img).css("left", result.targetleft);
            $(img).css("top", result.targettop);
            if( result.width ){ $(img).css("width", result.width); }
            if( result.height ){ $(img).css("height", result.height); }

        }else{

            try {

                //img failed to scale try again in 3 seconds
                if( ! img.classList.contains( 'reloaded' ) ){
                    img.classList.add( 'reloaded' );
                    setTimeout( function(){ set_img_scale( img ); }, 3000 );
                }
                
            } catch (error) {

              //console.warn(error);
            
            }
        }  
    }

    function scale_images_to_wrap(){

        var $imgs = $('.js-img-wrap').find('img');

        $imgs.find('img').removeAttr('style');

        $imgs.each(function(){

            if( ! this.classList.contains( 'ignore-scale' ) ){
                set_img_scale( this );
            }
        });
    }


        //CLICK BLOCKER - 
    //block clicks so that the user doesn't try to perform conflicting actions
    //invisible div that lays ontop of everything
    function destroy_click_blocker( callback ){

        var $body = $( 'body' );
           
        $( '#click-blocker' ).velocity( 'transition.fadeOut', {

            duration: 300,
            complete: function(){
                $( this ).remove();
                $body.removeAttr('style');
                if( typeof callback === 'function' ){ callback(); }
            }
        });
    }

    function make_click_blocker( callback ){

        $( '#click-blocker' ).remove();

        var $click_blocker = $( document.createElement( 'div' ) ),
            $attach_to = $( 'body' );
                
        $attach_to
            .attr('style', 'overflow: hidden' )
            .append( $click_blocker );


        $click_blocker.attr( 'id', 'click-blocker' ).velocity( 'transition.fadeIn', {
            duration : 300,
            complete : function(){
                if( callback && typeof callback === 'function' ){ callback(); }
            }
        });
    }
    

    function close_main_nav(){

        const w = document.body.clientWidth;

        console.log( 'closing nav', $('#nav-trigger')[0].checked );
        $('.main-header').removeAttr('style');
        $( 'body' ).removeClass('menu-open');
        $('#nav-trigger')[0].checked = false;

        if( w > gbl.mbl_breakpoint ){
            $('.main-header').attr('style', 'position: sticky; top:' + (-1 * $('.header-top').outerHeight()) + 'px' );
        }
    }

    function open_main_nav(){

        const h = $( '.mbl-menu' ).height(),
            sh = window.innerHeight,
            max = sh - h;

        $('.main-header').attr('style', 'height : ' + max + 'px; overflow: scroll' );

    }
        /*
    }
    888    888       d8888888b    8888888888b. 888     88888888888888888b.  .d8888b. 
    888    888      d888888888b   888888  "Y88b888     888       888   Y88bd88P  Y88b
    888    888     d88P88888888b  888888    888888     888       888    888Y88b.     
    8888888888    d88P 888888Y88b 888888    888888     8888888   888   d88P "Y888b.  
    888    888   d88P  888888 Y88b888888    888888     888       8888888P"     "Y88b.
    888    888  d88P   888888  Y88888888    888888     888       888 T88b        "888
    888    888 d8888888888888   Y8888888  .d88P888     888       888  T88b Y88b  d88P
    888    888d88P     888888    Y8888888888P" 888888888888888888888   T88b "Y8888P" 
    */

    function apply_evt_handlers(){

        console.log('applying eveny handlers');

        window.addEventListener( 'resize', window_resize_buffer, false );

        const body = document.getElementsByTagName('body')[0];

        $('#nav_trigger').bind('click', function(){

            $(body).toggleClass('menu-open');

            if( ! body.classList.contains('menu-open') ){
                   
                close_main_nav();
                
            }else{

                open_main_nav();
            }
        });

        $( '.js-has-dd' ).bind('mouseenter', function(){

            const w = document.body.clientWidth;
            if( w > gbl.mbl_breakpoint ){
                const h = $(this).find('.sub-menu-inner').height();
                
                $( this ).find( '.sub-menu' )
                    .attr( 'style', 'max-height:' + h + 'px')
                    .addClass( 'open' );
            }
        
        }); 

         $( '.js-has-dd' ).bind('mouseleave', function(){
             $( this ).find( '.sub-menu' )
                .removeAttr( 'style' )
                .removeClass( 'open' );
         });

         $('.site-search-btn').bind('click', function(e){
            e.preventDefault;
            e.stopPropagation;

            close_main_nav();

            make_click_blocker( function(){

                const $search_form = $('#templates').find('.site-search-form').clone(true)[0];
                console.log( $search_form );
                $('#click-blocker').append( $search_form );
                $('#click-blocker').find('input')[0].focus();

            });
         });

         $('.close-site-search').bind('click', function(){
            destroy_click_blocker( false );
         });
    }

    $( document ).ready( function(){

        var is_touch,
            body = document.querySelector( 'body' ),
            scrollDiv = document.createElement("div");

        scrollDiv.className = "scrollbar-measure";
        document.body.appendChild(scrollDiv);
        
        gbl.scroll_bar_width = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);

        //determine if this is a touch device for some css trickery
        is_touch =  !!( "ontouchstart" in window ) || window.navigator.msMaxTouchPoints > 0;

        document.querySelector( 'html' ).classList.remove( 'no-js' );

        if( ! is_touch ){

            body.classList.add( 'can-hover' );

        }else{

            body.classList.add( 'can-touch' );
        }

        screen_size_change();
        apply_evt_handlers();

        setTimeout( function(){
            
            screen_size_change();

            setTimeout( function(){

                screen_size_change();

            }, 10000 );

        }, 5000 );

        $('[data-toggle="tooltip"]').tooltip(); 


    });


})( mpax );
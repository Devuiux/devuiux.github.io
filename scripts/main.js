//menu
jQuery(document).ready(function() {

    $('.js-menu-trigger,.js-menu-screen').on('mouseover touchstart', function(e) {
        $('.js-menu').toggleClass('is-visible');
        $('.js-menu-screen').delay(900).toggleClass('is-visible');
        e.preventDefault();
    });
});
//menu

//form
jQuery(document).ready(function($) {
    if ($('.floating-labels').length > 0) floatLabels();

    function floatLabels() {
        var inputFields = $('.floating-labels .cd-label').next();
        inputFields.each(function() {
            var singleInput = $(this);
            //check if user is filling one of the form fields 
            checkVal(singleInput);
            singleInput.on('change keyup', function() {
                checkVal(singleInput);
            });
        });
    },

    function checkVal(inputField) {
        (inputField.val() == '') ? inputField.prev('.cd-label').removeClass('float'): inputField.prev('.cd-label').addClass('float');
    }
});
//form

//scroll

$(function() {


   $('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
         var target = $(this.hash);
         target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
         if (target.length) {
            $('html,body').animate({
               scrollTop: target.offset().top
            }, 1000);
            return false;
         }
      }
   });




});

//scroll

Ractive.DEBUG = false;

window.onhashchange = OnHashChange;
window.onload = OnHashChange;

const box1 = $('.box-1'), box2 = $('.box-2'), box3 = $('.box-3'), box4 = $('.box-4');

box1.addClass('hover').delay(300).queue(function(next) {
  $(this).removeClass('hover');
  next();

  box2.addClass('hover').delay(300).queue(function(next) {
    $(this).removeClass('hover');
    next();

    box3.addClass('hover').delay(300).queue(function(next) {
      $(this).removeClass('hover');
      next();

      box4.addClass('hover').delay(300).queue(function(next) {
        $(this).removeClass('hover');
        next();

        box3.addClass('hover').delay(300).queue(function(next) {
          $(this).removeClass('hover');
          next();

          box2.addClass('hover').delay(300).queue(function(next) {
            $(this).removeClass('hover');
            next();

            box1.addClass('hover').delay(300).queue(function(next) {
              $(this).removeClass('hover');
              next();
            });
          });
        });
      });
    });
  });
});


var ractive = new Ractive({
  el: '.cd-modal-content',
  template: '#template',
  debug: false
});

function CustomSearch(boxName) {
  $.get('pages/' + boxName + '.html').done(function(datain) {
    ractive.set('dataout', datain);

    if (boxName == 'contact' && $('.floating-labels').length > 0) {
      floatLabels();
      CheckRequired();

      $('input[type="submit"]').click(function(e) {
        CheckBefore();
        if (BeforeSubmit() != true) e.preventDefault();
      });
    }
  });
}

function SetHashLocation(boxName) {
  window.location.hash = '#' + boxName;
}

function OnHashChange() {
  var boxName = window.location.hash.substring(1);

  (boxName != '') ? CustomSearch(boxName): closeModal();

  $('[data-type="modal-trigger"]').each(function() {
    if (boxName != '' && $(this).attr('name') == boxName && !$(this).hasClass('to-circle')) OpenModal($(this));
  });

}

function WhichTransitionEvent(){
  var t, el = document.createElement("fakeelement");

  const transitions = {
    "transition"      : "transitionend",
    "OTransition"     : "oTransitionEnd",
    "MozTransition"   : "transitionend",
    "WebkitTransition": "webkitTransitionEnd"
  }

  for (t in transitions) {
    if (el.style[t] !== undefined) return transitions[t];
  }
}

const transitionEvent = WhichTransitionEvent();

function OpenModal(actionBtn) {
  var scaleValue = retrieveScale(actionBtn.next('.cd-modal-bg'));

  actionBtn.addClass('to-circle');
  actionBtn.next('.cd-modal-bg').addClass('is-visible').one(transitionEvent, function() {
    animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
  });

  //if browser doesn't support transitions...
  if (actionBtn.parents('.no-csstransitions').length > 0) animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
}

//trigger the animation - open modal window
$('[data-type="modal-trigger"]').on('click', function() {

  SetHashLocation($(this).attr('name'));
  OpenModal($(this));
});

$(document).keyup(function(event) {
  if (event.which == '27') closeModal();
});

$(window).on('resize', function() {
  //on window resize - update cover layer dimention and position
  if ($('.cd-section.modal-is-visible').length > 0) window.requestAnimationFrame(updateLayer);
});

function retrieveScale(btn) {
  var btnRadius = btn.width() / 4,
    left = btn.offset().left + btnRadius,
    top = btn.offset().top + btnRadius - $(window).scrollTop(),
    scale = scaleValue(top, left, btnRadius, $(window).height(), $(window).width());

  btn.css('position', 'fixed').velocity({
    top: top - btnRadius,
    left: left - btnRadius,
    translateX: 0,
  }, 0);

  return scale;
}

function scaleValue(topValue, leftValue, radiusValue, windowW, windowH) {
  var maxDistHor = (leftValue > windowW / 2) ? leftValue : (windowW - leftValue),
    maxDistVert = (topValue > windowH / 2) ? topValue : (windowH - topValue);
  return Math.ceil(Math.sqrt(Math.pow(maxDistHor, 2) + Math.pow(maxDistVert, 2)) / radiusValue);
}

function animateLayer(layer, scaleVal, bool) {
  layer.velocity({
    scale: scaleVal
  }, 400, function() {
    $('body').toggleClass('overflow-hidden', bool);
    (bool) ? layer.parents('.cd-section').addClass('modal-is-visible').end().off(transitionEvent): layer.removeClass('is-visible').removeAttr('style').siblings('[data-type="modal-trigger"]').removeClass('to-circle');
  });
}

function updateLayer() {
  var layer = $('.cd-section.modal-is-visible').find('.cd-modal-bg'),
    layerRadius = layer.width() / 2,
    layerTop = layer.siblings('.box').offset().top + layerRadius - $(window).scrollTop(),
    layerLeft = layer.siblings('.box').offset().left + layerRadius,
    scale = scaleValue(layerTop, layerLeft, layerRadius, $(window).height(), $(window).width());

  layer.velocity({
    top: layerTop - layerRadius,
    left: layerLeft - layerRadius,
    scale: scale,
  }, 0);
}

function closeModal() {
  var section = $('.cd-section.modal-is-visible');

  section.removeClass('modal-is-visible').one(transitionEvent, function() {
    animateLayer(section.find('.cd-modal-bg'), 1, false);
  });

  //if browser doesn't support transitions...
  if (section.parents('.no-csstransitions').length > 0) animateLayer(section.find('.cd-modal-bg'), 1, false);
}

// form

function floatLabels() {
  $('.floating-labels .cd-label').next().each(function() {

    $(this).on('change keyup', function() {
      ($(this).val() != '') ? $(this).prev('.cd-label').addClass('float'): $(this).prev('.cd-label').removeClass('float');
    });
  });
}

function CheckRequired() {
  $('.required').each(function() {

    $(this).on('keyup keypress blur change', function() {
      const name_regex = /^[a-zA-Z]+$/, email_regex = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
      var regex, inputVal = $(this).val();

      if ($(this).attr("id") == "cd-name") regex = name_regex;
      if ($(this).attr("id") == "cd-email") regex = email_regex;

      (!inputVal.match(regex) || inputVal.length == 0 || inputVal == '') ? $(this).addClass('error'): $(this).removeClass('error');
    });
  });
}

function BeforeSubmit() {
  if ($('.cd-form').find('input, textarea').hasClass('error')) {
    var errorWhere = $('.error').attr('id');
    var errorMessage = $('.error-message');

    if ($(".error").length > 1) errorMessage.html('<p>Please fill out the required fields.</p>')
    else if (errorWhere == 'cd-name') errorMessage.html('<p>Please enter your NAME (only letters).</p>')
    else if (errorWhere == 'cd-email') errorMessage.html('<p>Please enter a valid EMAIL address.</p>')
    else if (errorWhere == 'cd-textarea') errorMessage.html('<p>Write me a message.</p>');

    errorMessage.removeClass('hide');
    return false;

  } else {
    return true;
  }
}

function CheckBefore() {
  $('.required').each(function() {
    if ($(this).val() == 0) $(this).addClass('error');
  });
}

// form


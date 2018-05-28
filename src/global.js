/**
 *
 * @desc This is the global file for all the pages, it creates the namespace for the application and defines the global variables that will used in the application.
 *
 * JS structure
 *
 * 1. global.js - HOG is global namespace
 * 2. modules
 *      - all supportive modules extending the namespace
 * 3. fragments
 *      - contains the page specific scripts and event handling
 *
 * Naming conventions for JS
 *
 * Functions - camelCase [bindEvent()]
 * Variables - underscore separated [my_var]
 * DOM selector - .js-thisElement
 * Constants - UPPERCASE
 * Constructor - Capitalize
 * Private members - underscore prefix [ _private_var ]
 *
 */

if(typeof HOG === 'undefined') {

  HOG = {};
}

HOG.urls = {
  HOME_COLLECTIONS:'/collections/home',
};

HOG.regex = {
  "EMAIL": /^([A-Za-z0-9_\-\.\+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
  "PHONE": /^[0-9]{10}$/,
  "NUMBER": /^[0-9]+$/,
  "SPECIAL_CHAR": /[<>]/i
};

HOG.domClass = {
  "OPEN" : 'open',
  "STATIC" : 'static',
  "SELECTED" : 'selected',
  "SHOW" : 'show',
  "HIDE" : 'hide'
};


HOG.ascii = {
  ESCAPE : 27,
  ENTER : 13
};

HOG.utils = {
  createCookie : function(name,value,days) {
    var expires ='';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      expires = "; expires="+date.toGMTString();
    }
    else  expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
  },

  readCookie : function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  },
  getUrlVars : function(tmUrl) {
    var vars = [], hash;
    var hashes = tmUrl.slice(tmUrl.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;

  },

  getDateDiff: function(endDate, startDate){
    // returns no. of days between two date objects
    return Math.ceil((endDate.getTime() - startDate.getTime())/(1000 * 3600 * 24));
  }
};

HOG.toggleOverlay = function() {
  var $overlay=  $('.fixed-overlay'), $body = $('body');
  if($overlay.hasClass('hide')) {
    $overlay.removeClass('hide');
    $body.addClass('noscroll');
  } else {
    $overlay.addClass('hide');
    $body.removeClass('noscroll');
  }
};

HOG.storelocalStorage = function(key, blog){
  localStorage.setItem(key, JSON.stringify(blog));
};
HOG.retrievelocalStorage = function(key){
  var retrievedObject = localStorage.getItem(key);
  return JSON.parse(retrievedObject);
};

HOG.jsonToQueryString = function(json) {
  return '?' +
    Object.keys(json).map(function(key) {
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(json[key]);
    }).join('&');
}


HOG.lazyLoadImages = function(container) {
  var imgTags = container.find('img[data-src]');

  imgTags.each(function(index, tag) {
    var $this = $(this);
    $this.attr('src', $this.attr('data-src'));

  });

};



(function() {
  var el = {
      $selectedLanguage: $('[name="language[]"]'),
      $selectedTheme: $('[name="theme[]"]'),
      $lazyImages : $('.img-lazy'),
      $desc : $('.js-desc'),
      $expandCategory : $('.js-expand'),
      $preferences : $('.js-preference'),
      $mobilePreferences : $('.js-mobile-preference'),
      $responsiveSignup : $('.js-responsive-signup'),
      $leftSlider : $('.js-slider'),
      $sliderDropdown : $('.js-slider .drop-down'),
      $toggleSlider : $('.js-toggle'),
      $codeOptions : $('.js-code-options'),
      $languageOptions : $('.js-language-options'),
      $otp : $('.js-send-otp'),
      $searchBack : $('.js-search-back svg'),
      $searchOptions : $('.js-search-options'),
      $mobileSearch : $('.js-mobile-search'),
      $resendOtp : $('.js-resend-otp'),
      $otpSignup : $('.js-signup-by-otp'),
      $autoSearch : $('.js-autoSearch'),
      $searchInput : $('.js-searchInput'),
      $codeAhead : $('.js-codeAhead'),
      $languageAhead : $('.js-languageAhead'),
      $typeAhead : $('.js-typeAhead'),
      $overlay :  $('.fixed-overlay'),
      $magicBox: $('.magic-box'),
      $preferencesMagicBox: $('.magic-box.preferences'),
      $otpMagicBox: $('.magic-box.otp'),
      $magicBoxClose: $('.magic-box .js-close'),
    },
    scrollIndex = {}, scrollIndices, indexLength;


  el.$lazyImages.each(function(index, tag) {
    var $this = $(this);
    if(scrollIndex[$this.attr('data-scroll')]){
      scrollIndex[$this.attr('data-scroll')].push($this);
    } else {
      scrollIndex[$this.attr('data-scroll')] = [$this]; // create new images array
    }
  });
  el.$magicBoxClose.click(function () {
    el.$magicBox.removeClass('show');
    $('body').removeClass('noscroll');;
    el.$codeAhead.removeClass(HOG.domClass.SHOW)
  });
  el.$expandCategory.click(function () {
    el.$expandCategory.css("background", "none");
    var $this = $(this);
    $(this).css("background-color", "#f4c949");
    $('.sub-menu').css("display", "none");
    $this.children('.sub-menu').css("display", "block");
  });
  el.$preferences.click(function () {
    el.$magicBox.removeClass('show');
    if(el.$overlay.hasClass('hide')) {
      el.$overlay.removeClass('hide');
    }else{
      return true;
    }
    el.$preferencesMagicBox.addClass('show');
  });
  el.$mobilePreferences.click(function () {
    el.$codeAhead.removeClass(HOG.domClass.SHOW);
    el.$magicBox.removeClass('show');
    el.$leftSlider.addClass("slide-out");
    el.$leftSlider.removeClass("slide-in");
    el.$preferencesMagicBox.addClass('show');
  });
  el.$responsiveSignup.click(function () {
    el.$codeAhead.removeClass(HOG.domClass.SHOW);
    el.$magicBox.removeClass('show');
    el.$leftSlider.addClass("slide-out");
    el.$leftSlider.removeClass("slide-in");
    el.$signupPhoneMagicBox.addClass('show');
  });

  scrollIndices = Object.keys(scrollIndex);
  indexLength = scrollIndices.length;
  var myTimer = function(sec) {
    var sec = sec || 60, timer;
    clearInterval(timer);
    timer = setInterval(function() {
      el.$resendOtp.text("00:" + --sec);
      if (sec == 0) {
        clearInterval(timer);
        el.$resendOtp.text("resend OTP");
        console.log('done');
      }
    }, 1000);
  }


  $(window).on('scroll', function () {
    var scrollY = window.scrollY,
      loadImage = function(items) {
        items.forEach(function(item) {
          var $this = $(item);
          if($this.attr('data-src')){
            $this.attr('src', $this.attr('data-src'));
            $this.attr('data-src', '');
          }
        });
      }
    if (!($(document).height() - $(window).height() > 400)) {
      return;
    }
    scrollY = (parseInt(String(scrollY)[0]))*Math.pow(10,String(scrollY).length-1) ;
    if(scrollIndex[scrollY]){
      loadImage(scrollIndex[scrollY])
    }
    while(indexLength){
      indexLength-=1;
      if(scrollY> scrollIndices[indexLength]) {
        loadImage(scrollIndex[scrollIndices[indexLength]])
      }
    }
  });


  var hideMagicBox = function () {
    el.$magicBox.removeClass('show');
    el.$overlay.addClass('hide');
  };

  el.$magicBoxClose.click(hideMagicBox);

  $(document).keydown(function (event) {
    if (event.which == HOG.ascii.ESCAPE) {
      hideMagicBox();
    }
  });


  /**
   * @summary - Autocomplete handling
   */

  // el.$autoSearch.autocomplete({
  //   serviceUrl : '/autocomplete',
  //   minChars: 2,
  //   paramName : 'token',
  //   maxHeight:500,
  //   autoSelectFirst : false,
  //   appendTo : '.search-box',
  //   showNoSuggestionNotice: true,
  //   triggerSelectOnValidInput : false,
  //   onSearchComplete : function(query, results) {
  //     $('.search-box').removeClass('loading');
  //   },
  //   onSelect : function(suggestion) {
  //     dataLayer.push({
  //       event: 'autoSearch',
  //       autoSearchInput : suggestion.value
  //     });
  //   },
  //   onSearchStart : function() {
  //     $('.search-box').addClass('loading');
  //     HOG.searchValue = $(this).val();
  //   },
  //   onSearchError : function(query, jqXHR, textStatus, errorThrown) {
  //     console.log(query); console.log(jqXHR);
  //     console.log(textStatus);
  //     console.log(errorThrown);
  //   },
  //   beforeRender : function(container, suggestions) {
  //     var el = $('<div>'), val= $(this).val();
  //     el.html('<a href="/search?q=' + val + '">More results</a>');
  //     el.addClass('search-link');
  //     container.append(el);
  //   },
  //   formatResult: function (suggestion, currentValue) {
  //     var head = '<div class="row">';
  //     switch(suggestion.type){
  //       case "VIDEO": {
  //         head += '<div class="col-xs-12 head">' + suggestion.type + '</div>';
  //         head = head + '<a class="col-xs-12 tr-search-item category '+ suggestion.type +'" href="/media/'+ suggestion.data.slug +'">' +
  //           '<div class="col-xs-5">' +
  //           '<div class="item" >' +
  //           '<img style="margin: 5px 0" src="' + suggestion.data.image_url +'" >';
  //         if(suggestion.data.premium_required){
  //           head = head + '<div class="ribbon"><span>premium</span></div>';
  //         }
  //         head = head + '</div>' +
  //           '</div>' +
  //           '<div class="col-xs-7">' +
  //           '<div class="name">' + suggestion.data.title +'</div>' +
  //           '</div>' +
  //           '</a>';
  //         head+= '</div>';
  //         break;
  //       }
  //       case"AUDIO":{
  //         head += '<div class="col-xs-12 head">' + suggestion.type + '</div>';
  //         head = head + '<a class="col-xs-12 tr-search-item category ' + suggestion.type + '" href="/media/' + suggestion.data.slug + '"><div class="col-xs-5"><div class="item"><img style="margin: 5px 0" src="' + suggestion.data.image_url + '">';
  //         if(suggestion.data.premium_required){
  //           head = head + '<div class="ribbon"><span>premium</span></div>';
  //         }
  //         head = head + '</div></div><div class="col-xs-7"><div class="name">' + suggestion.data.title + '</div></div></a>';
  //         head+= '</div>';
  //         break;
  //       }
  //       case"PLAYLIST":{
  //         head += '<div class="col-xs-12 head">' + suggestion.type + '</div>';
  //         head = head + '<a class="col-xs-12 tr-search-item category ' + suggestion.type + '" href="/playlist/' + suggestion.data.slug + '"><div class="col-xs-5"><div class="item"><img style="margin: 5px 0" src="' + suggestion.data.image_url + '">';
  //         if(suggestion.data.premium_required){
  //           head = head + '<div class="ribbon"><span>premium</span></div>';
  //         }
  //         head = head + '</div></div><div class="col-xs-7"><div class="name">' + suggestion.data.title + '</div></div></a>';
  //         head+= '</div>';
  //         break;
  //       }
  //       case"GURUS":{
  //         head += '<div class="col-xs-12 head">' + suggestion.type + '</div>';
  //         head = head +  '<a class="col-xs-12 tr-search-item category '+ suggestion.type +'" href="/entity/'+ suggestion.data.slug +'"><div class="col-xs-5"><div class="item"><img style="margin: 5px 0" src="' + suggestion.data.image_url + '">';
  //         if(suggestion.data.premium_required){
  //           head = head + '<div class="ribbon"><span>premium</span></div>';
  //         }
  //         head = head + '</div></div><div class="col-xs-7"><div class="name">' + suggestion.data.title + '</div></div></a>';
  //         head+= '</div>';
  //         break;
  //       }
  //       case"GODS":{
  //         head += '<div class="col-xs-12 head">' + suggestion.type + '</div>';
  //         // head += '<div class="col-xs-12 head" style="margin-bottom:10px;">' + suggestion.type + '</div>';
  //         head = head + '<a class="col-xs-12 tr-search-item category ' + suggestion.type + '" href="/entity/' + suggestion.data.slug + '"><div class="col-xs-5"><div class="item"><img style="margin: 5px 0" src="' + suggestion.data.image_url + '">';
  //         if(suggestion.data.premium_required){
  //           head = head + '<div class="ribbon"><span>premium</span></div>';
  //         }
  //         head = head + '</div></div><div class="col-xs-7"><div class="name">' + suggestion.data.title + '</div></div></a>';
  //         head+= '</div>';
  //         break;
  //       }
  //       case"SHRINES":{
  //         head += '<div class="col-xs-12 head">' + suggestion.type + '</div>';
  //         // head += '<div class="col-xs-12 head" style="margin-bottom:10px;">' + suggestion.type + '</div>';
  //         head = head + '<a class="col-xs-12 tr-search-item category ' + suggestion.type + '" href="/entity/' + suggestion.data.slug + '"><div class="col-xs-5"><div class="item"><img style="margin: 5px 0" src="' + suggestion.data.image_url + '">';
  //         if(suggestion.data.premium_required){
  //           head = head + '<div class="ribbon"><span>premium</span></div>';
  //         }
  //         head = head + '</div></div><div class="col-xs-7"><div class="name">' + suggestion.data.title + '</div></div></a>';
  //         head+= '</div>';
  //         break;
  //       }
  //       case"GRANTHA":{
  //         head += '<div class="col-xs-12 head">' + suggestion.type + '</div>';
  //         // head += '<div class="col-xs-12 head" style="margin-bottom:10px;">' + suggestion.type + '</div>';
  //         head = head + '<a class="col-xs-12 tr-search-item category ' + suggestion.type + '" href="/entity/' + suggestion.data.slug + '"><div class="col-xs-5"><div class="item"><img style="margin: 5px 0" src="' + suggestion.data.image_url + '">';
  //         if(suggestion.data.premium_required){
  //           head = head + '<div class="ribbon"><span>premium</span></div>';
  //         }
  //         head = head + '</div></div><div class="col-xs-7"><div class="name">' + suggestion.data.title + '</div></div></a>';
  //         head+= '</div>';
  //         break;
  //       }
  //       case"TOPICS":{
  //         head += '<div class="col-xs-12 head">' + suggestion.type + '</div>';
  //         // head += '<div class="col-xs-12 head" style="margin-bottom:10px;">' + suggestion.type + '</div>';
  //         head = head + '<a class="tr-search-item category ' + suggestion.type + '" href="/entity/' + suggestion.data.slug + '"><div class="col-xs-5"><div class="item"><img style="margin: 5px 0" src="' + suggestion.data.image_url + '">';
  //         if(suggestion.data.premium_required){
  //           head = head + '<div class="ribbon"><span>premium</span></div>';
  //         }
  //         head = head + '</div></div><div class="col-xs-7"><div class="name">' + suggestion.data.title + '</div></div></a>';
  //         head+= '</div>';
  //         break;
  //       }
  //       case"MORE":{
  //         head += '<div class="col-xs-12 head">' + suggestion.type + '</div>';
  //         // head += '<div class="col-xs-12 head" style="margin-bottom:10px;">' + suggestion.type + '</div>';
  //         head = head + '<a class="col-xs-12 tr-search-item category ' + suggestion.type + '" href="/entity/' + suggestion.data.slug + '"><div class="col-xs-5"><div class="item"><img style="margin: 5px 0" src="' + suggestion.data.image_url + '">';
  //         if(suggestion.data.premium_required){
  //           head = head + '<div class="ribbon"><span>premium</span></div>';
  //         }
  //         head = head +  '</div></div><div class="col-xs-7"><div class="name">' + suggestion.data.title + '</div></div></a>';
  //         head+= '</div>';
  //         break;
  //       }
  //     }
  //     return head;
  //   },
  //   transformResult: function(response) {
  //     response = JSON.parse(response);
  //     var results = [];
  //     if(response.error) {
  //       results.push({value: response.message, data: {}});
  //     } else {
  //       $.each(response.results, function (indx, dataItem) {
  //         $.each(dataItem.results, function (index, data) {
  //           if(index < 1) {
  //             results.push({value: data.title, type: dataItem.type, data: data, id: dataItem.type_id, index: index});
  //           }
  //         });
  //       });
  //     }
  //     return { suggestions: results};
  //   }
  // });

  el.$autoSearch.on({
    focus: function() {
      if($(this).val().length){
        return;
      }
      HOG.lazyLoadImages(el.$typeAhead)
      el.$typeAhead.addClass(HOG.domClass.SHOW)

    },
    blur: function(event) {
      el.$typeAhead.removeClass(HOG.domClass.SHOW)
    },
    keydown:  function(event) {
      HOG.searchValue = $(this).val();
      if (HOG.searchValue) {
        el.$typeAhead.removeClass(HOG.domClass.SHOW);
        if (event.which == HOG.ascii.ENTER) {
          dataLayer.push({
            event: 'autoSearch',
            autoSearchInput: HOG.searchValue
          });
          location.href = location.protocol + '//' + location.host + "/search/?q=" + HOG.searchValue;
        }
      }else {
        el.$typeAhead.addClass(HOG.domClass.SHOW)
      }
    }
  });



  el.$searchInput.click(function(){
    var value = el.$autoSearch[0].value;
    if(value && value.length >= 2){
      window.location.href="/search?q=" + value;
    }else{
      return false;
    }
  });

  $('.js-typeAhead a').mousedown(function() {
    window.location.href= $(this).attr('href')
  });

  el.$searchBack.click(function() {
    el.$searchOptions.css("visibility", "hidden");
    HOG.toggleOverlay();
  });
  el.$overlay.click(function () {
    el.$magicBox.removeClass(HOG.domClass.SHOW);
    HOG.toggleOverlay();
    if(el.$leftSlider.hasClass("slide-in")){
      el.$leftSlider.addClass("slide-out");
      el.$leftSlider.removeClass("slide-in");
    }
    if(el.$searchOptions.css("visibility") == "visible"){
      el.$searchOptions.css("visibility", "hidden");
    }
  });
  $('.js-loadMore').click(function () {
    var $btn_ref = $(this);
    if ($btn_ref.hasClass('disabled')) {
      return;
    }
    $btn_ref.addClass('disabled');
    var page = parseInt($btn_ref.attr('data-page'));
    var url = ($btn_ref.attr('data-url')) + page;
    $.ajax({
      url: url,
      dataType: 'html',
      success: function (response) {
        if (response) {
          $('.js-results').append(response);
          $btn_ref.attr('data-page', ++page);
          $btn_ref.removeClass('disabled');
        } else {
          $btn_ref.hide();
        }

      }, error: function () {
        $btn_ref.hide();
        alert('Something went wrong');
      }
    });
  })

  el.$toggleSlider.click(function() {
    var isOpen = el.$leftSlider.hasClass('slide-in');
    if(isOpen){
      el.$sliderDropdown.addClass("hide");
      el.$leftSlider.addClass("slide-out");
      el.$leftSlider.removeClass("slide-in");
      window.setTimeout(function () {
        el.$leftSlider.addClass("hide");
      }, 500);
    }else{
      el.$leftSlider.addClass("slide-in");
      el.$leftSlider.removeClass("hide");
      el.$leftSlider.removeClass("slide-out");
    }
    HOG.toggleOverlay();
  });
})();



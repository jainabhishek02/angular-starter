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
  HOME_COLLECTIONS:'https://api.flickr.com/services/rest/',
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


HOG.lazyLoadImages = function(container) {
  var imgTags = container.find('img[data-src]');

  imgTags.each(function(index, tag) {
    var $this = $(this);
    $this.attr('src', $this.attr('data-src'));

  });

};


(function() {
  var el = {
      $lazyImages : $('.img-lazy'),
      $searchInput : $('.js-searchInput'),
      $typeAhead : $('.js-typeAhead'),
      $overlay :  $('.fixed-overlay'),
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

  var urlJson ={
    api_key:"bc487e42bd36a98762e83946bdfa1a26",
    extras:'url_m,url_c,url_l,url_h,url_o',
    format:'json',
    method:'flickr.photos.getRecent',
    nojsoncallback:'1',
    page:'1',
    per_page:'15',
    text:''
  }

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
  // $(window).scroll(function() {
  //   if($(window).scrollTop() + $(window).height() > $(document).height() - 150){
  //     var $collectionResults = $('.js-loading');
  //     var page = $collectionResults.data("page");
  //     if(urlJson.page != page){
  //       urlJson.page = page;
  //       var fetchUrl = HOG.urls.HOME_COLLECTIONS + HOG.jsonToQueryString(urlJson);
  //       $.ajax({
  //         url: fetchUrl,
  //         success: function (response) {
  //           if (response) {
  //             console.log(response);
  //             var photos = response.photos.photo;
  //             $collectionResults.attr('data-page', ++page);
  //           }else{
  //
  //           }
  //         }, error: function () {
  //         }
  //       });
  //     }
  //   }
  //
  // });

  el.$overlay.click(function () {
    $(".magic-box").removeClass(HOG.domClass.SHOW);
    HOG.toggleOverlay();
  });

})();


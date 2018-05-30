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
  $(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() > $(document).height() - 150){
      var $collectionResults = $('.js-loading');
      var page = $collectionResults.data("page");
      if(urlJson.page != page){
        urlJson.page = page;
        var fetchUrl = HOG.urls.HOME_COLLECTIONS + HOG.jsonToQueryString(urlJson);
        $.ajax({
          url: fetchUrl,
          success: function (response) {
            if (response) {
              console.log(response);
              var photos = response.photos.photo;
              $collectionResults.attr('data-page', ++page);
            }else{

            }
          }, error: function () {
          }
        });
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

  el.$overlay.click(function () {
    $(".magic-box").removeClass(HOG.domClass.SHOW);
    HOG.toggleOverlay();
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
  });

})();

var UTIL = function() {
    function e(e) {
      if (h || t()) h = !0, e();
      else {
        var n = function() {
          t() && (h = !0, window.removeEventListener("load", e), document.removeEventListener("readystatechange", n), e())
        };
        document.addEventListener("readystatechange", n), window.addEventListener("load", e)
      }
    }

    function t() {
      return "complete" === document.readyState || "loading" !== document.readyState && !document.documentElement.doScroll
    }

    function n(e, t) {
      e.classList ? e.classList.add(t) : e.className += " " + t
    }

    function a(e, t) {
      e.classList ? e.classList.remove(t) : e.className = e.className.replace(new RegExp("(^|\\b)" + t.split(" ").join("|") + "(\\b|$)", "gi"), " ")
    }

    function i(e, t) {
      return e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className)
    }

    function r(e) {
      try {
        var t = new CustomEvent(e)
      } catch (n) {
        (t = document.createEvent("CustomEvent")).initCustomEvent(e, !0, !0, null)
      }
      document.dispatchEvent(t)
    }

    function d(e, t, n) {
      var a = new XMLHttpRequest;
      return a.open("GET", e, !0), a.onreadystatechange = function() {
        4 === a.readyState && (a.status >= 200 && a.status < 400 ? t(a.responseText) : n(a.responseText))
      }, a.send(), a
    }

    function l(e) {
      var t = ("; " + document.cookie).split("; " + e + "=");
      if (2 == t.length) return t.pop().split(";").shift()
    }

    function c(e) {
      g = e
    }

    function u() {
      return g || !1
    }
    var g, h = !1;
    return {
      ready: e,
      addClass: n,
      removeClass: a,
      hasClass: i,
      triggerEvent: r,
      getRequest: d,
      setSignedIn: c,
      isSignedIn: u,
      getCookie: l
    };
    var m
  }(),
  ENDLESS_SCROLLING = function() {

    function init() {
      document.querySelector(SELECTOR_NEXT_PAGE) && (elPagination = document.querySelector(SELECTOR_PAGINATION)) && (seed = elPagination.getAttribute("data-seed"), setBottomThreshold(), restoreState(), checkIfNearBottom(), bindEvents())
    }

    function terminate() {
      unbindEvents()
    }

    function setBottomThreshold() {
      document.querySelector(".footer") && (bottomThreshold += BOTTOM_THRESHOLD_FOOTER_ADDITION)
    }

    function bindEvents() {
      document.addEventListener("scroll", checkIfNearBottom), window.addEventListener("beforeunload", saveScrollPosition)
    }

    function unbindEvents() {
      document.removeEventListener("scroll", checkIfNearBottom), window.removeEventListener("beforeunload", saveScrollPosition)
    }

    function checkIfNearBottom() {
      if (0 === loadingPages.length && window.pageYOffset + window.innerHeight > document.body.scrollHeight - bottomThreshold) {
        var e = document.querySelector(SELECTOR_NEXT_PAGE);
        if (!e) return;
        var t = e.getAttribute("href");
        console.log(t);
        if (!t) return;
        bottomThreshold <= BOTTOM_THRESHOLD_SMALL + BOTTOM_THRESHOLD_FOOTER_ADDITION && (bottomThreshold += BOTTOM_THRESHOLD_ADDITION), UTIL.removeClass(document.querySelector(SELECTOR_LOADING_BAR), "hidden");
        var n = t + "&format=js";
        if (history.state !== undefined) {
          var a;
          null !== history.state && history.state.pages ? a = history.state : (a = {
            pages: []
          }, history.state && history.state.activeHomeTab && (a.activeHomeTab = history.state.activeHomeTab)), a.pages.push(n), history.replaceState(a, "")
        }
        loadPage(n)
      }
    }

    function restoreState() {
      if (history.state && history.state.pages && history.state.pages.length > 0) {
        if (seed != history.state.seed && history.state.pages.length > 3) return;
        for (var e = 0; e < history.state.pages.length; e++) loadPage(history.state.pages[e]);
        document.addEventListener("new-page", function t() {
          0 == loadingPages.length && (document.removeEventListener("new-page", t), window.scrollTo(0, history.state.pos))
        })
      }
    }

    function saveScrollPosition() {
      if (history.state && history.state.pages) {
        var e = history.state;
        e.pos = window.pageYOffset, e.seed = seed, history.replaceState(e, "")
      }
    }

    function loadPage(url) {
      url += "&seed=" + seed;
      var index = loadingPages.length;

      loadingPages.push(url);
      var request = UTIL.scriptRequest(url);
      request.onload = function() {
        if (loadingPages.splice(loadingPages.indexOf(url), 1), loadedPages[index] = request.responseText, 0 == loadingPages.length) {
          for (var i = 0; i < loadedPages.length; i++) elPagination.innerHTML = "", eval(loadedPages[i]);
          loadedPages = [], UTIL.addClass(document.querySelector(SELECTOR_LOADING_BAR), "hidden"), UTIL.triggerEvent("new-page")
        }
      }, request.send()
    }
    var SELECTOR_NEXT_PAGE = ".pagination .next_page", SELECTOR_PAGINATION = ".js-pagination";
    SELECTOR_LOADING_BAR = ".js-loading", BOTTOM_THRESHOLD_SMALL = 600, BOTTOM_THRESHOLD_FOOTER_ADDITION = 255, BOTTOM_THRESHOLD_ADDITION = 500, bottomThreshold = BOTTOM_THRESHOLD_SMALL, loadingPages = [], loadedPages = [];
    var elPagination, seed;
    return UTIL.ready(init), {
      init: init,
      terminate: terminate
    }
  }();
var rowGrid = function(e, t) {
  function n(e) {
    for (var t = [e];
         (e = e.nextSibling) && 9 !== e.nodeType;) 1 === e.nodeType && t.push(e);
    return t
  }

  function a(e, t, n) {
    var a = 0,
      i = [],
      r = (n = Array.prototype.slice.call(n || e.querySelectorAll(t.itemSelector))).length;
    singleImagePerRow = !!window.matchMedia && !window.matchMedia("(min-width:" + t.minWidth + "px)").matches;
    for (var o, s, d, l = getComputedStyle(e), c = Math.floor(e.getBoundingClientRect().width) - parseFloat(l.getPropertyValue("padding-left")) - parseFloat(l.getPropertyValue("padding-right")), u = [], g = 0; g < r; ++g)(o = n[g].getElementsByTagName("img")[0]) ? ((s = parseInt(o.getAttribute("width"))) || o.setAttribute("width", s = o.offsetWidth), (d = parseInt(o.getAttribute("height"))) || o.setAttribute("height", d = o.offsetHeight), u[g] = {
      width: s,
      height: d
    }) : (n.splice(g, 1), --g, --r);
    for (var h = 0; h < r; ++h) {
      if (n[h].classList ? (n[h].classList.remove(t.firstItemClass), n[h].classList.remove(t.lastRowClass)) : n[h].className = n[h].className.replace(new RegExp("(^|\\b)" + t.firstItemClass + "|" + t.lastRowClass + "(\\b|$)", "gi"), " "), a += u[h].width, i.push(n[h]), h === r - 1)
        for (var m = 0; m < i.length; m++) {
          0 === m && (i[m].className += " " + t.lastRowClass);
          var f = "width: " + u[h + parseInt(m) - i.length + 1].width + "px;height: " + u[h + parseInt(m) - i.length + 1].height + "px;";
          m < i.length - 1 && (f += "margin-right:" + t.minMargin + "px"), i[m].style.cssText = f
        }
      if (a + t.maxMargin * (i.length - 1) > c || singleImagePerRow) {
        var p = a + t.maxMargin * (i.length - 1) - c,
          v = i.length;
        if ((t.maxMargin - t.minMargin) * (v - 1) < p) {
          var T = t.minMargin;
          p -= (t.maxMargin - t.minMargin) * (v - 1)
        } else {
          T = t.maxMargin - p / (v - 1);
          p = 0
        }
        var w, L = null,
          y = 0;
        for (m = 0; m < i.length; m++) {
          w = i[m];
          var E = u[h + parseInt(m) - i.length + 1].width,
            S = E - E / a * p;
          L = L || Math.round(u[h + parseInt(m) - i.length + 1].height * (S / E)), y + 1 - S % 1 >= .5 ? (y -= S % 1, S = Math.floor(S)) : (y += 1 - S % 1, S = Math.ceil(S));
          f = "width: " + S + "px;height: " + L + "px;";
          m < i.length - 1 && (f += "margin-right: " + T + "px"), w.style.cssText = f, 0 === m && t.firstItemClass && (w.className += " " + t.firstItemClass)
        }
        i = [], a = 0
      }
    }
  }
  if (null !== e && e !== undefined)
    if ("appended" === t) {
      t = JSON.parse(e.getAttribute("data-row-grid"));
      var i = n(e.getElementsByClassName(t.lastRowClass)[0]);
      a(e, t, i)
    } else t ? (t.resize === undefined && (t.resize = !0), t.minWidth === undefined && (t.minWidth = 0), t.lastRowClass === undefined && (t.lastRowClass = "last-row")) : t = JSON.parse(e.getAttribute("data-row-grid")), a(e, t), e.setAttribute("data-row-grid", JSON.stringify(t)), t.resize && window.addEventListener("resize", function() {
      a(e, t)
    })
};
PhotoGrid = function() {
  function e() {
    (a = document.querySelector(".carbon-ad-in-photos img")) && (n(), window.addEventListener("resize", n)), t(".photos")
  }

  function t(e) {
    var t = {
      minMargin: 10,
      maxMargin: 10,
      itemSelector: ".photo-item",
      firstItemClass: "first-item",
      lastRowClass: "last-row",
      resize: !0,
      minWidth: 426
    };
    rowGrid(document.querySelector(e), t)
  }

  function n() {
    var e = window.innerWidth,
      t = 180;
    e < 600 ? t = 2 * e : e < 1e3 ? t = 280 : e < 1100 && (t = 240), a.setAttribute("width", t)
  }
  var a;
  return UTIL.ready(e), {
    init: t
  }
}(),
  function() {
    function e() {
      (UTIL.getCookie("pexels_auth") || o()) && (UTIL.setSignedIn(!0), UTIL.ready(t)), l = !1
    }

    function t() {
      a(), i()
    }

    function n(e) {
      var t = document.querySelector(".js-avatar");
      if (t) {
        var n;
        try {
          n = e && e.avatar || decodeURIComponent(UTIL.getCookie("avatar_url") || "")
        } catch (a) {
          return
        }
        t.setAttribute("src", n)
      }
    }

    function a() {
      UTIL.addClass(document.body, "signed-in")
    }

    function i() {
      var e = o();
      e && (r(e), n(e))
    }

    function r(e) {
      var t = document.querySelector(".js-user-name");
      t && (t.innerText = e.name)
    }

    function o() {
      var e = localStorage.user;
      if (!e) return s(), null;
      var t = JSON.parse(e);
      return t.avatar || s(), t
    }

    function s() {
      if (!l) {
        l = !0;
        var e = new XMLHttpRequest;
        e.open("GET", "/me/", !0), e.setRequestHeader("Accept", "application/json, text/*"), e.onreadystatechange = function() {
          4 === e.readyState && e.status >= 200 && e.status < 400 && (d(e.responseText), i())
        }, e.send()
      }
    }

    function d(e) {
      var t;
      try {
        t = JSON.parse(e)
      } catch (a) {
        return void console.log(a)
      }
      var n = {
        name: t.first_name,
        hero: "no_hero" !== t.hero_status,
        avatar: t.avatar,
        photographer: t.photographer
      };
      localStorage.user = JSON.stringify(n)
    }
    var l = !0;
    e()
  }();



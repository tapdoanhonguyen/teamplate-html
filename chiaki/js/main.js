var popularSearch = [];
$(document).ready(function () {
  $(".segment-help").click(function () {
    $("body").addClass("open-segment-popup");
    $(".segment-order-tracking")
      .addClass("js-hide-content")
      .removeClass("js-show-content");
  });

  $(".search-target-select").click(function () {
    $(".search-target-list").addClass("open");
  });

  $(document).mouseup(function (e) {
    var container = $(".search-target-wrapper");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      $(".search-target-list").removeClass("open");
    } else {
      $(".search-target-list").addClass("open");
    }
  });

  $(".search-target-item-text").click(function () {
    var text = $(this).text();
    $(this).addClass("active");
    $(".search-target-list").removeClass("open");
    $(".search-target-text").text(text);
    $(this)
      .parent()
      .siblings()
      .find(".search-target-item-text")
      .removeClass("active");
  });

  $(".btn-cancel-segment").click(function () {
    $(".segment-order-form ")
      .addClass("js-hide-content")
      .removeClass("js-show-content");
    $(".graybackground")
      .addClass("js-hide-content")
      .removeClass("js-show-content");
  });

  $(".popup-segment-close, .popup-segment-background").click(function () {
    $(".segment-order-form")
      .removeClass("js-hide-content")
      .addClass("js-show-content");
    $(".segment-order-tracking ")
      .toggleClass("js-show-content")
      .toggleClass("js-hide-content");
    $("body").removeClass("open-segment-popup");
  });

  if (screen.width > 1194) {
    $(".site-navigation-icon").click(function () {
      $(".list-cat").removeClass("navbar-fixed");
      $(".navbar-background").removeClass("show-background");
      $(".site-navigation-icon").removeClass("show-navigation");
    });

    $(".site-navigation-icon").hover(function () {
      $(".list-cat").addClass("navbar-fixed");
      $(".navbar-background").addClass("show-background");
      $(".site-navigation-icon").addClass("show-navigation");
      $("#popular-search-suggestion, #search-suggestion").css(
        "display",
        "none"
      );
    });
  } else {
    $(".site-navigation-icon").click(function () {
      $(".list-cat").toggleClass("navbar-fixed");
      $(".navbar-background").toggleClass("show-background");
      $(".site-navigation-icon").toggleClass("show-navigation");
      $("#popular-search-suggestion, #search-suggestion").css(
        "display",
        "none"
      );
    });
  }

  $(".navbar-background, .txt-search").click(function () {
    $(".list-cat").removeClass("navbar-fixed");
    $(".navbar-background").removeClass("show-background");
    $(".site-navigation-icon").removeClass("show-navigation");
  });

  $(".alphabet-name").hover(function () {
    $(".menu-brand-list-item").removeClass("active");
    $(this).parent().addClass("active");
  });
  $(".lev1menu-link").click(function () {
    $(".list-cat").removeClass("navbar-fixed");
    $(".navbar-background").removeClass("show-background-loading");
  });

  $(window).scroll(function () {
    var headerH = $("#header").height();
    var navH = $(".main-bar").height();

    if ($(".chiaki-banner-wrapper").is(":visible")) {
      var slideH = $(".chiaki-banner-wrapper").height();
      var navPosition = headerH + navH + slideH;
    } else {
      var navPosition = headerH + navH;
    }

    if ($(window).scrollTop() > navPosition) {
      // Show menu fix
      var empyHeight = $(".header-mid").height();
      var empyHeightWrap = empyHeight + 22;
      $(".header-mid").addClass("navigation-fixed blue");
      $(".header-empty").css("height", empyHeightWrap);
    } else {
      // Hide menu fix
      if ($(".header-mid").hasClass("navigation-fixed")) {
        $(".header-mid").removeClass("navigation-fixed blue");
        $(".header-empty").removeAttr("style");
        $(".list-cat").removeClass("navbar-fixed");
        $(".navbar-background").removeClass("show-background");
        $(".site-navigation-icon").removeClass("show-navigation");
      }
    }
  });

  $("ul.list-cat").menuAim({
    activate: function (row) {
      var submenuSelector = $(row).data("submenuId");
      $("#" + submenuSelector).show();
      $(row).addClass("active");
      // $('#bg-dummy').addClass('active');
    },
    deactivate: function (row) {
      var submenuSelector = $(row).data("submenuId");
      $("#" + submenuSelector).hide();
      $(row).removeClass("active");
    },
    exitMenu: function () {
      $("ul.list-cat > li").removeClass("active");
      $("ul.list-cat .submenu-wrapper").hide();
      // $('#bg-dummy').removeClass('active');
    },
  });

  $("ul.list-cat li").click(function (e) {
    e.stopPropagation();
  });

  $.get("/get-popular-search").success(function (response) {
    if (response && response.status && response.status == "successful") {
      popularSearch = response.data;
    }
  });
  $("body").click(function () {
    $(".js-results, .loading-icon").hide();
  });

  $(".search-box .txt-search").keyup(function (event) {
    $(this).parents(".box-shadow-search").addClass("forcus-search");
    if (
      event.keyCode != 13 &&
      event.keyCode != 37 &&
      event.keyCode != 38 &&
      event.keyCode != 39 &&
      event.keyCode != 40
    ) {
      if (searchSuggestionTimeOut != null) {
        clearTimeout(searchSuggestionTimeOut);
      }
      searchSuggestionTimeOut = setTimeout(function () {
        search(jQuery(".search-box .txt-search").val());
      }, 100);
      $(".loading-icon").show();
    } else if (event.keyCode == 38) {
      selectUpSearchSuggestion();
    } else if (event.keyCode == 40) {
      selectDownSearchSuggestion();
    } else if (event.keyCode == 13) {
      if (activeSearchSuggestionIdx >= 0) {
        selectSearchSuggestionResult();
      } else {
        var keyword = $(".search-box .txt-search").val();
        if (keyword == "" || typeof keyword == "undefined") {
          return false;
        } else {
          var urlSearch = "/search?q=" + keyword;
          if (
            $(".search-target-text").text().trim() == "Trong shop nĂ y" &&
            $(".search-target-text").data("store-id")
          ) {
            urlSearch +=
              "&storeId=" + $(".search-target-text").data("store-id");
          }
          window.location.href = urlSearch;
        }
      }
    }
    event.stopPropagation();
  });
});

var searchSuggestionTimeOut = null;
var searchSuggestionCount = 0;
var activeSearchSuggestionIdx = -1;
var searchRequest = null;
var currentHeaderIndex = 0;
var checkKeyword = null;
function search(keyword) {
  if (searchRequest != null) {
    searchRequest.abort();
  }
  if (keyword.length <= 2) {
    $(".js-results").hide();
    $(".loading-icon").hide();
    return;
  }
  if (keyword.length >= 5) {
    if (checkKeyword != null) {
      clearTimeout(checkKeyword);
      checkKeyword = null;
    }
    checkKeyword = setTimeout(function () {
      $.ajax({
        url: "/product/async-check-keyword-search",
        type: "post",
        dataType: "json",
        data: {
          keyword: keyword,
          pageSize: 6,
          pageId: 0,
        },
        success: function (data) {},
      });
    }, 5000);
  }
  searchRequest = $.ajax({
    url: "/product/async-search",
    type: "post",
    dataType: "json",
    data: {
      keyword: keyword,
      pageSize: 5,
      pageId: 0,
    },
    success: function (data) {
      clearSearchSuggestion();
      if (
        (data && data.status == "successful" && data.result.length > 0) ||
        data.stores.length > 0
      ) {
        searchSuggestionCount =
          data.result.length + data.productInCategory.length;
        var search = $("#keyword").val();
        data.popularKeyword.forEach(function (item) {
          var keywordTemplate = $.parseHTML(data.templates.keyword);
          $(keywordTemplate)
            .find(".popular-keyword-item")
            .attr("href", "/search?q=" + item.keyword)
            .html(item.keyword);
          $("#search-keyword-popular-suggestion").append(keywordTemplate);
        });

        data.productInCategory.forEach(function (item) {
          var categoryTemplate = $.parseHTML(data.templates.category);
          $(categoryTemplate)
            .find(".search-in-category")
            .attr("href", "/search?q=" + search + "&ctg=" + item.id)
            .html(
              "<b>" +
                search +
                "</b>" +
                " trong <span>" +
                item.title +
                '</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-right-square" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"/> </svg>'
            );
          $("#search-category-suggestion").append(categoryTemplate);
        });

        $("#search-store-suggestion .store-suggestion-item").empty();
        if (
          data.stores &&
          Array.isArray(data.stores) &&
          data.stores.length != 0
        ) {
          var storeTemplate = "";
          data.stores.forEach(function (item) {
            storeTemplate +=
              '<a href="/' +
              item.code.toLowerCase() +
              "-st" +
              item.id +
              '" class="shop-result-info"><div class="shop-result-info-logo"><span></span></div><div class="shop-result-info-header">' +
              item.name +
              "</div></a>";
          });
          $("#search-store-suggestion .store-suggestion-item").append(
            storeTemplate
          );
          $("#search-store-suggestion").show();
        } else {
          $("#search-store-suggestion").hide();
        }

        if (
          (data.productInCategory.length > 5 &&
            data.stores.length > 1 &&
            data.popularKeyword.length > 5) ||
          (data.productInCategory.length > 3 &&
            data.stores.length > 0 &&
            data.popularKeyword.length < 3) ||
          data.stores.length < 1
        ) {
          $("#search-product-suggestion").removeClass("remove-product");
        } else {
          $("#search-product-suggestion").addClass("remove-product");
        }

        data.result.forEach(function (item) {
          var template = $.parseHTML(data.templates.suggestion);
          $(template).attr("id", "search-suggestion-template-" + item.id);
          $(template)
            .find(".link-search")
            .attr("href", "/" + item.slug);
          $(template)
            .find(".thumb-search img")
            .attr("src", data.image_url + item.image_url);
          $(template).find(".title-search").html(item.title);
          var hrefBtnBuyNow = "/" + item.slug;
          if (
            typeof item.url_buy != "undefined" &&
            item.url_buy != "" &&
            typeof item.stores != "undefined" &&
            item.stores.length > 0
          ) {
            if (
              item.stores[0].id != 1 ||
              (item.stores[0].id == 1 &&
                item.inventory > 0 &&
                !item.delivery_config)
            ) {
              hrefBtnBuyNow = item.url_buy;
              $(template)
                .find(".search-buy-now")
                .attr("data-store", item.stores[0].id);
              $(template).find(".search-buy-now").attr("data-id", item.id);
              $(template).find(".search-buy-now").attr("data-code", item.code);
            }
          }
          $(template).find(".search-buy-now").attr("href", hrefBtnBuyNow);
          var price =
            item.sale_price != null && item.sale_price > 0
              ? item.sale_price
              : item.price;
          var oldPrice =
            item.price != null &&
            item.price > 0 &&
            item.sale_price != null &&
            item.sale_price > 0 &&
            item.sale_price < item.price
              ? item.price
              : 0;
          $(template).find(".price-value").html(toMoneyString(price));
          if (oldPrice > 0) {
            $(template)
              .find(".old-price-value")
              .html(toMoneyString(oldPrice) + "<sup>Ä‘</sup>");
          } else {
            $(template).find(".old-price-value").html("");
          }
          $("#search-product-suggestion").append(template);
        });

        $(".js-more-search").html(
          '<div class="more-result-item"><span class="view-more-btn" onclick="viewMoreBtn(event);">Xem thĂªm káº¿t quáº£</span></div>'
        );
        $("#popular-search-suggestion").css("display", "none");
        $(".js-results").css("display", "block");
        $(".loading-icon").hide();
        if (data.result.length > 0) {
          $(".search-list-product-suggestion").show();
        }
      } else {
        $(".js-results").hide();
        $(".loading-icon").hide();
      }
    },
  });
}

function clearSearchSuggestion() {
  searchSuggestionCount = 0;
  activeSearchSuggestionIdx = -1;
  $("#search-keyword-popular-suggestion").html("");
  $("#search-category-suggestion").html("");
  $("#search-product-suggestion").html("");
  $(".search-list-product-suggestion").hide();
  $(".loading-icon").hide();
}

function selectUpSearchSuggestion() {
  if (activeSearchSuggestionIdx > 0) {
    activeSearchSuggestionIdx--;
  } else if (activeSearchSuggestionIdx == 0) {
    activeSearchSuggestionIdx = -1;
    $(".search-box .txt-search").select();
  } else {
    activeSearchSuggestionIdx = searchSuggestionCount - 1;
  }
  activeSearchSuggestion();
}
function selectDownSearchSuggestion() {
  if (activeSearchSuggestionIdx < searchSuggestionCount - 1) {
    activeSearchSuggestionIdx++;
  } else {
    activeSearchSuggestionIdx = -1;
    $(".search-box .txt-search").select();
  }
  activeSearchSuggestion();
}
function activeSearchSuggestion() {
  $("#search-suggestion li").find("a").removeClass("active");
  if (activeSearchSuggestionIdx >= 0) {
    $("#search-suggestion li")
      .eq(activeSearchSuggestionIdx)
      .find("a")
      .addClass("active");
  }
}
function selectSearchSuggestionResult() {
  if (activeSearchSuggestionIdx >= 0) {
    window.location.href = $("#search-suggestion li")
      .eq(activeSearchSuggestionIdx)
      .find("a")
      .attr("href");
  }
}

$("#searchButton").click(function () {
  var keyword = $(".search-box .txt-search").val();
  if (keyword == "" || typeof keyword == "undefined") {
    return false;
  } else {
    var urlSearch = "/search?q=" + keyword;
    if (
      $(".search-target-text").text().trim() == "Trong shop nĂ y" &&
      $(".search-target-text").data("store-id")
    ) {
      urlSearch += "&storeId=" + $(".search-target-text").data("store-id");
    }
    window.location.href = urlSearch;
  }
});

$(".map-marker").click(function (event) {
  $(this).toggleClass("js-hide-content").toggleClass("js-show-content");
  $(".showroom-background").toggleClass("open-showroom");
});

var hotlines = [];
if (checkGetHotlines) {
  $.ajax({
    url: "/api/get-hotlines?pathName=" + window.location.pathname,
    type: "GET",
    contentType: false,
    processData: false,
  }).then(function (data) {
    if (data && data.status && data.status == "successful") {
      hotlines = data.data;
      if (hotlines && typeof hotlines[0] != "undefined") {
        $(".js-first-hotline").text(hotlines[0]);
        $(".hotline-number-contact").text(hotlines[0]);
        $(".js-first-hotline").attr(
          "onclick",
          "goog_report_conversion('tel:" + hotlines[0] + "')"
        );
      }
      if (hotlines && typeof hotlines[1] != "undefined") {
        $("#js-second-hotline").text(hotlines[1]);
        $("#js-second-hotline").attr(
          "onclick",
          "goog_report_conversion('tel:" + hotlines[1] + "')"
        );
      }
    }
  });
} else {
}
$.ajax({
  url:
    "/api/get-header-account?showCheckOrder=" +
    (typeof showCheckOrder != "undefined" ? showCheckOrder : 1),
  type: "GET",
  contentType: false,
  processData: false,
}).then(function (data) {
  if (data && data.status && data.status == "successful") {
    if (data.html) {
      $(".header-account").html(data.html);
    }
    if (data.htmlHeaderItem) {
      $(".header-item-account").html(data.htmlHeaderItem);
    }
  }
});

$("#QuickLogin").click(function (event) {
  $("#login-chiaki").show();
  var listInInfo = localStorage.getItem("listInfo");
  if (listInInfo) {
    document.cookie = "listInfo=" + listInInfo;
  }
  event.stopPropagation();
});
$("body").click(function () {
  $("#login-chiaki").hide();
});
$("#RecoverPass").click(function () {
  $(".forget-pass").show();
  $(".quick-login").hide();
});
$(".quick-log").click(function () {
  $(".forget-pass").hide();
  $(".quick-login").show();
});
$("body").on("click", ".segment-order-text", function () {
  $(".segment-background").toggleClass("open-segment");
  if ($(this).data("check-login") == true && checkCustomerHasPhone) {
    window.location.href = "/don-hang";
  } else {
    $(this)
      .parent()
      .toggleClass("js-hide-content")
      .toggleClass("js-show-content");
    $("input[name=phone]").focus();
  }
});
$("body").on("click", "#hide-segment, .segment-background", function () {
  $(".segment-order-tracking ")
    .toggleClass("js-show-content")
    .toggleClass("js-hide-content");
  $(".segment-background").toggleClass("open-segment");
});
$("#keyword").removeAttr("style").attr("placeholder", searchPlaceHolderConfig);
$("#keyword").blur(function () {
  $(this).removeAttr("style").attr("placeholder", searchPlaceHolderConfig);
});
$("#keyword").click(function () {
  if (popularSearch.length > 0 && !$("#search-suggestion").is(":visible")) {
    $("#list-suggest-item").html("");
    popularSearch.forEach(function (item) {
      var _items = "";
      _items += '<span class="suggest-item" data-text="' + item.keyword + '">';
      _items += item.keyword;
      _items += "</span>";
      $(".item-hot-keyword").append(_items);
    });
    $("#popular-search-suggestion").css("display", "block");
  } else {
    $("#popular-search-suggestion").css("display", "none");
    $(".box-shadow-search").addClass("forcus-search");
  }
});
$("#keyword").keyup(function () {
  var _value = $(this).val();
  if (_value.length > 0) {
    $("#popular-search-suggestion").css("display", "none");
  } else {
    $("#popular-search-suggestion").css("display", "block");
  }
});

$("#list-suggest-item").on("click", ".suggest-item", function () {
  var _keyword = $(this).attr("data-text");
  if (_keyword != "" || _keyword != null) {
    window.location = "/search?q=" + _keyword;
  }
});
$("body").click(function (e) {
  if ($(".cat-menu").css("display") == "block") {
    $(".cat-menu").css("display", "none");
    e.stopPropagation();
  }
  if ($("#popular-search-suggestion").css("display") == "block") {
    $("#popular-search-suggestion").css("display", "none");
    e.stopPropagation();
  }
  if (!isHomePage) {
    if ($(".search-box-mobile").css("display") != "none") {
      $(".search-box-mobile").css("display", "none");
      e.stopPropagation();
    }
  }
  $(".box-shadow-search").removeClass("forcus-search");
});
$("#search-header").click(function (e) {
  e.stopPropagation();
});
$(".cat-title").click(function (e) {
  if ($(".cat-menu").css("display") != "block") {
    $(".search-box").removeAttr("style");
    $(".cat-menu").css("display", "block");
    if (!isHomePage) {
      $(".search-box-mobile").css("display", "none");
    }
    e.stopPropagation();
  }
});
$(document).ready(function () {
  $(".history-keyword").hide();
  var listKeywordSearch = localStorage.getItem("listKeywordSearch");
  if (listKeywordSearch) {
    listKeywordSearch = JSON.parse(listKeywordSearch);
    if (listKeywordSearch.length > 0) {
      var htmlHistorySearch = "";
      for (var i in listKeywordSearch) {
        htmlHistorySearch +=
          '<a class="history-keyword-link" role="option" href="/search?q=' +
          listKeywordSearch[i] +
          '">' +
          listKeywordSearch[i] +
          "</a>";
      }
      $(".history-keyword-content").html(htmlHistorySearch);
      $(".history-keyword").show();
    }
  }
  $(".remove-history-search").on("click", function () {
    $(".history-keyword").hide();
    localStorage.setItem("listKeywordSearch", JSON.stringify([]));
  });
});

$("#form-search-order").on("submit", function (e) {
  var phone = $("#phone-input").val();
  var customerCode = $("#customer-code").val();
  var messageError = "";
  var message = "";
  if (!phone) {
    messageError = "Vui lĂ²ng nháº­p sá»‘ Ä‘iá»‡n thoáº¡i";
  } else if (!validatePhoneNumber(phone)) {
    messageError = "Vui lĂ²ng nháº­p Ä‘Ăºng sá»‘ Ä‘iá»‡n thoáº¡i";
  }
  if (!customerCode) {
    message = "Vui lĂ²ng nháº­p mĂ£ khĂ¡ch hĂ ng";
  } else if (customerCode.length != 4) {
    message = "MĂ£ khĂ¡ch hĂ ng khĂ´ng há»£p lá»‡";
  }
  if (userType == "customer" && (messageError != "" || message != "")) {
    $("#error-phone").text(messageError);
    $("#error-customer").text(message);
    return false;
  } else {
    $("#error-phone").hide();
    $("#error-customer").hide();
    return true;
  }
});

$("#search-suggestion").on("click", "a.search-buy-now", function (e) {
  e.preventDefault();
  var productCode = $(this).data("code");
  var productId = $(this).data("id");
  var storeId = $(this).data("store");
  if (typeof storeId === "undefined") {
    var href = $(this).attr("href");
    window.location = href;
    return;
  }
  var params = {
    product_id: productId,
    product_code: productCode,
    store_id: storeId,
    quantity: 1,
    n_type: 11,
  };
  buildAndPushToCart(params, function (result) {
    window.location = "/gio-hang?product-filter=1";
  });
});

function validatePhoneNumber(phone) {
  if (phone == null) {
    return false;
  }
  //ELSE:
  var stdPhone = standardizePhone(phone);
  var regex = /^0(9\d{8}|1\d{9}|[2345678]\d{7,14})$/;
  return stdPhone.match(regex) != null;
}

function standardizePhone(phone) {
  if (phone == null) {
    return phone;
  }
  if (!isNaN(phone)) {
    phone = phone.toString();
  }
  //ELSE:
  return phone.replace(/[^0-9]/g, "");
}

$("#keyword").click(function () {
  if ($(".js-results").css("display") === "none") {
    $("#popular-search-suggestion").css("display", "block");
  }
  $(".segment-order-tracking")
    .removeClass("js-show-content")
    .addClass("js-hide-content");
});

$(window).bind("load", function () {
  $(".category-child-image").each(function () {
    if (
      (typeof this.naturalWidth != "undefined" && this.naturalWidth == 0) ||
      this.readyState == "uninitialized"
    ) {
      if (!$(this).attr("overwrite"))
        $(this).attr({ src: "/images/no-image.jpg?v=1" }).addClass("noimage");
    }
  });
});




var banners = [
  {
    id: "913",
    title: "chiaki-sale-thang-5-mua-2-tang-1",
    description:
      "Ch\u01b0\u01a1ng tr\u00ecnh \u01b0u \u0111\u00e3i th\u00e1ng 5 mua 2 s\u1ea3n ph\u1ea9m t\u1eb7ng 1 b\u00ecnh n\u01b0\u1edbc gi\u1eef nhi\u1ec7t cao c\u1ea5p",
    url: "",
    image_url:
      "/home-banner/16-05-2024/1942835436_uu_dai_thang_5_mua_2_tang_1.jpg",
    icon_url: null,
  },
  {
    id: "907",
    title:
      "Chiaki sale m\u1ef9 ph\u1ea9m gi\u1ea3m \u0111\u1ebfn 40% \u0111\u00f3n h\u00e8 sang r\u1ef1c r\u1ee1",
    description:
      "Chiaki sale m\u1ef9 ph\u1ea9m gi\u1ea3m \u0111\u1ebfn 40% \u0111\u00f3n h\u00e8 sang r\u1ef1c r\u1ee1",
    url: "https://chiaki.vn/my-pham",
    image_url:
      "/home-banner/07-05-2024/1516709661_chiaki_don_he_sang_sale_my_pham_giam_gia_40.jpg",
    icon_url: null,
  },
  {
    id: "912",
    title:
      "Chiaki Sale mua 2 s\u1ea3n ph\u1ea9m DIM For Her t\u1eb7ng 1 t\u00fai v\u1ea3i cao c\u1ea5p",
    description:
      "Chiaki Sale mua 2 s\u1ea3n ph\u1ea9m DIM For Her t\u1eb7ng 1 t\u00fai v\u1ea3i cao c\u1ea5p",
    url: "https://chiaki.vn/olympian-labs-dim-for-her-ho-tro-dieu-hoa-noi-tiet-nu",
    image_url:
      "/home-banner/14-05-2024/890947564_chiaki_sale_mua_2_dim_for_her_tang_1_tui_vai_cao_cap.jpg",
    icon_url: null,
  },
  {
    id: "895",
    title:
      "Chiaki Sale Son cho \u0111\u00f4i m\u00f4i r\u1ea1ng r\u1ee1 gi\u1ea3m t\u1edbi 38%",
    description:
      "Chiaki Sale Son cho \u0111\u00f4i m\u00f4i r\u1ea1ng r\u1ee1 gi\u1ea3m t\u1edbi 38%",
    url: "https://chiaki.vn/son-moi",
    image_url:
      "/home-banner/06-03-2024/608034986_chiaki_sale_son_moi_xinh_tuoi_cho_doi_moi_rang_ro.jpg",
    icon_url: null,
  },
  {
    id: "906",
    title:
      "Chiaki Sale kem ch\u1ed1ng n\u1eafng ch\u1eb3ng ng\u1ea1i tia UV gi\u1ea3m t\u1edbi 50%",
    description:
      "Chiaki Sale kem ch\u1ed1ng n\u1eafng ch\u1eb3ng ng\u1ea1i tia UV gi\u1ea3m t\u1edbi 50%",
    url: "https://chiaki.vn/kem-chong-nang",
    image_url:
      "/home-banner/07-05-2024/712828258_chiaki_sale_kem_chong_nang_giam_gia_50.jpg",
    icon_url: null,
  },
  {
    id: "896",
    title:
      "Chiaki Sale N\u01b0\u1edbc Hoa nam n\u1eef h\u00e0ng hi\u1ec7u \u01b0u \u0111\u00e3i t\u1edbi 40%",
    description:
      "Chiaki Sale N\u01b0\u1edbc Hoa nam n\u1eef h\u00e0ng hi\u1ec7u \u01b0u \u0111\u00e3i t\u1edbi 40%",
    url: "https://chiaki.vn/nuoc-hoa",
    image_url:
      "/home-banner/06-03-2024/887386922_chiaki_sale_nuoc_hoa_hang_hieu_chon_mui_huong_the_hien_ca_tinh.jpg",
    icon_url: null,
  },
  {
    id: "897",
    title: "Chiaki Sale Collage Nh\u1eadt B\u1ea3n Up to 30%",
    description: "Chiaki Sale Collage Nh\u1eadt B\u1ea3n Up to 30%",
    url: "https://chiaki.vn/collagen/nhat-ban",
    image_url:
      "/home-banner/06-03-2024/2026971572_chiaki_sale_collagen_nhat_ban_tang_cuong_suc_khoe_va_sac_dep.jpg",
    icon_url: null,
  },
  {
    id: "910",
    title:
      "Chiaki Sale s\u1ea3n ph\u1ea9m Blackmores c\u1ee7a \u00dac gi\u1ea3m \u0111\u1ebfn 30%",
    description:
      "Chiaki Sale s\u1ea3n ph\u1ea9m Blackmores c\u1ee7a \u00dac gi\u1ea3m \u0111\u1ebfn 30%",
    url: "https://chiaki.vn/blackmores",
    image_url:
      "/home-banner/08-05-2024/608034986_chiaki_sale_san_pham_thuong_hieu_blackmores_uc_giam_den_30.jpg",
    icon_url: null,
  },
  {
    id: "903",
    title:
      "Chiaki sale m\u00e1y l\u00e0m \u0111\u00e1 cho m\u00f9a h\u00e8 m\u00e1t l\u1ea1nh gi\u1ea3m \u0111\u1ebfn 40%",
    description:
      "Chiaki sale m\u00e1y l\u00e0m \u0111\u00e1 cho m\u00f9a h\u00e8 m\u00e1t l\u1ea1nh gi\u1ea3m \u0111\u1ebfn 40% Freeship n\u1ed9i th\u00e0nh H\u00e0 N\u1ed9i v\u00e0 H\u1ed3 Ch\u00ed Minh cho \u0111\u01a1n t\u1eeb 300k",
    url: "https://chiaki.vn/may-lam-da",
    image_url:
      "/home-banner/24-04-2024/353319939_chiaki_sale_may_lam_da_chinh_hang_giam_den_40.jpg",
    icon_url: null,
  },
  {
    id: "898",
    title:
      "Chiaki Sale s\u1ea3n ph\u1ea9m d\u00e0nh cho m\u1eb9 v\u00e0 b\u00e9 gi\u1ea3m t\u1edbi 30%",
    description:
      "Chiaki Sale s\u1ea3n ph\u1ea9m d\u00e0nh cho m\u1eb9 v\u00e0 b\u00e9 gi\u1ea3m t\u1edbi 30%",
    url: "https://chiaki.vn/me-va-be",
    image_url:
      "/home-banner/06-03-2024/186894394_chiaki_sale_san_pham_cho_me_va_be_gia_cuc_soc.jpg",
    icon_url: null,
  },
];
$(document).ready(function () {
  var swiper = new Swiper(".swiper-container", {
    pagination: { el: ".swiper-pagination", clickable: true },
    paginationClickable: true,
    autoplay: { delay: 5000 },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    observer: true,
    observeParents: true,
  });
});

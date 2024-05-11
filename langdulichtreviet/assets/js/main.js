$(function () {
    $('nav#menu').mmenu();
});



$(window).bind('scroll', function () {
    if (($(window).scrollTop() > 100) && ($(window).scrollTop() < 300)) {

        $('.headertop').addClass('topfixdesk');

        $('.headertop').removeClass('topfixdesk1');

    } else if ($(window).scrollTop() >= 300) {

        $('.headertop').addClass('topfixdesk1');

        $('.headertop').removeClass('topfixdesk');

    } else if ($(window).scrollTop() <= 200) {

        $('.headertop').removeClass('topfixdesk1');

        $('.headertop').removeClass('topfixdesk');

    }
});
function del(pid, size, $color, $obj) {

    //alert($color); 

    var $x = $obj;

    $.ajax({

        url: "ajax/cart.php?type=remove_order",

        data: { id: pid, size: size, color: $color },

        type: "post",

        success: function (data) {

            $jdata = $.parseJSON(data);

            $("#" + $obj).fadeOut(500);

            setTimeout(function () {

                $("#" + $obj).remove();

            }, 800)

            $('#totalcarttop').html($jdata.total);

            $('#cartnumber').html($jdata.num);

            //updatePrice();

            //location.reload();

        }

    })

}


function locdau(str) {

    str = str.toLowerCase();

    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");

    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");

    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");

    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");

    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");

    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");

    str = str.replace(/đ/g, "d");

    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-");

    /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */

    str = str.replace(/-+-/g, "-"); //thay thế 2- thành 1- 

    str = str.replace(/^\-+|\-+$/g, "");

    //cắt bỏ ký tự - ở đầu và cuối chuỗi  

    return str;

}



$(document).ready(function () {

    $('#txtkey').keypress(function (event) {

        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode == '13') {

            //alert('Bạn vừa nhấn phím "enter" trong thẻ input');    

            searchProduct();

        }

    });

});



function searchProduct() {

    var name_search = locdau($('#txtkey').val());

    //alert(name_search);

    if (name_search == '') {

        alert('Vui lòng nhập thông tin tìm kiếm.');

        document.getElementById('txtkey').value = '';

        document.getElementById('txtkey').focus();



    } else if (($('#txtkey').val()).trim() != '')

        window.location = 'tim-kiem.html/k=' + name_search;

    else

        alert('Vui lòng nhập thông tin tìm kiếm.');

}
$(document).ready(function () {
    $('.owl-demotab-slider').owlCarousel({
        loop: true,
        //margin:10,
        autoplay: true,
        items: 1,
        animateOut: 'fadeOut',
        dots: false,
        autoplayTimeout: 5000,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            600: {
                items: 1,
                nav: false
            },
            1000: {
                items: 1,
                nav: false,
            }

        }
    })
});


$(document).ready(function () {

    $('.popup-youtube').magnificPopup({

        //disableOn: 700,

        type: 'iframe',

        mainClass: 'mfp-fade',

        removalDelay: 160,

        preloader: false,

        fixedContentPos: false

    });

});


$(document).ready(function () {

    $('.owl-demotab-whys').owlCarousel({

        loop: true,

        margin: 30,

        autoplay: false,

        items: 1,

        //animateOut: 'fadeOut',

        dots: true,

        //startPosition: ,

        //autoplayTimeout:5000,

        responsiveClass: true,

        nav: true,

        navText: ["<img src='images/prevh.png'>", "<img src='images/nexth.png'>"],

        responsive: {

            0: {

                items: 1,

                nav: false

            },

            470: {

                items: 1,

                nav: false

            },

            700: {

                items: 1,

                nav: false

            },

            1000: {

                items: 1,

                nav: false,

            },

            1200: {

                items: 1,

                nav: false,

            }



        }

    })

});



$(document).ready(function () {

    $('.owl-demotab-news').owlCarousel({

        loop: false,

        margin: 40,

        autoplay: false,

        items: 3,

        //animateOut: 'fadeOut',

        dots: true,

        //startPosition: ,

        autoplayTimeout: 5000,

        responsiveClass: true,

        nav: true,

        navText: ["<img src='images/prevh1.png'>", "<img src='images/nexth1.png'>"],

        responsive: {

            0: {

                items: 1,

                nav: false

            },

            470: {

                items: 1,

                nav: false

            },

            700: {

                items: 2,

                nav: false

            },

            1000: {

                items: 3,

                nav: false,

            },

            1200: {

                items: 3,

                nav: false,
            }
        }

    })

});





$(document).ready(function () {
    $('body').append('<img id="top" src="./img/tải xuống.png" />');

    $(window).scroll(function () {

        if ($(window).scrollTop() > 100) {

            $('#top').fadeIn();

        } else {

            $('#top').fadeOut();

        }

    });

    $('#top').click(function () {

        $('html, body').animate({ scrollTop: 0 }, 300);

    });
});


var num = 0;
var xxx = $(window).width();
$(window).bind('scroll', function () {
   if (xxx < 1150) {
      if ($(window).scrollTop() > num) {
         $('.headmobile').addClass('topfixmobile');
      } else {
         $('.headmobile').removeClass('topfixmobile');
      }
   }
});




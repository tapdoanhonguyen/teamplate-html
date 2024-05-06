let currentSlideIndex = 0;
const slides = document.querySelectorAll('.news-slide');
const totalSlides = slides.length;

function changeSlide(direction) {
    currentSlideIndex += direction;
    if (currentSlideIndex >= totalSlides) currentSlideIndex = 0;
    if (currentSlideIndex < 0) currentSlideIndex = totalSlides - 1;
    document.querySelector('.news-slides').style.transform = `translateX(-${currentSlideIndex * 100}%)`;
}

// Khởi tạo hiển thị slide đầu tiên
changeSlide(0);

$(document).ready(function () {
    $('.slider').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev">&#8592;</button>',
        nextArrow: '<button type="button" class="slick-next">&#8594;</button>',
        dots: true
    });
});
document.addEventListener('DOMContentLoaded', function () {
    var navbarToggle = document.getElementById('navbar-toggle');
    var navbarMenu = document.getElementById('navbar-menu');

    navbarToggle.addEventListener('click', function () {
        navbarMenu.classList.toggle('active');
    });
});
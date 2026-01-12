document.addEventListener("DOMContentLoaded", function () {
    const sideMenu = document.querySelector('.side-menu');
    const overlay = document.querySelector('.overlay'); 

    function checkScreenWidth() {
        if (window.innerWidth >= 767) {
            sideMenu.classList.remove('active');
            overlay.classList.remove('active');
        }
    }

    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
});
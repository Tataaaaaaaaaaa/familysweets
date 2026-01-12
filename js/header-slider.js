document.getElementById('menu-toggle').addEventListener('click', function () {
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('overlay');

    sideMenu.classList.toggle('active');
    overlay.classList.toggle('active');
});

document.getElementById('overlay').addEventListener('click', function () {
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('overlay');

    sideMenu.classList.remove('active');
    overlay.classList.remove('active');
});


// document.getElementById('menu-toggle').addEventListener('click', function () {
//     const sideMenu = document.getElementById('side-menu');
//     const overlay = document.getElementById('overlay');

//     sideMenu.classList.toggle('active');
//     overlay.classList.toggle('active');

//     if (sideMenu.classList.contains('active')) {
//         document.body.style.overflow = 'hidden';
//     } else {
//         document.body.style.overflow = '';
//     }
// });

// document.getElementById('overlay').addEventListener('click', function () {
//     const sideMenu = document.getElementById('side-menu');
//     const overlay = document.getElementById('overlay');

//     sideMenu.classList.remove('active');
//     overlay.classList.remove('active');
//     document.body.style.overflow = ''; // Enable scrolling
// });

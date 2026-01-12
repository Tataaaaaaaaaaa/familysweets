// (function($) {

// 	"use strict";

// 	var fullHeight = function() {

// 		$('.js-fullheight').css('height', $(window).height());
// 		$(window).resize(function(){
// 			$('.js-fullheight').css('height', $(window).height());
// 		});

// 	};
// 	fullHeight();

// 	$('#sidebarCollapse').on('click', function () {
//         $('#sidebar').toggleClass('active');
//   });
// })(jQuery);



(function($) {

  "use strict";

  function updateCakeCardClass() {
    const containers = document.querySelectorAll('.cake-card-container');
    const sidebar = document.getElementById('sidebar');
    const width = window.innerWidth;

    const isSidebarActive = sidebar.classList.contains('active');

    containers.forEach(container => {

      
      container.classList.remove('cake-card-4-col', 'cake-card-3-col', 'cake-card-2-col', 'cake-card-1-col');

      if (isSidebarActive) {
        if (width >= 1701) {
          container.classList.add('cake-card-4-col');
        } else if (width >= 1400 && width <= 1700) {
          container.classList.add('cake-card-3-col');
        } else if (width >= 407 && width <= 1399) {
          container.classList.add('cake-card-2-col');
        } else {
          container.classList.add('cake-card-1-col');
        }
      } else {
        if (width >= 1701) {
          container.classList.add('cake-card-4-col');
        } else if (width >= 1400 && width <= 1700) {
          container.classList.add('cake-card-4-col');
        } else if (width >= 1051 && width <= 1399) {
          container.classList.add('cake-card-3-col');
        } else if (width >= 407 && width <= 1050) {
          container.classList.add('cake-card-2-col');
        } else {
          container.classList.add('cake-card-1-col');
        }
      }
    });
  }

  $(window).on('load resize', function() {
    updateCakeCardClass();
  });

  $('#sidebarCollapse').on('click', function() {
    $('#sidebar').toggleClass('active');
    updateCakeCardClass();  
  });

  $(document).ready(function() {
    updateCakeCardClass();
  });

})(jQuery);


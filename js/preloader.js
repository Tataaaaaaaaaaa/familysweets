var minPreloadTime = 2000; // Minimum preload time set to 2 seconds
var shortDisplayThreshold = 1000; 
var startTime;
var assetsLoaded = false;

function preloader() {
    startTime = new Date().getTime(); 

    document.body.classList.add("no-scroll");

    window.addEventListener('load', function() {
        assetsLoaded = true;
        showPage();
    });

    document.addEventListener('readystatechange', function() {
        if (document.readyState === 'complete') {
            assetsLoaded = true;
            showPage();
        }
    });
}

function showPage() {
    var currentTime = new Date().getTime(); 
    var elapsedTime = currentTime - startTime; 

    if (assetsLoaded) {
        if (elapsedTime < minPreloadTime) {
            setTimeout(function() {
                document.getElementById("preloader").style.display = "none";
                document.body.classList.remove("no-scroll");
            }, minPreloadTime - elapsedTime);
        } else {
            document.getElementById("preloader").style.display = "none";
            document.body.classList.remove("no-scroll"); 
        }
    }
}

preloader();

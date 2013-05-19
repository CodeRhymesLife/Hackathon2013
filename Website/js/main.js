window.addEventListener("load", function () {
});

function showLoginOverlay() {
    var loginWrapper = document.createElement("div");
    loginWrapper.id = "loginWrapper";

    var login = document.createElement("div");
    login.id = "login";
    loginWrapper.appendChild(login);

    // Login button
    var loginButton = document.createElement("img");
    loginButton.id = "loginButton";
    loginButton.src = "images/loginButton.png";
    loginButton.addEventListener("click", function () {
        FB.login(function (response) { });
    });
    login.appendChild(loginButton);

    document.getElementById("content").appendChild(loginWrapper);
}

function hideLoginOverlay() {
    var loginWrapper = document.getElementById("loginWrapper");
    if (loginWrapper) {
        loginWrapper.parentElement.removeChild(loginWrapper);
    }
}

// Here we run a very simple test of the Graph API after login is successful. 
// This testAPI() function is only called in those cases. 
function glimpseInit() {
    FB.api('/me', function (response) {
        console.log("Welcome " + response.name);
        document.getElementById("name").appendChild(document.createTextNode(response.name));
    });

    initMosaic();
}

function initMosaic() {
    console.log("initializing mosaic");

    var youtubePrefix = "http://www.youtube.com/embed/";
    var parameters = "?rel=0&controls=0&loop=1&showinfo=0&modestbranding=1&autoplay=1&playlist=";

    var videos = new Array();
    videos.push({ src: "durant.mp4", r: 1, c: 1 });
    videos.push({ src: "durant.mp4", r: 1, c: 3 });
    videos.push({ src: "durant.mp4", r: 2, c: 4 });
    videos.push({ src: "durant.mp4", r: 2, c: 2 });
    videos.push({ src: "durant.mp4", r: 3, c: 3 });

    var mosaic = document.createElement("div");
    mosaic.id = "mosaic";
    document.getElementById("content").appendChild(mosaic);

    var count = 0;
    for (var r = 1; r <= 4; r++) {
        for (var c = 1; c <= 5; c++) {
            var videoplaced = false;

            for (var i = 0; i < videos.length; i++) {
                var video = videos[i];
                if (video.r == r && video.c == c) {
                    var player = document.createElement("video");
                    player.autoplay = "1";
                    player.muted = "true";
                    player.loop = "1";
                    player.style.width = "100%";
                    player.style.height = "100%";
                    player.addEventListener("click", function () {
                        showVideo("videos/" + video.src);
                    });

                    var source = document.createElement("source");
                    source.src = "videos/" + video.src;
                    player.appendChild(source);

                    player.style.msGridRow = r;
                    player.style.msGridColumn = c;
                    mosaic.appendChild(player);

                    videoplaced = true;
                }
            }

            if (!videoplaced) {
                var mosaicTile = document.createElement("div");
                mosaicTile.style.msGridRow = r;
                mosaicTile.style.msGridColumn = c;
                if ((count + 1) % 2 == 0) {
                    mosaicTile.className = "lightMosaicTile";
                }
                else {
                    mosaicTile.className = "darkMosaicTile";
                }
                mosaic.appendChild(mosaicTile);
            }

            count++;
        }
    }
}

function showVideo(src) {
    console.log("showing video: " + src);

    var videos = document.querySelectorAll("video");
    for (var i = 0; i < videos.length; i++) {
        videos[i].pause();
    }

    var overlay = document.createElement("div");
    overlay.id = "glimpseOverlay";
    document.getElementById("content").appendChild(overlay);

    var glimpse = document.createElement("div");
    glimpse.id = "glimpse";
    overlay.appendChild(glimpse);

    var video = document.createElement("video");
    video.autoplay = "1";
    video.loop = "1";
    video.style.width = "100%";
    video.style.height = "100%";

    var source = document.createElement("source");
    source.src = src;
    video.appendChild(source);

    glimpse.appendChild(video);
}
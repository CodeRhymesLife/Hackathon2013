window.addEventListener("load", function () {
    if (window.location.hostname.indexOf("swis.me") == -1) {
        // Local override to avoid FB
        initSearch();
        initMosaic();
    }
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

// Successful login
function glimpseInit() {
    FB.api('/me', function (response) {
        console.log("Welcome " + response.name);
        document.getElementById("name").appendChild(document.createTextNode(response.name));
    });
    initSearch();
    initMosaic();
}

function initSearch() {
    if (document.getElementById("searchbox")) {
        return;
    }
    console.log("init search");

    var searchbox = document.createElement("input");
    searchbox.type = "text";
    searchbox.id = "searchbox";
    searchbox.value = "search...";
    document.getElementById("search").appendChild(searchbox);
}

function initMosaic() {
    if (document.getElementById("mosaic")) {
        return;
    }

    console.log("initializing mosaic");

    var youtubePrefix = "http://www.youtube.com/embed/";
    var parameters = "?rel=0&controls=0&loop=1&showinfo=0&modestbranding=1&autoplay=1&playlist=";

    var videos = new Array();
    videos.push({ src: "durant.mp4", r: 1, c: 1, streamer: "Scott Treadwell" });
    videos.push({ src: "sunset.mp4", r: 1, c: 3, streamer: "Remy Carole" });
    videos.push({ src: "skydiving.mp4", r: 2, c: 4, streamer: "Ryan James" });
    videos.push({ src: "bear.mp4", r: 2, c: 2, streamer: "Tushar Bhatnagar" });
    videos.push({ src: "bbq.mp4", r: 3, c: 1, streamer: "Pascal Carole" });
    videos.push({ src: "bike.mp4", r: 3, c: 3, streamer: "John Krzemien" });

    var mosaic = document.createElement("div");
    mosaic.id = "mosaic";
    document.getElementById("content").appendChild(mosaic);

    var count = 0;
    for (var r = 1; r <= 3; r++) {
        for (var c = 1; c <= 4; c++) {
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
                    //player.addEventListener("click", function () {
                    //    showVideo("videos/" + video.src);
                    //});

                    var source = document.createElement("source");
                    source.src = "videos/" + video.src;
                    player.appendChild(source);

                    var div = document.createElement("div");
                    div.style.msGridRow = r;
                    div.style.msGridColumn = c;
                    div.appendChild(player);

                    var overlay = document.createElement("div");
                    overlay.className = "streamOverlay";
                    overlay.appendChild(document.createTextNode(video.streamer));
                    div.appendChild(overlay);

                    mosaic.appendChild(div);

                    videoplaced = true;
                }
            }

            if (!videoplaced) {
                var mosaicTile = document.createElement("div");
                mosaicTile.style.msGridRow = r;
                mosaicTile.style.msGridColumn = c;
                if ((count) % 3 == 0) {
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

    connect();
}

function showStream() {
    if (document.getElementById("andresen")) {
        return;
    }

    console.log("glimpse has started");

    var div = document.createElement("div");
    div.id = "andresen";
    div.style.msGridRow = 2;
    div.style.msGridColumn = 3;
    mosaic.appendChild(div);

    var img = document.createElement("img");
    //img.src = "images/placeholder.jpg";
    img.className = "glimpseStream";
    img.addEventListener("click", function () {
        showGlimpse();
    });
    div.appendChild(img);

    var overlay = document.createElement("div");
    overlay.className = "streamOverlay";
    overlay.appendChild(document.createTextNode("Alex Andresen"));
    div.appendChild(overlay);
}

function hideStream() {
    var div = document.getElementById("andresen");
    if (div) {
        console.log("hiding stream");
        div.parentElement.removeChild(div);
    }
}

function connect() {
    var ws = new WebSocket("ws://glimpse.cloudapp.net:4502/");

    ws.onopen = function () {
        console.log('Connected');
    };

    ws.onmessage = function (evt) {
        if (evt.data != null) {
            var streams = document.querySelectorAll(".glimpseStream");
            switch (evt.data) {
                case "stop":
                    console.log("glimpse is over");
                    hideGlimpse();
                    hideStream();
                    break;
                default:
                    showStream();
                    for (var i = 0; i < streams.length; i++) {
                        if (evt.data.indexOf("something") == -1) {
                            streams[i].src = "data:image/jpeg;base64," + evt.data;
                        }
                    }
                    break;
            }
        }
    };

    ws.onclose = function () {
        console.log('Socket Closed');
    };

    ws.onerror = function (evt) {
        console.log("Error: " + evt.data);
    };
}

function hideGlimpse() {
    var overlay = document.getElementById("glimpseOverlay");
    if (overlay) {
        console.log("hiding glimpse");
        overlay.parentElement.removeChild(overlay);

        var videos = document.querySelectorAll("video");
        for (var i = 0; i < videos.length; i++) {
            videos[i].play();
        }
    }
}

function showGlimpse() {
    if (document.getElementById("glimpseOverlay")) {
        return;
    }

    var videos = document.querySelectorAll("video");
    for (var i = 0; i < videos.length; i++) {
        videos[i].pause();
    }

    var overlay = document.createElement("div");
    overlay.id = "glimpseOverlay";
    overlay.addEventListener("click", function () {
        hideGlimpse();
    });
    document.getElementById("content").appendChild(overlay);

    var glimpse = document.createElement("div");
    glimpse.id = "glimpse";
    overlay.appendChild(glimpse);

    var img = document.createElement("img");
    img.className = "glimpseStream";
    img.style.width = "100%";
    img.style.height = "100%";
    glimpse.appendChild(img);
}

function showVideo(src) {
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
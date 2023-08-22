var player;

const updateUI = async () => {
    const fullName = document.getElementById("full-name");
    const avatar = document.getElementById("avatar");

    try {
        const response = await axios.get("/user/me");
        const { nickname, picture, email: userEmail, id } = response.data;
        window.email = userEmail;
        window.userId = id;

        const isAuthenticated = nickname && email;
        document.getElementById("btn-login").style.display = isAuthenticated ? "none" : "block";
        document.getElementsByClassName("user-profile")[0].style.display = isAuthenticated ? "block" : "none";
        if (nickname && picture) {
            fullName.innerHTML = nickname;
            avatar.src = picture;

            fullName.style.visibility = "visible";
            avatar.style.visibility = "visible";
        }
    } catch (error) {
        document.getElementsByClassName("user-profile")[0].style.display = 'none';
        // console.log(error.message);
    }

    (localStorage.getItem('theme') === 'dark-mode') ? setTheme('dark-mode') : setTheme("light-mode");
    setLogo();
}

updateUI();

function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

function toggleTheme() {
    (localStorage.getItem("theme") === "light-mode") ? setTheme("dark-mode") : setTheme("light-mode");
    setLogo();
}

function setLogo() {
    const navBrand = document.getElementsByClassName("navbar-brand")[0];
    if (localStorage.getItem("theme") === "light-mode") {
        navBrand.innerHTML = `
            <img src='./images/BT Logo Gold@4x.png' alt="logo" width="80" 
            height="80" />
        `;
    } else {
        navBrand.innerHTML = `
        <img src="./images/Artboard 1@4x.png" alt="logo" width="80" height="80"/>
        `;
    }
}

function doUpdateAnaly() {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-WJCH2J19N3');
}

function updateCount(id, likes, dislikes, eleId){

}

var socket = io();
socket.on("update-tracks", (tracks) => {
    window.videoList = tracks;
});
socket.on("playingVideo", async (data) => {
    doUpdateAnaly();
    if (player === null || player === undefined) {
        player = new YT.Player('videoPlaying', {
            height: '390',
            width: '640',
            videoId: `${data.playingVideo.youtubeVideoId}`,
            enablejsapi: 1,
            playerVars: {
                'autoplay': 1,
                'controls': 0,
                'mute': 1,
                'start': `${data.playedTime}`,
            },
            events: {
                'onReady': onPlayerReady,
            }
        });
    } else {
        player.loadVideoById(`${data.playingVideo.youtubeVideoId}`);
    }
    window.playingVideo = data.playingVideo;
    document.getElementById("titlePlayingVideo").innerHTML = `${data.playingVideo.title}`;
    // updateCount(data.playingVideo._id, data.playingVideo.likes, data.playingVideo.dislikes);
    renderTracks(window.videoList, 'queueTracks');
});
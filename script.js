let player;
let currentSong;
let playerReady = false;

let attempts = [0.1, 1, 2, 4, 8];
let attemptIndex = 0;
let gameOver = false;
let pendingPlay = false;

// INIT
function initGame() {
    currentSong = songs[0];
}
initGame();

// YouTube API init
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '200', // na test NIE 0
        width: '300',
        videoId: currentSong.id,
        events: {
            onReady: onPlayerReady
        }
    });
}

// Player ready
function onPlayerReady() {
    console.log("Player gotowy");
    playerReady = true;
}

// PLAY fragment
function playSong() {
    console.log("klik");

    if (!playerReady) {
        console.log("Player jeszcze nie gotowy");
        pedningPlay = true;
        return;
    }

    if (gameOver) return;

    console.log(player);
    console.log(currentSong.id);

    player.loadVideoById(currentSong.id, 0);
    player.unMute();        // 🔥 kluczowe
    player.setVolume(100);  // 🔥 kluczowe
    player.playVideo();

    setTimeout(() => {
        player.pauseVideo();
    }, attempts[attemptIndex] * 1000);

    attemptIndex++;
}

// SKIP
function skip() {
    if (gameOver) return;

    attemptIndex++;

    if (attemptIndex >= attempts.length) {
        lose();
    }

    document.getElementById("result").innerText = "Skip";
}

// CHECK
function check() {
    if (gameOver) return;

    let input = document.getElementById("input").value.toLowerCase();
    let correct = currentSong.title.toLowerCase();

    if (input === correct) {
        win();
    } else {
        document.getElementById("result").innerText = "Źle ❌";
        attemptIndex++;

        if (attemptIndex >= attempts.length) {
            lose();
        }
    }

    document.getElementById("input").value = "";
}

// WIN
function win() {
    gameOver = true;
    document.getElementById("result").innerText =
        "🎉 Wygrana! To było: " + currentSong.title + " - " + currentSong.artist;
}

// LOSE
function lose() {
    gameOver = true;
    document.getElementById("result").innerText =
        "❌ Przegrana! To było: " + currentSong.title + " - " + currentSong.artist;
}
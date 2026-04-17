let audio = document.getElementById("audio");
let currentSong;


let attempts = [0.5, 1, 2, 4, 8, 16];
let attemptIndex = 0;
let gameOver = false;


// INIT
function initGame() {
    currentSong = songs[0];
    audio.src = currentSong.src;
    audio.load();

    document.getElementById("level").innerText =
        "poziom: " + (attemptIndex + 1) + "/6";

    document.getElementById("time").innerText =
        "Czas: " + attempts[attemptIndex] + " sekundy";
}
initGame();

// PLAY 
function playSong() {
    console.log("klik");
    if (gameOver) return;


    audio.currentTime = 0;
    audio.play().catch((err) => {
        console.warn("Audio play blocked:", err);
        document.getElementById("result").innerText =
            "Odtwarzanie zablokowane przez przeglądarkę.";
    });
    
    setTimeout(() => {
        audio.pause();
    }, attempts[attemptIndex] * 1000);
    
}


// ZGADNIJ
function check() {
    if (gameOver) return;
    

    let input = document.getElementById("input").value.toLowerCase();
    let correct = currentSong.title.toLowerCase();

    if (input === correct) {
        win();
    } else {
        attemptIndex++;
        if (attemptIndex >= attempts.length) {
            lose();
        }
        else{
        document.getElementById("result").innerText = "Źle ❌";
        document.getElementById("level").innerText =
        "poziom: " + (attemptIndex + 1) + "/6";
        document.getElementById("time").innerText =
        "Czas: " + attempts[attemptIndex] + " sekundy";
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
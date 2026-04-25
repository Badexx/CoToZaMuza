let audio = document.getElementById("audio");
let currentSong;


let attempts = [0.5, 1.5, 3, 5, 8, 16];
let attemptIndex = 0;
let gameOver = false;

let inputs = document.querySelectorAll(".guess");
let currentInputIndex = 0;


// INIT
function initGame() {
    currentSong = songs[Math.floor(Math.random() * songs.length)];
    audio.src = currentSong.src;
    audio.load();

    inputs.forEach((input, index) => {
        if (index !== 0) {
            input.disabled = true;
        }
    });

    document.getElementById("level").innerText =
        "podejście: " + (attemptIndex + 1) + "/6";

    document.getElementById("time").innerText =
        "Czas: " + attempts[attemptIndex] + " sekundy";
}
initGame();

// Dodaj sugestie dla pól zgadywania
inputs.forEach((input, index) => {
    let suggestionsDiv = input.nextElementSibling;
    input.addEventListener("input", () => {
        let value = input.value.toLowerCase().trim();
        suggestionsDiv.innerHTML = "";
        if (value.length < 1) return;
        let matches = songs.filter(song =>
            song.title.toLowerCase().startsWith(value)
        );
        matches.slice(0, 5).forEach(song => {
            let div = document.createElement("div");
            div.classList.add("suggestion");
            div.innerText = song.title;
            div.onclick = () => {
                input.value = song.title;
                suggestionsDiv.innerHTML = "";
            };
            suggestionsDiv.appendChild(div);
        });
    });
});

let volumeSlider = document.getElementById("volume");

volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value; // 0–1
});




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

function next() {
    if (gameOver) resetGame();

    let currentIndex = songs.indexOf(currentSong);
    let nextIndex = Math.floor(Math.random() * songs.length);
    while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * songs.length);
    }
    currentSong = songs[nextIndex];
    audio.src = currentSong.src;
    audio.load();
    resetGame();
}

let isActive = false;
const playFullButton = document.getElementById("playFullButton");

function playStopFullSong() {
    isActive = !isActive;
    if (isActive) {
        playFullButton.innerText = "Zatrzymaj";
        playFullSong();
        console.log("Odtwarzanie pełnej piosenki");
    } else {
        playFullButton.innerText = "Odtwórz całą piosenkę";
        audio.pause();
        console.log("Zatrzymano odtwarzanie pełnej piosenki");
    }
}

function playFullSong() {
    audio.currentTime = 0;
    audio.play().catch((err) => {
        console.warn("Audio play blocked:", err);
        document.getElementById("result").innerText =
            "Odtwarzanie zablokowane przez przeglądarkę.";
    });
    
}




// ZGADNIJ
function check() {
    if (gameOver) return;
    

    let input = inputs[currentInputIndex];
    let value = input.value.toLowerCase().trim();
    let correct = currentSong.title.toLowerCase().trim();

    if (value === correct) {
        input.style.color = "green";
        input.value = "✔️ ZGADŁEŚ - " + input.value;
        win();
        return;
    } 
    else if (value === "" || value === "nie wiem") {
        input.style.color = "orange";
        input.value = "POMINIĘTE";
        input.disabled = true;
        currentInputIndex++;
        attemptIndex++;
        if (attemptIndex >= attempts.length && currentInputIndex >= inputs.length) {
            lose();
            return;
        } else {
            document.getElementById("level").innerText =
                "podejście: " + (attemptIndex + 1) + "/6";
            document.getElementById("time").innerText =
                "Czas: " + attempts[attemptIndex] + " sekundy";

            let nextInput = inputs[currentInputIndex];
            nextInput.disabled = false;
            nextInput.focus();
        }
    }
    else
    {
        input.style.color = "red";
        input.value = "❌ NIE ZGADŁEŚ - " + input.value;
        input.disabled = true;
        currentInputIndex++;
        attemptIndex++;
        if (attemptIndex >= attempts.length && currentInputIndex >= inputs.length) {
            lose();
            return;
        } else {
            document.getElementById("level").innerText =
                "podejście: " + (attemptIndex + 1) + "/6";
            document.getElementById("time").innerText =
                "Czas: " + attempts[attemptIndex] + " sekundy";

            let nextInput = inputs[currentInputIndex];
            nextInput.disabled = false;
            nextInput.focus();
        }
    }
}


function openSettings() {
    console.log("Otwieranie ustawień...");
    document.getElementById("settings-overlay").classList.remove("hidden");
}

function closeSettings() {
    console.log("Zamykanie ustawień...");
    document.getElementById("settings-overlay").classList.add("hidden");
}

function openHowToPlay() {
    console.log("Otwieranie instrukcji...");
    document.getElementById("howToPlay-overlay").classList.remove("hidden");
}


function closeHowToPlay() {
    console.log("Zamykanie instrukcji...");
    document.getElementById("howToPlay-overlay").classList.add("hidden");
}

function openAktualnosci() {
    console.log("Otwieranie aktualności...");
    document.getElementById("aktualnosci-overlay").classList.remove("hidden");
}


function closeAktualnosci() {
    console.log("Zamykanie aktualności...");
    document.getElementById("aktualnosci-overlay").classList.add("hidden");
}

// WIN
function win() {
    gameOver = true;
    document.getElementById("result").innerText =
        "🎉 Wygrana! To było: " + currentSong.title + " - " + currentSong.artist;
    document.getElementById("playFullButton").classList.remove("hidden");
}

// LOSE
function lose() {
    gameOver = true;
    document.getElementById("result").innerText =
        "❌ Przegrana! To było: " + currentSong.title + " - " + currentSong.artist;
    document.getElementById("playFullButton").classList.remove("hidden"); 
}

function resetGame() {
    gameOver = false;
    inputs.forEach((input, index) => {
        input.value = "";
        input.placeholder = "Wpisz tytuł... (podejście " + (index + 1) + ")";
        input.style.color = "black";
        input.disabled = index !== 0;
        input.nextElementSibling.innerHTML = ""; // wyczyść sugestie
    });
    currentInputIndex = 0;
    attemptIndex = 0;
    gameOver = false;
    document.getElementById("level").innerText =
        "podejście: " + (attemptIndex + 1) + "/6";

    document.getElementById("time").innerText =
        "Czas: " + attempts[attemptIndex] + " sekundy";

    document.getElementById("result").innerText = "";   
    document.getElementById("playFullButton").classList.add("hidden");
}
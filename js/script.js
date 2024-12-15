const phoneticSounds = {
    vowels: {
        "a": "sounds/sound_a.mp3",
        "e": "sounds/sound_e.mp3",
        "i": "sounds/sound_i.mp3",
        "o": "sounds/sound_o.mp3",
        "u": "sounds/sound_u.mp3",
        "ai": "sounds/sound_ai.mp3",
        "au": "sounds/sound_au.mp3",
        "ae": "sounds/sound_ae.mp3",
        "ə": "sounds/sound_ə.mp3",
        "I": "sounds/sound_ɪ.mp3",
        "ɔ": "sounds/sound_ɔ.mp3",
    },
    consonants: {
        "b": "sounds/sound_b.mp3",
        "d": "sounds/sound_d.mp3",
        "f": "sounds/sound_f.mp3",
        "g": "sounds/sound_g.mp3",
        "h": "sounds/sound_h.mp3"
    }
};

let isPlaying = false; // Track if sounds are playing

// Function to play a sound
function playSound(filePath) {
    console.log(`DEBUG: Attempting to play sound from: ${filePath}`);
    const audio = new Audio(filePath);
    return audio.play().then(() => {
        console.log(`DEBUG: Playing sound from: ${filePath}`);
    }).catch((error) => {
        console.error(`ERROR: Could not play sound: ${filePath}`, error);
        alert(`Failed to play sound from ${filePath}. Please check the file.`);
    });
}

// Function to get and welcome the user
function getUserName() {
    const name = prompt("Please enter your name:");
    if (name) welcomeUser(name);
}

// Function to welcome the user
function welcomeUser(name) {
    const welcomeMessage = `Welcome, ${name}! Enjoy your interactive phonetic chart.`;
    const welcomeLabel = document.createElement('h2');
    welcomeLabel.textContent = welcomeMessage;
    document.body.prepend(welcomeLabel);

    const utterance = new SpeechSynthesisUtterance(welcomeMessage);
    utterance.pitch = 1.2;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);

    const startButton = document.getElementById('start-button');
    if (startButton) startButton.style.display = 'none';
}

// Function to create a phonetic button
function createButton(symbol, soundFile, container) {
    const button = document.createElement('div');
    button.className = 'chart-button';
    button.textContent = `/${symbol}/`;
    button.onclick = () => handleButtonClick(button, soundFile);
    container.appendChild(button);
}
function handleButtonClick(button, soundFile) {
    // Remove highlight from all buttons first
    const buttons = document.querySelectorAll('.chart-button');
    buttons.forEach(btn => btn.classList.remove('highlighted'));

    // Play the sound and highlight the clicked button
    playSound(soundFile).then(() => {
        button.classList.remove('highlighted');
    });
    button.classList.add('highlighted');

    const clone = button.cloneNode(true);
    clone.dataset.soundFile = soundFile;
    clone.classList.remove('highlighted');
    document.getElementById('follow-along').appendChild(clone);
}


// Clear Follow Along Chart
function clearFollowAlong() {
    const followAlongDiv = document.getElementById('follow-along');
    if (followAlongDiv) {
        followAlongDiv.innerHTML = '<h2>Follow Along Chart</h2><button class="play-button small-button" onclick="playSelectedSounds()">Play Selected Sounds</button>';
    } else {
        console.error("ERROR: Follow-along div not found.");
    }
}

// Play selected sounds with a delay
async function playSelectedSounds() {
    if (isPlaying) return;
    isPlaying = true;

    const buttons = document.querySelectorAll('#follow-along .chart-button');
    for (const button of buttons) {
        const soundFile = button.dataset.soundFile;
        await playSound(soundFile);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    isPlaying = false;
}

// Initialize the app
function init() {
    console.log('DEBUG: Initialization started');
    const startButton = document.getElementById('start-button');
    if (startButton) {
        startButton.addEventListener('click', () => {
            getUserName();
            const vowelSoundsDiv = document.querySelector('#vowel-sounds .chart-container');
            const consonantSoundsDiv = document.querySelector('#consonant-sounds .chart-container');

            if (vowelSoundsDiv) {
                for (const [symbol, soundFile] of Object.entries(phoneticSounds.vowels)) {
                    console.log(`DEBUG: Creating button for symbol: /${symbol}/`);
                    createButton(symbol, soundFile, vowelSoundsDiv);
                }
            } else {
                console.error("ERROR: Vowel sounds container not found.");
            }

            if (consonantSoundsDiv) {
                for (const [symbol, soundFile] of Object.entries(phoneticSounds.consonants)) {
                    createButton(symbol, soundFile, consonantSoundsDiv);
                }
            } else {
                console.error("ERROR: Consonant sounds container not found.");
            }
        });
    } else {
        console.error('ERROR: Start button not found.');
    }
}

window.onload = init;

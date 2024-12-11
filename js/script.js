// Object holding paths to phonetic sound files
const phoneticSounds = {
    vowels: {
        "a": "sounds/sound_a.mp3",
        "e": "sounds/sound_e.mp3",
        "i": "sounds/sound_i.mp3",
        "o": "sounds/sound_o.mp3",
        "u": "sounds/sound_u.mp3"
    },
    consonants: {
        "b": "sounds/sound_b.mp3",
        "d": "sounds/sound_d.mp3",
        "f": "sounds/sound_f.mp3",
        "g": "sounds/sound_g.mp3",
        "h": "sounds/sound_h.mp3"
    }
};

let isPlaying = false; // Variable to track if sounds are being played

// Function to play a sound
function playSound(filePath) {
    console.log(`DEBUG: Attempting to play sound from: ${filePath}`);
    const audio = new Audio(filePath);
    return audio.play().then(() => {
        console.log(`DEBUG: Successfully playing sound from: ${filePath}`);
    }).catch((error) => {
        console.error(`ERROR: Failed to play sound ${filePath}: ${error}`);
        alert(`Failed to play sound from ${filePath}. Please check if the file exists.`);
    });
}

// Function to prompt user for their name and welcome them
function getUserName() {
    const name = prompt("Please enter your name:");
    console.log(`DEBUG: User entered name: ${name}`);
    if (name) welcomeUser(name);
}

// Function to display a welcome message and play it using speech synthesis
function welcomeUser(name) {
    const welcomeLabel = document.createElement('h2');
    welcomeLabel.textContent = `Welcome, ${name}! Enjoy your interactive phonetic chart.`;
    document.body.prepend(welcomeLabel);
    console.log(`DEBUG: Welcome message displayed for: ${name}`);

    const welcomeMessage = `Welcome, ${name}! Enjoy your interactive phonetic chart.`;
    const utterance = new SpeechSynthesisUtterance(welcomeMessage);
    utterance.pitch = 1.2; // Adjust pitch for a more natural sound
    utterance.rate = 1; // Normal speaking rate

    // Ensure voices are loaded before speaking
    const ensureVoicesLoaded = setInterval(() => {
        if (speechSynthesis.getVoices().length > 0) {
            clearInterval(ensureVoicesLoaded);
            console.log('DEBUG: Voices loaded:', speechSynthesis.getVoices());
            speechSynthesis.speak(utterance);
        }
    }, 100);
}

// Function to create a button for each phonetic sound
function createButton(symbol, soundFile, container) {
    const button = document.createElement('div');
    button.className = 'chart-button';
    button.textContent = `/${symbol}/`;
    button.onclick = () => handleButtonClick(button, soundFile);
    console.log(`DEBUG: Button created for symbol: /${symbol}/ with sound file: ${soundFile}`);
    container.appendChild(button);
}

// Function to handle button click events
function handleButtonClick(button, soundFile) {
    playSound(soundFile);
    button.classList.add('highlighted');
    console.log(`DEBUG: Button clicked, symbol: /${button.textContent}/, playing sound: ${soundFile}`);
    const clone = button.cloneNode(true);
    clone.dataset.soundFile = soundFile;
    clone.classList.remove('highlighted');
    document.getElementById('follow-along').appendChild(clone);
}

// Function to clear the Follow Along Chart
function clearFollowAlong() {
    document.getElementById('follow-along').innerHTML = '<h2>Follow Along Chart</h2><button class="play-button" onclick="playSelectedSounds()">Play Selected Sounds</button>';
    console.log('DEBUG: Follow Along Chart cleared');
}

// Function to clear highlighted buttons
function clearHighlights() {
    const highlightedButtons = document.querySelectorAll('.chart-button.highlighted');
    highlightedButtons.forEach(button => button.classList.remove('highlighted'));
    console.log('DEBUG: Highlights cleared');
}

// Function to play selected sounds in the Follow Along Chart with a delay
async function playSelectedSounds() {
    if (isPlaying) return;
    console.log('DEBUG: Playing selected sounds');

    const followAlongDiv = document.getElementById('follow-along');
    const buttons = followAlongDiv.querySelectorAll('div.chart-button');
    isPlaying = true;

    for (const button of buttons) {
        const soundFile = button.dataset.soundFile;
        await playSound(soundFile);
        console.log(`DEBUG: Playing sound file: ${soundFile}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Add delay between sounds
    }

    isPlaying = false;
    console.log('DEBUG: Finished playing selected sounds');
}

// Initialization function
function init() {
    console.log('DEBUG: Initialization started');
    const startButton = document.getElementById('start-button');
    if (startButton) {
        startButton.addEventListener('click', () => {
            getUserName();
            const vowelSoundsDiv = document.getElementById('vowel-sounds');
            for (const [symbol, soundFile] of Object.entries(phoneticSounds.vowels)) {
                createButton(symbol, soundFile, vowelSoundsDiv);
            }
            const consonantSoundsDiv = document.getElementById('consonant-sounds');
            for (const [symbol, soundFile] of Object.entries(phoneticSounds.consonants)) {
                createButton(symbol, soundFile, consonantSoundsDiv);
            }
            console.log('DEBUG: Buttons created for vowels and consonants');
        });
    } else {
        console.error('ERROR: Start button not found.');
    }
}

window.onload = init;

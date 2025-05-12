// Slide data
const slides = [
    {
    type: "vocab",
    title: "Vocabulary",
    words: [
        { word: "maganda", meaning: "beautiful", audioSrc: "3.mp3" },
        { word: "kamusta", meaning: "hello / how are you?", audioSrc: "3.mp3" },
        { word: "umaga", meaning: "morning", audioSrc: "3.mp3" },
        { word: "gabi", meaning: "night / evening", audioSrc: "3.mp3" }
    ]
},

    {
        type: "greeting",
        title: "Greeting People",
        subtitle: "LESSON 1",
        phrase: "Kumusta ka?",
        translation: "How are you?",
        audioSrc: "3.mp3" // Replace with audio path if needed
    },
    {
    type: "vocab-match",
    title: "Vocabulary Matching",
    pairs: [
        { A: "mahal kita", B: "i love u", audioA: "3.mp3", audioB: "3.mp3" },
        { A: "kain na", B: "eat", audioA: "3.mp3", audioB: "3.mp3" },
        { A: "huhuhu", B: "crying", audioA: "3.mp3", audioB: "3.mp3" },
        { A: "ako", B: "me", audioA: "3.mp3", audioB: "3.mp3" }
    ]
},
    {
  type: "fill-blank",
  sentence: "Magandang _____",
  correctAnswer: "Umaga",
  options: ["Umaga", "Agahan"],
  audioSrc: "3.mp3",
  correctTitle: "Awesome!",
  correctSub: "In English, it means 'Good morning'",
  incorrectTitle: "That's not right.",
  incorrectSubPrefix: "The correct answer is"
},
{
  type: "true-false",
  sentence: "Ang langit ay asul.",
  correctAnswer: "Tama",
  options: ["Tama", "Mali"],
  audioSrc: "3.mp3",
  correctTitle: "Correct!",
  correctSub: "Well done!",
  incorrectTitle: "Oops!",
  incorrectSubPrefix: "The correct answer is"
},
{
  type: "image-choice",
  title: "Choose the correct image",
  word: "Gabi", // word being tested
  audioSrc: "3.mp3",
  correctImageIndex: 2, // index of the correct image
  options: [
    "1.png",
    "2.jpg",
    "3.png",     // Correct
    "4.png"
  ],
  correctTitle: "Nice!",
  correctSub: "Gabi means 'night'.",
  incorrectTitle: "Not quite.",
  incorrectSubPrefix: "The correct image for"
},
{
    type: "speak-phrase",
    phrase: "Magandang hapon! Kumusta ka?",
    audioSrc: "3.mp3", // Make sure this path is correct
    correctTitle: "Nice pronunciation!",
    correctSub: "That was perfect.",
    incorrectTitle: "Try again.",
    incorrectSub: "Say it more clearly next time.",
  },
  {
  type: "image-choice",
  title: "Choose the correct image",
  word: "Gabi", // word being tested
  audioSrc: "3.mp3",
  correctImageIndex: 2, // index of the correct image
  options: [
    "1.png",
    "2.jpg",
    "3.png",     // Correct
    "4.png"
  ],
  correctTitle: "Nice!",
  correctSub: "Gabi means 'night'.",
  incorrectTitle: "Not quite.",
  incorrectSubPrefix: "The correct image for"
}



    
    
    
];

const slideContainer = document.getElementById("slide-container");
const continueBtn = document.querySelector(".Continue_btn button");
const progressBar = document.querySelector(".progress_bar");
let currentSlideIndex = 0;
let retryQueue = [];
let skipSpeakPhraseUntil = 0;


// Renders a slide based on type
function renderSlide(index) {
    if (index >= slides.length) return;

const slide = slides[index]; // <- move this after the bounds check
if (!slide) return;

// Skip speak-phrase slides for 10 minutes if the user opted out
const now = Date.now();
if (slide.type === "speak-phrase" && now < skipSpeakPhraseUntil) {
    renderSlide(index + 1);
    return;
}

slideContainer.innerHTML = ""; 

    // Update progress bar
    progressBar.value = ((index + 1) / slides.length) * 100;

    // Vocabulary Slide
    if (slide.type === "vocab") {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <h1 class="title">${slide.title}</h1>
        <h2 class="meaning_text">Tap on the word to view its definition.</h2>
        <div id="words-buttons" style="display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-top: 2rem;"></div>
    `;

    const buttonsContainer = wrapper.querySelector("#words-buttons");
    const meaningText = wrapper.querySelector(".meaning_text");

    slide.words.forEach(item => {
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.innerText = item.word;

        btn.addEventListener("click", () => {
            // Remove active class from all buttons
            const allBtns = wrapper.querySelectorAll(".btn");
            allBtns.forEach(b => b.classList.remove("active"));

            // Add active class to clicked button
            btn.classList.add("active");

            // Update meaning text
            meaningText.innerText = `${item.word}: ${item.meaning}`;

            // Play corresponding audio
            if (item.audioSrc) {
                playAudio(item.audioSrc);
            }
        });

        buttonsContainer.appendChild(btn);
    });

    slideContainer.appendChild(wrapper);
}

    // Greeting Slide
    else if (slide.type === "greeting") {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
            <h3 class="title">${slide.subtitle}</h3>
            <h1 class="title">${slide.title}</h1>
            <div class="audio-section" style="text-align: center; margin-top: 2rem;">
                <button class="audio-btn" onclick="playAudio('${slide.audioSrc}')">
            <img src="vms/vol.png" alt="Play audio" />
                </button>
                <h2 style="color:#008cdd; margin-top: 1rem;">${slide.phrase}</h2>
                <p style="color:#008cdd;">${slide.translation}</p>
            </div>
        `;
        slideContainer.appendChild(wrapper);
    }
else if (slide.type === "fill-blank") {
    continueBtnContainer.style.display = "none";

    const wrapper = document.createElement("div");
    wrapper.className = "fill-blank-slide";
    wrapper.innerHTML = `
        <h1 class="title">Fill in the Blanks</h1>
        <div class="audio-section">
            <button class="audio-btn" onclick="playAudio('${slide.audioSrc}')">
            <img src="vms/vol.png" alt="Play audio" />
                </button>
        </div>
        <h2 class="sentence">${slide.sentence}</h2>
        <div class="option-buttons">
            ${slide.options.map(opt => `<button class="blank-option">${opt}</button>`).join("")}
        </div>
        <div class="custom-bottom-dialog hidden">
            <div class="left">
                <h3 class="dialog-title"></h3>
                <p class="dialog-sub"></p>
            </div>
            <div class="right">
                <button class="custom-continue">CONTINUE ➤</button>
            </div>
        </div>
    `;
    slideContainer.appendChild(wrapper);

    const buttons = wrapper.querySelectorAll(".blank-option");
    const dialog = wrapper.querySelector(".custom-bottom-dialog");
    const continueBtn = wrapper.querySelector(".custom-continue");
    const dialogTitle = wrapper.querySelector(".dialog-title");
    const dialogSub = wrapper.querySelector(".dialog-sub");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.disabled = true);
            const isCorrect = btn.innerText === slide.correctAnswer;

            dialog.classList.remove("is-wrong");

            if (isCorrect) {
                playCorrectSound();
                btn.classList.add("correct");
                dialogTitle.innerText = slide.correctTitle || "Awesome!";
                dialogSub.innerText = slide.correctSub || "";
            } else {
                playWrongSound();
                if (!slide.retryCount || slide.retryCount < 1) {
    retryQueue.push({ ...slide, retryCount: (slide.retryCount || 0) + 1 });
}
                btn.classList.add("incorrect");
                dialog.classList.add("is-wrong");
                dialogTitle.innerText = slide.incorrectTitle || "That's not right.";
                dialogSub.innerText = `${slide.incorrectSubPrefix || "The correct answer is"} "${slide.correctAnswer}".`;
            }

            dialog.classList.remove("hidden");
        });
    });

    continueBtn.addEventListener("click", goToNextSlide);
}
else if (slide.type === "true-false") {
    continueBtnContainer.style.display = "none";

    const wrapper = document.createElement("div");
    wrapper.className = "fill-blank-slide"; // reuse same styling
    wrapper.innerHTML = `
        <h1 class="title">True or False</h1>
        <div class="audio-section">
            <button class="audio-btn" onclick="playAudio('${slide.audioSrc}')">
            <img src="vms/vol.png" alt="Play audio" />
                </button>
        </div>
        <h3 class="sentence small-sentence">${slide.sentence}</h3>
        <div class="option-buttons">
            ${slide.options.map(opt => `<button class="blank-option">${opt}</button>`).join("")}
        </div>
        <div class="custom-bottom-dialog hidden">
            <div class="left">
                <h3 class="dialog-title"></h3>
                <p class="dialog-sub"></p>
            </div>
            <div class="right">
                <button class="custom-continue">CONTINUE ➤</button>
            </div>
        </div>
    `;
    slideContainer.appendChild(wrapper);

    const buttons = wrapper.querySelectorAll(".blank-option");
    const dialog = wrapper.querySelector(".custom-bottom-dialog");
    const continueBtn = wrapper.querySelector(".custom-continue");
    const dialogTitle = wrapper.querySelector(".dialog-title");
    const dialogSub = wrapper.querySelector(".dialog-sub");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.disabled = true);
            const isCorrect = btn.innerText === slide.correctAnswer;

            dialog.classList.remove("is-wrong");

            if (isCorrect) {
                playCorrectSound();
                btn.classList.add("correct");
                dialogTitle.innerText = slide.correctTitle || "Awesome!";
                dialogSub.innerText = slide.correctSub || "";
            } else {
                playWrongSound();
                if (!slide.retryCount || slide.retryCount < 1) {
    retryQueue.push({ ...slide, retryCount: (slide.retryCount || 0) + 1 });
}
                btn.classList.add("incorrect");
                dialog.classList.add("is-wrong");
                dialogTitle.innerText = slide.incorrectTitle || "That's not right.";
                dialogSub.innerText = `${slide.incorrectSubPrefix || "The correct answer is"} "${slide.correctAnswer}".`;
            }

            dialog.classList.remove("hidden");
        });
    });

    continueBtn.addEventListener("click", goToNextSlide);
}

else if (slide.type === "image-choice") {
    continueBtnContainer.style.display = "none";

    // Create a shuffled copy of the options with tracking
    const optionObjects = slide.options.map((imgSrc, index) => ({
        imgSrc,
        isCorrect: index === slide.correctImageIndex,
    }));

    for (let i = optionObjects.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionObjects[i], optionObjects[j]] = [optionObjects[j], optionObjects[i]];
    }

    const newCorrectImageIndex = optionObjects.findIndex(opt => opt.isCorrect);

    const wrapper = document.createElement("div");
    wrapper.className = "image-choice-slide";
    wrapper.innerHTML = `
        <h1 class="title">${slide.title}</h1>
        <div class="audio-sentence">
            <button class="audio-btn" onclick="playAudio('${slide.audioSrc}')">
            <img src="vms/vol.png" alt="Play audio" />
                </button>
            <h2 class="sentence">${slide.word}</h2>
        </div>
        <div class="image-grid">
            ${optionObjects.map((opt, i) => `
                <button class="image-option" data-index="${i}">
                    <img src="${opt.imgSrc}" alt="Option ${i + 1}" />
                </button>
            `).join("")}
        </div>
        <div class="custom-bottom-dialog hidden">
            <div class="left">
                <h3 class="dialog-title"></h3>
                <p class="dialog-sub"></p>
            </div>
            <div class="right">
                <button class="custom-continue">CONTINUE ➤</button>
            </div>
        </div>
    `;

    slideContainer.appendChild(wrapper);

    const imageButtons = wrapper.querySelectorAll(".image-option");
    const dialog = wrapper.querySelector(".custom-bottom-dialog");
    const continueBtn = wrapper.querySelector(".custom-continue");
    const dialogTitle = wrapper.querySelector(".dialog-title");
    const dialogSub = wrapper.querySelector(".dialog-sub");

    imageButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            imageButtons.forEach(b => b.disabled = true);
            const isCorrect = index === newCorrectImageIndex;

            dialog.classList.remove("is-wrong");

            if (isCorrect) {
                playCorrectSound();
                btn.classList.add("correct");
                dialogTitle.innerText = slide.correctTitle || "Awesome!";
                dialogSub.innerText = slide.correctSub || "";
            } else {
                playWrongSound();
                if (!slide.retryCount || slide.retryCount < 1) {
                    retryQueue.push({ ...slide, retryCount: (slide.retryCount || 0) + 1 });
                }
                btn.classList.add("incorrect");
                dialog.classList.add("is-wrong");
                dialogTitle.innerText = slide.incorrectTitle || "That's not right.";
                dialogSub.innerText = `${slide.incorrectSubPrefix || "The correct image for"} "${slide.word}" is shown above.`;
                imageButtons[newCorrectImageIndex].classList.add("correct");
            }

            dialog.classList.remove("hidden");
        });
    });

    continueBtn.addEventListener("click", goToNextSlide);
}


else if (slide.type === "speak-phrase") {
    continueBtnContainer.style.display = "none";

    const wrapper = document.createElement("div");
    wrapper.className = "speak-phrase-slide";
    wrapper.innerHTML = `
        <h1 class="speak-phrase-title">Speak this sentence below</h1>
        <div class="speak-phrase-container">
            <button class="audio-btn" onclick="playAudio('${slide.audioSrc}')">
            <img src="vms/vol.png" alt="Play audio" />
                </button>
            <span class="speak-phrase-target highlighted-text">Loading...</span>
        </div>
        <button class="speak-phrase-mic-btn">🎤 CLICK AND HOLD TO SPEAK</button>
        <button class="speak-phrase-skip-btn">I can't speak now</button>
        <div class="custom-bottom-dialog hidden">
            <div class="left">
                <h3 class="dialog-title"></h3>
                <p class="dialog-sub"></p>
            </div>
        </div>
    `;
    slideContainer.appendChild(wrapper);

    const targetSpan = wrapper.querySelector(".speak-phrase-target");
    const spokenText = wrapper.querySelector(".speak-phrase-spoken");
    const micButton = wrapper.querySelector(".speak-phrase-mic-btn");
    const audioButton = wrapper.querySelector(".speak-phrase-audio-btn");
    const dialog = wrapper.querySelector(".custom-bottom-dialog");
    const dialogTitle = wrapper.querySelector(".dialog-title");
    const dialogSub = wrapper.querySelector(".dialog-sub");

    targetSpan.textContent = slide.phrase;
    let currentPhrase = slide.phrase;
    let isRecognizing = false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "tl-PH";
    recognition.continuous = false;
    recognition.interimResults = true;

    const skipBtn = wrapper.querySelector(".speak-phrase-skip-btn");

    skipBtn.addEventListener("click", () => {
    skipSpeakPhraseUntil = Date.now() + 10 * 60 * 1000; // 10 minutes
    goToNextSlide(); // move on immediately 
});
    audioButton.onclick = () => {
        const utterance = new SpeechSynthesisUtterance(currentPhrase);
        utterance.lang = "tl-PH";
        speechSynthesis.speak(utterance);
    };

    micButton.addEventListener("mousedown", () => {
        spokenText.textContent = "Listening...";
        recognition.start();
        isRecognizing = true;
    });

    micButton.addEventListener("mouseup", () => {
        if (isRecognizing) {
            recognition.stop();
            isRecognizing = false;
        }
    });

    recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
        }

        spokenText.textContent = transcript;

        const spokenWords = transcript.trim().toLowerCase().split(/\s+/);
        const targetWords = currentPhrase.trim().split(/\s+/);

        let highlighted = "";
        for (let i = 0; i < targetWords.length; i++) {
            const targetWord = targetWords[i];
            const spokenWord = spokenWords[i];
            if (spokenWord && spokenWord.toLowerCase() === targetWord.toLowerCase()) {
                highlighted += `<span class="matched">${targetWord}</span> `;
            } else {
                highlighted += `<span>${targetWord}</span> `;
            }
        }
        targetSpan.innerHTML = highlighted.trim();

        const isCorrect = transcript.trim().toLowerCase() === currentPhrase.trim().toLowerCase();

        dialog.classList.remove("is-wrong", "hidden");

        if (isCorrect) {
            playCorrectSound();
            dialogTitle.innerText = slide.correctTitle || "Great job!";
            dialogSub.innerText = slide.correctSub || "You said it correctly!";
        } else {
            playWrongSound();
            if (!slide.retryCount || slide.retryCount < 1) {
                retryQueue.push({ ...slide, retryCount: (slide.retryCount || 0) + 1 });
            }
            dialog.classList.add("is-wrong");
            dialogTitle.innerText = slide.incorrectTitle || "Not quite right.";
            dialogSub.innerText = slide.incorrectSub || "Try to say the full sentence clearly.";
        }

        setTimeout(goToNextSlide, 1500);
    };
}


else if (slide.type === "vocab-match") {
    const wrapper = document.createElement("div");
    wrapper.className = "wrapper_questions";
    wrapper.innerHTML = `
        <h1 class="title">${slide.title}</h1>
        <div class="main_question">
            <h2 class="meaning_text">Tap to match the word with its definition.</h2>
            <div class="match-buttons">
                <div class="buttons_A"></div>
                <div class="buttons_B"></div>
            </div>
        </div>
    `;
    slideContainer.appendChild(wrapper);

    const buttonsA = wrapper.querySelector('.buttons_A');
    const buttonsB = wrapper.querySelector('.buttons_B');

    let shuffledA = [...slide.pairs];
    let shuffledB = [...slide.pairs];

    shuffle(shuffledA);
    shuffle(shuffledB);

    buttonsA.innerHTML = '';
    buttonsB.innerHTML = '';

    // Render A buttons
    shuffledA.forEach((item) => {
        const btn = document.createElement('button');
        btn.className = 'option-A';
        btn.innerText = item.A;
        btn.dataset.value = item.A;
        btn.dataset.audio = item.audioA || '';
        buttonsA.appendChild(btn);
    });

    // Render B buttons
    shuffledB.forEach((item) => {
        const btn = document.createElement('button');
        btn.className = 'option-B';
        btn.innerText = item.B;
        btn.dataset.value = item.B;
        btn.dataset.audio = item.audioB || '';
        buttonsB.appendChild(btn);
    });

    let selectedA = null;
    let selectedB = null;

    // Add click event listeners for option A
    wrapper.querySelectorAll('.option-A').forEach(button => {
        button.addEventListener('click', () => {
            selectedA = button.dataset.value;
            wrapper.querySelectorAll('.option-A').forEach(b => b.classList.remove('selected', 'clicked'));
            button.classList.add('selected', 'clicked');

            if (button.dataset.audio) {
                playAudio(button.dataset.audio);
            }

            checkMatch();
        });
    });

    // Add click event listeners for option B
    wrapper.querySelectorAll('.option-B').forEach(button => {
        button.addEventListener('click', () => {
            selectedB = button.dataset.value;
            wrapper.querySelectorAll('.option-B').forEach(b => b.classList.remove('selected', 'clicked'));
            button.classList.add('selected', 'clicked');

            if (button.dataset.audio) {
                playAudio(button.dataset.audio);
            }

            checkMatch();
        });
    });

    function checkMatch() {
        if (selectedA && selectedB) {
            const match = slide.pairs.find(p => p.A === selectedA && p.B === selectedB);
            const btnA = wrapper.querySelector('.option-A.selected');
            const btnB = wrapper.querySelector('.option-B.selected');

            if (match) {
                btnA.classList.add('correct');
                btnB.classList.add('correct');
                btnA.disabled = true;
                btnB.disabled = true;

                // Play the correct sound when matched
                playCorrectSound();
            } else {
                btnA.classList.add('incorrect');
                btnB.classList.add('incorrect');
                setTimeout(() => {
                    btnA.classList.remove('incorrect');
                    btnB.classList.remove('incorrect');
                }, 1000);

                // Play the wrong sound when not matched
                playWrongSound();
            }

            // Reset selections after a match or incorrect choice
            wrapper.querySelectorAll('.option-A').forEach(b => b.classList.remove('selected', 'clicked'));
            wrapper.querySelectorAll('.option-B').forEach(b => b.classList.remove('selected', 'clicked'));
            selectedA = null;
            selectedB = null;
        }
    }
}




}
function shuffle(array) {   
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}
// Show next slide on continue
continueBtn.addEventListener("click", () => {
    stopEffectAudio()
    stopAudio();
    currentSlideIndex++;

    if (currentSlideIndex < slides.length) {
        renderSlide(currentSlideIndex);

        const slide = slides[currentSlideIndex];
        if (slide.audioSrc && slide.type !== "vocab" && slide.type !== "vocab-match") {
            setTimeout(() => playAudio(slide.audioSrc), 300);
        }

    } else if (retryQueue.length > 0) {
        slides.push(...retryQueue);
        retryQueue = [];
        renderSlide(currentSlideIndex); // Re-render same index since slides now extended

        const slide = slides[currentSlideIndex];
        if (slide.audioSrc && slide.type !== "vocab" && slide.type !== "vocab-match") {
            setTimeout(() => playAudio(slide.audioSrc), 300);
        }

    } else {
        continueBtn.disabled = true;
        continueBtn.innerText = "Finished";
    }
});


// Initial render
renderSlide(currentSlideIndex);


const goBackBtn = document.getElementById("go-back-btn");
const confirmExit = document.getElementById("confirm-exit");
const slideWrapper = document.querySelector(".wrapper");
const slideContent = document.getElementById("slide-container");
const continueBtnContainer = document.querySelector(".Continue_btn");

goBackBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // Hide all slide-related content
    slideWrapper.style.display = "none";
    slideContent.style.display = "none";
    continueBtnContainer.style.display = "none";

    // Show confirmation screen
    confirmExit.style.display = "flex";
});

const maybeNotBtn = confirmExit.querySelector("button:nth-child(3)");


let effectAudio = null;

function playCorrectSound() {
    stopEffectAudio();
    effectAudio = new Audio('vms/correct.mp3');
    effectAudio.play();
}

function playWrongSound() {
    stopEffectAudio();
    effectAudio = new Audio('vms/wrong.mp3');
    effectAudio.play(); 
}

function stopEffectAudio() {
    if (effectAudio && !effectAudio.paused) {
        effectAudio.pause();
        effectAudio.currentTime = 0;
    }
}


function goToNextSlide() {
    stopEffectAudio();
    stopAudio();
    currentSlideIndex++;

    if (currentSlideIndex < slides.length) {
        renderSlide(currentSlideIndex);

        const slide = slides[currentSlideIndex];
        if (slide.audioSrc && slide.type !== "vocab" && slide.type !== "vocab-match") {
            setTimeout(() => playAudio(slide.audioSrc), 300);
        }

    } else if (retryQueue.length > 0) {
        slides.push(...retryQueue);
        retryQueue = [];
        renderSlide(currentSlideIndex);

        const slide = slides[currentSlideIndex];
        if (slide.audioSrc && slide.type !== "vocab" && slide.type !== "vocab-match") {
            setTimeout(() => playAudio(slide.audioSrc), 300);
        }

    } else {
        const globalContinue = document.querySelector(".Continue_btn button");
        globalContinue.disabled = true;
        globalContinue.innerText = "Finished";
    }
}

maybeNotBtn.addEventListener("click", () => {
    // Show previous UI
    slideWrapper.style.display = "flex";
    slideContent.style.display = "flex";

    // Only show continueBtnContainer if current slide uses it
    const currentSlide = slides[currentSlideIndex];
    const shouldShowContinue = !["fill-blank", "true-false", "speak-phrase", "image-choice"].includes(currentSlide.type);
    continueBtnContainer.style.display = shouldShowContinue ? "flex" : "none";

    // Hide confirmation
    confirmExit.style.display = "none";
});

let currentAudio = null;  // Variable to hold the current audio


function stopAudio() {
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;  // Optionally reset the audio to the beginning
    }
}
function playAudio(audioSrc) {
    stopAudio();
    currentAudio = new Audio(audioSrc);
    currentAudio.play();
}




let isMuted = false; // Variable to track mute state

// Function to toggle mute state
function toggleMute() {
    isMuted = !isMuted;

    // Change the mute icon image
    const muteIcon = document.getElementById("mute-icon");
    if (isMuted) {
        muteIcon.src = "muted.png"; // Muted icon
        muteAudio(); // Call to mute audio
    } else {
        muteIcon.src = "sound.png"; // Sound icon
        unmuteAudio(); // Call to unmute audio
    }
}

// Mute all audio
function muteAudio() {
    const audios = document.querySelectorAll("audio");
    audios.forEach(audio => {
        audio.muted = true;
    });
}

// Unmute all audio
function unmuteAudio() {
    const audios = document.querySelectorAll("audio");
    audios.forEach(audio => {
        audio.muted = false;
    });
}

// Add event listener to mute icon
const muteIcon = document.getElementById("mute-icon");
muteIcon.addEventListener("click", toggleMute);
document.addEventListener('DOMContentLoaded', () => {
  const listenBtn = document.getElementById('listenBtn');
  const speakBtn = document.getElementById('speakBtn');
  const saveBtn = document.getElementById('saveBtn');
  const output = document.getElementById('output');
	output.setAttribute('contenteditable', 'true');
  const menuIcon = document.getElementById('menu-icon');
  const dropdownMenu = document.getElementById('dropdown-menu');

  let utterance = new SpeechSynthesisUtterance();
  let language = 'en-US';

  // Load voices
  let voices = [];
  const loadVoices = () => {
    voices = speechSynthesis.getVoices();
    utterance.voice = voices.find(v => v.lang === language);
  };
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }
  loadVoices();

  // Speech Recognition
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language;

    listenBtn.addEventListener('click', () => {
      recognition.start();
      listenBtn.textContent = 'Listening...';
    });

    recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  highlightWord(transcript); // Highlight the last word
  listenBtn.textContent = 'Listen'; // Reset the button
};


     // Highlight the last word
  highlightWord(transcript.split(' ').length - 1);
    };

   function highlightWord(transcript) {
  const words = transcript.split(' '); // Split the latest transcript into words
  const highlightedText = words.map((word, index) => {
    if (index === words.length - 1) {
      return `<span class="highlight">${word}</span>`;
    }
    return word;
  }).join(' ');

  // Append the highlighted text to the output without erasing previous content
  const existingText = output.innerHTML; // Preserve existing HTML
  output.innerHTML = `${existingText} ${highlightedText}`;
}


if (output.textContent.trim() === '') {
  output.textContent = 'Your transcription will appear here...';
}

output.addEventListener('focus', () => {
  if (output.textContent === 'Your transcription will appear here...') {
    output.textContent = '';
  }
});

output.addEventListener('blur', () => {
  if (output.textContent.trim() === '') {
    output.textContent = 'Your transcription will appear here...';
  }
});


    recognition.onerror = (error) => {
      console.error(error);
      listenBtn.textContent = 'Listen';
    };

    recognition.onend = () => {
      listenBtn.textContent = 'Listen';
    };
  } else {
    alert('Speech Recognition is not supported in your browser.');
  }

  speakBtn.addEventListener('click', () => {
    utterance.text = output.value;
    utterance.lang = language;
    speechSynthesis.speak(utterance);
  });

  saveBtn.addEventListener('click', () => {
    const blob = new Blob([output.value], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'transcription.txt';
    a.click();
  });

  // Toggle dropdown menu
  menuIcon.addEventListener('click', () => {
    dropdownMenu.classList.toggle('visible');
  });
});


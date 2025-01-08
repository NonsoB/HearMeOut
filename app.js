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
      highlightWord(transcript); // Highlight the transcript
      listenBtn.textContent = 'Listen'; // Reset the button
    };

    // Highlight Words in Transcription
    function highlightWord(transcript) {
      if (output.textContent === 'Your transcription will appear here...') {
        output.textContent = ''; // Clear placeholder
      }

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

  // Speak Button
  speakBtn.addEventListener('click', () => {
    const text = output.textContent.trim();
    if (text === '' || text === 'Your transcription will appear here...') {
      alert('Please provide text to speak!');
      return;
    }

    utterance.text = text;
    utterance.lang = language;
    speechSynthesis.speak(utterance);
  });

  // Save Button
  saveBtn.addEventListener('click', () => {
    const blob = new Blob([output.textContent.trim()], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'transcription.txt';
    a.click();
  });

  // Placeholder Logic
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

  // Toggle dropdown menu
  menuIcon.addEventListener('click', () => {
    dropdownMenu.classList.toggle('visible');
  });
});


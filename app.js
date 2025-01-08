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
    recognition.interimResults = true; // Enable real-time transcription updates

    listenBtn.addEventListener('click', () => {
      recognition.start();
      listenBtn.textContent = 'Listening...';
    });

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart + ' ';
        } else {
          interimTranscript = transcriptPart; // Capture the interim part
        }
      }

      // Combine final transcript and highlight the interim word in real-time
      const highlightedInterim = `<span class="highlight">${interimTranscript}</span>`;
      output.innerHTML = `${finalTranscript}${highlightedInterim}`;
    };

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

  output.addEventListener('input', () => {
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


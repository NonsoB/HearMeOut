document.addEventListener('DOMContentLoaded', () => {
  const listenBtn = document.getElementById('listenBtn');
  const speakBtn = document.getElementById('speakBtn');
  const saveBtn = document.getElementById('saveBtn');
  const output = document.getElementById('output');
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
      output.value += `${transcript}\n`;
      listenBtn.textContent = 'Listen';
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


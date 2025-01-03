document.addEventListener('DOMContentLoaded', () => {
  const listenBtn = document.getElementById('listenBtn');
  const speakBtn = document.getElementById('speakBtn');
  const saveBtn = document.getElementById('saveBtn');
  const output = document.getElementById('output');
  const feedbackForm = document.getElementById('feedbackForm');

  let utterance = new SpeechSynthesisUtterance();

  let language = 'en-US';
  let voice = 'male';

  // Check if the browser supports the Web Speech API
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = language;
    recognition.interimResults = false;
    recognition.continuous = false;

    listenBtn.addEventListener('click', () => {
      recognition.start();
      listenBtn.textContent = 'Listening...';
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      output.value += `${transcript}\n`;
      listenBtn.textContent = 'Listen';
    };

    recognition.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error);
      alert(`Error: ${event.error}`);
      listenBtn.textContent = 'Listen';
    };

    recognition.onend = () => {
      listenBtn.textContent = 'Listen';
    };
  } else {
    alert('Sorry, your browser does not support Speech Recognition.');
  }

  speakBtn.addEventListener('click', () => {
    const text = output.value;
    utterance.text = text;
    utterance.lang = language;
    utterance.voice = voice === 'male' ? voices[0] : voices[1];
    speechSynthesis.speak(utterance);
  });

  const languageSelect = document.getElementById('language');
  languageSelect.addEventListener('change', (event) => {
    language = event.target.value;
    utterance.lang = language;
  });

  const voiceRadios = document.querySelectorAll('input[name="voice"]');
  voiceRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
      voice = event.target.value;
    });
  });

  saveBtn.addEventListener('click', () => {
    const blob = new Blob([output.value], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'transcription.txt';
    a.click();
  });

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your feedback!');
      feedbackForm.reset();
    });
  }

  // Hamburger Menu Toggle
  const menuIcon = document.getElementById('menu-icon');
  const dropdownMenu = document.getElementById('dropdown-menu');

  // Toggle dropdown menu visibility
  menuIcon.addEventListener('click', () => {
    dropdownMenu.classList.toggle('visible');
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const listenBtn = document.getElementById('listenBtn');
  const speakBtn = document.getElementById('speakBtn');
  const saveBtn = document.getElementById('saveBtn');
  const output = document.getElementById('output');
  const feedbackForm = document.getElementById('feedbackForm');

  let utterance = new SpeechSynthesisUtterance();
  let language = 'en-US';
  let voice = 'male';
  let voices = [];

  // Fetch voices from the speech synthesis API
  const loadVoices = () => {
    voices = speechSynthesis.getVoices();
    // Set default voice as male (or the first available voice)
    utterance.voice = voices.find(v => v.name.toLowerCase().includes('male')) || voices[0];
  };

  // Ensure voices are loaded
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
  } else {
    loadVoices();
  }

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


  // Add this function to highlight the word being transcribed
  function highlightWord(wordIndex) {
  const words = output.value.split(' ');  // Split the transcription into words
  const highlightedText = words.map((word, index) => {
    if (index === wordIndex) {
      return `<span class="highlight">${word}</span>`;  // Highlight the word
    }
    return word;
  }).join(' ');

  output.innerHTML = highlightedText;  // Update the textarea with highlighted text
}


    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      output.value += `${transcript}\n`;
      listenBtn.textContent = 'Listen';

 // Highlight the last word
  highlightWord(transcript.split(' ').length - 1); 
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
      // Set the voice based on selection
      utterance.voice = voice === 'male' ? voices.find(v => v.name.toLowerCase().includes('male')) : voices.find(v => v.name.toLowerCase().includes('female'));
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


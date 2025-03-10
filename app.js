document.addEventListener('DOMContentLoaded', () => {
  const listenBtn = document.getElementById('listenBtn');
  const speakBtn = document.getElementById('speakBtn');
  const saveBtn = document.getElementById('saveBtn');
  const output = document.getElementById('output');
  output.setAttribute('contenteditable', 'true');
  const menuIcon = document.getElementById('menu-icon');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const themeToggleBtn = document.getElementById('themeToggle'); // Button to toggle dark theme

  let utterance = new SpeechSynthesisUtterance();
  let language = 'en-US';

  // Check localStorage for saved theme preference
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggleBtn.textContent = 'Light Mode'; // Change button text to 'Light Mode' when in dark mode
  } else {
    themeToggleBtn.textContent = 'Dark Mode'; // Default to 'Dark Mode'
  }

  // Toggle dropdown menu visibility when clicking the menu icon
  menuIcon.addEventListener('click', () => {
    dropdownMenu.classList.toggle('visible');
  });

  // Toggle Dark Theme
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    // Save theme preference to localStorage
    if (document.body.classList.contains('dark-theme')) {
      localStorage.setItem('theme', 'dark');
      themeToggleBtn.textContent = 'Light Mode'; // Change to 'Light Mode' when dark mode is active
    } else {
      localStorage.setItem('theme', 'light');
      themeToggleBtn.textContent = 'Dark Mode'; // Change to 'Dark Mode' when light mode is active
    }
  });

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

  // Speak Button with Language Detection
  speakBtn.addEventListener('click', async () => {
    const text = output.textContent.trim();

    // Clear placeholder text before speaking
    if (text === 'Your transcription will appear here...') {
      output.textContent = ''; // Clear placeholder
    }

    if (text === '') {
      alert('Please provide text to speak!');
      return;
    }

    const words = text.split(' '); // Split the text into words
    let currentWordIndex = 0;

    utterance = new SpeechSynthesisUtterance();
    utterance.rate = 1; // Adjust speaking rate if needed

    try {
      // Detect the language of the text using a language detection API
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2/detect?key=AIzaSyBnDLg-PXY4sgsINkouOZJoL-N5OAaDtFo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
          }),
        }
      );

      const data = await response.json();
      if (data && data.data && data.data.detections) {
        const detectedLanguage = data.data.detections[0][0].language;
        utterance.lang = detectedLanguage; // Set the detected language
      } else {
        console.warn('Could not detect language; defaulting to English.');
        utterance.lang = 'en-US'; // Default to English if detection fails
      }
    } catch (error) {
      console.error('Error detecting language:', error);
      utterance.lang = 'en-US'; // Default to English on error
    }

    // Highlight the current word being spoken
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        // Highlight the current word
        const highlightedText = words.map((word, index) => {
          if (index === currentWordIndex) {
            return `<span class="highlight">${word}</span>`;
          }
          return word;
        }).join(' ');

        output.innerHTML = highlightedText; // Update the output with the highlighted word
        currentWordIndex++;
      }
    };

    // Reset after speaking finishes
    utterance.onend = () => {
      currentWordIndex = 0; // Reset index
      output.innerHTML = text; // Restore original text
    };

    utterance.text = text;
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

  // Translate Button Logic
  const translateBtn = document.getElementById('translate-btn');
  const languageDropdown = document.getElementById('language-dropdown');

  translateBtn.addEventListener('click', async () => {
    const text = output.textContent.trim();
    const targetLanguage = languageDropdown.value; // Get the selected language

    if (!text || text === 'Your transcription will appear here...') {
      alert('Please provide text to translate!');
      return;
    }

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=AIzaSyBnDLg-PXY4sgsINkouOZJoL-N5OAaDtFo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            target: targetLanguage,
          }),
        }
      );

      const data = await response.json();
      if (data && data.data && data.data.translations) {
        const translatedText = data.data.translations[0].translatedText;
        output.textContent = translatedText;
      } else {
        console.error('Translation failed:', data);
        alert('Translation failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during translation:', error);
      alert('An error occurred while translating. Please check your connection and try again.');
    }
  });
});
listenBtn.addEventListener('click', () => {
  recognition.start();
  listenBtn.textContent = 'Listening...';
});

recognition.onresult = (event) => {
  let finalTranscript = '';

  for (let i = 0; i < event.results.length; i++) {
    if (event.results[i].isFinal) {
      finalTranscript += event.results[i][0].transcript + ' ';
    }
  }

  // Detect language from predefined list
  const detectedLanguage = detectLanguage(finalTranscript);
  
  // Update output box
  output.value = finalTranscript;
  output.dataset.language = detectedLanguage;
};

recognition.onerror = (error) => {
  console.error(error);
  listenBtn.textContent = 'Listen';
};

recognition.onend = () => {
  listenBtn.textContent = 'Listen';
};

/**
 * Detect language based on predefined list in the HTML
 * @param {string} text - The spoken text to analyze
 * @returns {string} - Detected language or 'English' if no match
 */
function detectLanguage(text) {
  // Predefined languages (adjust this based on your list in HTML)
  const languageList = {
    'Bonjour': 'French',
    'Hola': 'Spanish',
    'Hallo': 'German',
    'Ciao': 'Italian',
    // Add more as needed
  };

  for (const [keyPhrase, language] of Object.entries(languageList)) {
    if (text.includes(keyPhrase)) {
      return language; // Return detected language
    }
  }

  return 'English'; // Default to English if no match
}


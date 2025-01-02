document.addEventListener('DOMContentLoaded', () => {
  const listenBtn = document.getElementById('listenBtn');
  const speakBtn = document.getElementById('speakBtn');
  const saveBtn = document.getElementById('saveBtn');
  const output = document.getElementById('output');
  const feedbackForm = document.getElementById('feedbackForm');
  const menuIcon = document.getElementById('menu-icon');
  const sideMenu = document.getElementById('side-menu');

  // Check if the browser supports the Web Speech API
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure the recognition instance
    recognition.lang = 'en-US'; // Language
    recognition.interimResults = false; // Only final results
    recognition.continuous = false; // Stops after a single recognition

    // Start listening when the button is clicked
    listenBtn.addEventListener('click', () => {
      recognition.start();
      listenBtn.textContent = 'Listening...'; // Update button text
    });

    // Handle the recognition results
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript; // Get the recognized text
      output.value += `${transcript}\n`; // Append the transcript to the textarea
      listenBtn.textContent = 'Listen'; // Reset button text
    };

    // Handle errors
    recognition.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error);
      alert(`Error: ${event.error}`);
      listenBtn.textContent = 'Listen'; // Reset button text
    };

    // Reset the button text when recognition ends
    recognition.onend = () => {
      listenBtn.textContent = 'Listen';
    };
  } else {
    alert('Sorry, your browser does not support Speech Recognition.');
  }

  // Simulate Speak Functionality
  speakBtn.addEventListener('click', () => {
    const text = output.value;
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support Text-to-Speech.');
    }
  });

  // Save Transcription
  saveBtn.addEventListener('click', () => {
    const blob = new Blob([output.value], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'transcription.txt';
    a.click();
  });

  // Feedback Submission
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your feedback!');
      feedbackForm.reset();
    });
  }
});

  // Toggle side menu visibility
  menuIcon.addEventListener('click', () => {
    sideMenu.classList.toggle('hidden'); // Toggle the hidden class
    if (sideMenu.classList.contains('hidden')) {
      sideMenu.style.left = '-250px'; // Slide menu off-screen
    } else {
      sideMenu.style.left = '0'; // Slide menu in
    }
  });
});


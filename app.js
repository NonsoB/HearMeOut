document.addEventListener('DOMContentLoaded', () => {
  const listenBtn = document.getElementById('listenBtn');
  const speakBtn = document.getElementById('speakBtn');
  const saveBtn = document.getElementById('saveBtn');
  const output = document.getElementById('output');

  // Simulate Listen Functionality
  listenBtn.addEventListener('click', () => {
    output.value += "Listening... (This will be transcription data)\n";
  });

 // Check if the browser supports the Web Speech API
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  // Configure the recognition instance
  recognition.lang = 'en-US'; // Language
  recognition.interimResults = false; // Only final results
  recognition.continuous = false; // Stops after a single recognition

 // Handle the recognition results
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript; // Get the recognized text
    outputField.value = transcript; // Display in the textarea
    listenButton.textContent = 'Listen'; // Reset button text
  };

  // Handle errors
  recognition.onerror = (event) => {
    console.error('Speech Recognition Error:', event.error);
    alert(`Error: ${event.error}`);
    listenButton.textContent = 'Listen'; // Reset button text
  };

  // Reset the button text when recognition ends
  recognition.onend = () => {
    listenButton.textContent = 'Listen';
  };
} else {
  alert('Sorry, your browser does not support Speech Recognition.');
}

  // Simulate Speak Functionality
  speakBtn.addEventListener('click', () => {
    const text = output.value;
    alert(`Speaking: ${text}`);
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
  const feedbackForm = document.getElementById('feedbackForm');
  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Thank you for your feedback!");
    feedbackForm.reset();
  });
});


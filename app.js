document.addEventListener('DOMContentLoaded', () => {
  const listenBtn = document.getElementById('listenBtn');
  const speakBtn = document.getElementById('speakBtn');
  const saveBtn = document.getElementById('saveBtn');
  const output = document.getElementById('output');

  // Simulate Listen Functionality
  listenBtn.addEventListener('click', () => {
    output.value += "Listening... (This will be transcription data)\n";
  });

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


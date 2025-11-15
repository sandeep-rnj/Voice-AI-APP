// eslint-disable-next-line
let isRecording = false;
let mediaRecorder,
  audioChunks = [];

const recordBtn = document.getElementById('recordBtn');
const transcriptDiv = document.getElementById('transcript');
const responseDiv = document.getElementById('response');
const audioPlayer = document.getElementById('audio');

recordBtn.onclick = async function () {
  if (!isRecording) {
    isRecording = true;
    audioChunks = [];
    recordBtn.textContent = 'Stop Recording';
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
    mediaRecorder.start();
  } else {
    isRecording = false;
    recordBtn.textContent = 'Start Recording';
    mediaRecorder.stop();
    mediaRecorder.onstop = async () => {
      let blob = new Blob(audioChunks, { type: 'audio/wav' });
      let formData = new FormData();
      formData.append('audio', blob, 'audio.wav');
      // 1. Transcribe with backend
      transcriptDiv.textContent = 'Transcribing...';
      const transcriptResp = await fetch(
        'http://localhost:3000/transcript/audio',
        {
          method: 'POST',
          body: formData,
        },
      );
      const transcript = await transcriptResp.text();
      transcriptDiv.textContent = 'Transcript: ' + transcript;
      // 2. LLM response
      responseDiv.textContent = 'Thinking...';
      const aiResp = await fetch('http://localhost:3000/chat/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: transcript }),
      });
      const aiJson = await aiResp.json();
      const aiText = aiJson.reply;
      typeWriterEffect(responseDiv, 'AI: ' + aiText, 40);
      // 3. ElevenLabs TTS
      const ttsResp = await fetch('http://localhost:3000/audio/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiText }),
      });
      const arrayBuffer = await ttsResp.arrayBuffer();
      audioPlayer.src = URL.createObjectURL(
        new Blob([arrayBuffer], { type: 'audio/mpeg' }),
      );
      audioPlayer.play();
    };
  }
};

function typeWriterEffect(el, text, speed) {
  el.textContent = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

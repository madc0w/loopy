let isRecording = false;
let audioChunks = [];

function load() {
	document.getElementById('toggle-recording-button').innerHTML = 'Start';
}

async function toggleRecording() {
	isRecording = !isRecording;
	document.getElementById('toggle-recording-button').innerHTML = isRecording
		? 'Stop'
		: 'Start';

	if (isRecording) {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

		mediaRecorder = new MediaRecorder(stream);
		mediaRecorder.ondataavailable = (event) => {
			audioChunks.push(event.data);
		};

		const recordedAudio = document.getElementById('recorded-audio');
		mediaRecorder.onstop = () => {
			const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
			const audioUrl = URL.createObjectURL(audioBlob);
			console.log('audioUrl', audioUrl);
			recordedAudio.src = audioUrl;
			audioChunks = [];
		};

		mediaRecorder.start();
	} else {
		mediaRecorder.stop();
	}
}

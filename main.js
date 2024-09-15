let isRecording = false;
let audioChunks = [];
let mediaRecorder;

function load() {
	document.getElementById('toggle-recording-button').innerHTML = 'Start';
}

async function toggleRecording() {
	isRecording = !isRecording;
	document.getElementById('toggle-recording-button').innerHTML = isRecording
		? 'Stop'
		: 'Start';

	if (isRecording) {
		recordAudio();
	} else {
		mediaRecorder.stop();
		const recordedAudio = document.getElementById('recorded-audio');
		recordedAudio.addEventListener('ended', async () => {
			console.log('ended');
			mediaRecorder.stop();
			await recordAudio();
			recordedAudio.play();
		});
		setTimeout(() => {
			recordedAudio.play();
		}, 20);
	}
}

async function recordAudio() {
	const recordedAudio = document.getElementById('recorded-audio');
	const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

	mediaRecorder = new MediaRecorder(stream);
	mediaRecorder.ondataavailable = (event) => {
		audioChunks.push(event.data);
	};

	mediaRecorder.onstop = async () => {
		const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
		// console.log('audioBlob.size', audioBlob.size);
		// const arrayBuffer = await audioBlob.arrayBuffer();
		const audioUrl = URL.createObjectURL(audioBlob);
		// console.log('audioUrl', audioUrl);
		recordedAudio.src = audioUrl;
		audioChunks = [];
	};

	mediaRecorder.start();
}

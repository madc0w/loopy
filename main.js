let isRecording = false;
let audioChunks = [];
let mediaRecorder;
let recordedAudio;

async function load() {
	document.getElementById('toggle-recording-button').innerHTML = 'Start';
	recordedAudio = document.getElementById('recorded-audio');
	recordedAudio.addEventListener('ended', async () => {
		// console.log('ended');
		mediaRecorder.stop();
		audioChunks = [];
		mediaRecorder.start();
		recordedAudio.play();
	});

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
		recordedAudio.play();
		// audioChunks = [];
	};
}

async function toggleRecording() {
	isRecording = !isRecording;
	document.getElementById('toggle-recording-button').innerHTML = isRecording
		? 'Stop'
		: 'Start';

	if (isRecording) {
		mediaRecorder.start();
	} else {
		mediaRecorder.stop();
		setTimeout(() => {
			recordedAudio.play();
		}, 20);
	}
}

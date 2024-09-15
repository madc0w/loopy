let audioChunks = [];
let mediaRecorder, recordedAudio, state;

async function load() {
	setState('waiting');
	recordedAudio = document.getElementById('recorded-audio');
	recordedAudio.addEventListener('ended', async () => {
		// console.log('ended');
		mediaRecorder.stop();
		audioChunks = [];
		// console.log('state', state);
		if (state == 'playing') {
			mediaRecorder.start();
			recordedAudio.play();
		}
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

async function buttonClick() {
	if (state == 'waiting') {
		setState('recording');
		mediaRecorder.start();
	} else if (state == 'recording') {
		setState('playing');
		mediaRecorder.stop();
		setTimeout(() => {
			recordedAudio.play();
		}, 20);
	} else if (state == 'playing') {
		setState('waiting');
	} else {
		console.error('unhandled state:', state);
	}
}

function setState(_state) {
	state = _state;
	document.getElementById('toggle-recording-button').innerHTML = {
		waiting: 'Record',
		recording: 'End Recording',
		playing: 'Stop',
	}[state];
}

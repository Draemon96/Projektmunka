import {loadJSON} from '../loaders.js';
import AudioBoard from '../AudioBoard.js';
/*
	const audioContext = new AudioContext();
	const audioBoard = new AudioBoard(audioContext);
	const loadAudio = createAudioLoader(audioContext);
	loadAudio('/audio/Jump.wav')
	.then(buffer =>{
		audioBoard.addAudio('Jump', buffer);
		//console.log(buffer);
	});
	loadAudio('/audio/Stomp.wav')
	.then(buffer =>{
		audioBoard.addAudio('Stomp', buffer);
		//console.log(buffer);
	});
*/
export function loadAudioBoard(name, audioContext){
	const loadAudio = createAudioLoader(audioContext);
	return loadJSON(`/sounds/${name}.json`)
		.then(audioSheet =>{
			const audioBoard = new AudioBoard(audioContext);
			const fx = audioSheet.fx;
			const jobs = [];
			Object.keys(fx).forEach(name => {
				const url = fx[name].url;
				//console.log(name, url);
				const job = loadAudio(url).then(buffer => {
					audioBoard.addAudio(name, buffer);
				});
				jobs.push(job);
			});
			return Promise.all(jobs).then(() => audioBoard);
			//console.log('loadAudioBoard context', audioContext);
			//console.log(audioSheet);
		});
}

export function createAudioLoader(context) {
	return function loadAudio(url){
		return fetch(url)
			.then(response => {
				return response.arrayBuffer();
			})
			.then(arrayBuffer => {
				return context.decodeAudioData(arrayBuffer);
			});
	};
}
import Entity from '../Entity.js';
import Emitter from '../traits/Emitter.js';
import {findPlayers} from '../player.js';
import {loadAudioBoard} from '../loaders/audio.js';

const HOLD_FIRE_TRESHOLD = 30;
const HOLD_FIRE_LONG = 300;

export function loadCannon(audioContext, entityFactories){
	return loadAudioBoard('cannon', audioContext)
	.then(audio =>{
		return createCannonFactory(audio, entityFactories);
	});
}

function createCannonFactory(audio, entityFactories){

	function emitBullet(cannon, level) {
		let dir = 1;
		for (const player of findPlayers(level)){
			//console.log(player);
			if(player.pos.x > cannon.pos.x - HOLD_FIRE_TRESHOLD
			&& player.pos.x < cannon.pos.x + HOLD_FIRE_TRESHOLD){
				return;
			}

			if(player.pos.x > cannon.pos.x + HOLD_FIRE_LONG
			|| player.pos.x < cannon.pos.x - HOLD_FIRE_LONG){
				return;
			}

			if(player.pos.x < cannon.pos.x) {
				dir = -1;	
			}
		}

		const bullet = entityFactories.bullet();

		bullet.pos.copy(cannon.pos);
		bullet.vel.set(50 * dir, 0);

		cannon.sounds.add('Shoot');
		level.entities.add(bullet);
	}

	return function createCannon(){
		const cannon = new Entity();
		cannon.audio = audio;

		const emitter = new Emitter();
		emitter.interval = 3;
		emitter.emitters.push(emitBullet);
		cannon.addTrait(emitter);

		return cannon;
	}
}
import {loadMario} from './entities/Mario.js';
import {loadGoomba} from './entities/Goomba.js';
import {loadKoopa} from './entities/Koopa.js';


export function loadEntities(){
	const entitiyFactories = {};

	function addAs(name) {
		return factory => entitiyFactories[name] = factory;
	}


	return Promise.all([
		loadMario().then(addAs('mario')),
		loadGoomba().then(addAs('goomba')),
		loadKoopa().then(addAs('koopa')),
	])
	.then (() => entitiyFactories);
}
import {Sides, Trait} from '../Entity.js';

export default class Stomper extends Trait{
	constructor(){
		super('stomper');
		this.bounceSpeed = 400;
	}

	bounce(us, them){
		us.bounds.bottom = them.bounds.top;
		us.vel.y = -this.bounceSpeed;
	}

	collides(us, them){
		//console.log(them.killable);
		
		if(!them.killable || them.killable.dead) {
			return;
		}

		//console.log('Collision in Mario', us.vel.y);
		if (us.vel.y > them.vel.y){
			this.queue(() => this.bounce(us, them));
			us.sounds.add('Stomp');
			this.events.emit('stomp', us, them);
		}
	}
}
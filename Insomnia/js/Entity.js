import{Vec2} from './math.js';
import AudioBoard from './AudioBoard.js';
import BoundingBox from './BoundingBox.js';
import EventEmitter from './EventEmitter.js';

export const Sides ={
	TOP : Symbol('top'),
	BOTTOM: Symbol('bottom'),
	LEFT : Symbol('left'),
	RIGHT : Symbol('right'),
};

export class Trait{
	constructor(name){
		this.NAME = name;

		this.events = new EventEmitter();
		this.sounds = new Set();
		this.tasks = [];
	}

	finalize(){
		this.tasks.forEach(task => task());
		this.tasks.length = 0;
	}

	queue(task){
		this.tasks.push(task);
	}

	collides(us, them){
		//console.log('Collided with', them);
	}

	obstruct(){

	}

	playSounds(audioBoard, audioContext){
		this.sounds.forEach(name => {
			audioBoard.playAudio(name, audioContext);
		});

		this.sounds.clear();
	}

	update(){
		//console.warn('Unhandled update call in Trait');
	}
}

export default class Entity{
	constructor(){
		this.audio = new AudioBoard();
		this.pos = new Vec2(0, 0);
		this.vel = new Vec2(0, 0);
		this.size = new Vec2(0, 0);
		this.offset = new Vec2(0, 0);
		this.bounds = new BoundingBox(this.pos, this.size, this.offset);
		this.lifetime = 0;

		this.traits = [];
	}

	addTrait(trait){
		this.traits.push(trait);
		this[trait.NAME] = trait;

	}

	collides(candidate){
		//console.log('Touched', candidate);
		this.traits.forEach(trait => {
			trait.collides(this, candidate);
		});
	}

	obstruct(side, match){
		//console.log(side);
		this.traits.forEach(trait => {
			trait.obstruct(this, side, match);
		});
	}

	draw(){

	}

	finalize(){
		this.traits.forEach(trait =>{
			trait.finalize();
		});
	}

	update(gameContext, level){
		this.traits.forEach(trait => {
			trait.update(this, gameContext, level);
			trait.playSounds(this.audio, gameContext.audioContext);
		});

		this.lifetime += gameContext.deltaTime;
	}
}
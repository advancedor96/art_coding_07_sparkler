let FPS = 60;
let screen_width = window.innerWidth;
let screen_height = window.innerHeight;
let gravity = 0.4;

let ctx;
let particle_list = [];
let mx = null, my = null; //滑鼠xy座標

let base_h = 0;   //hue的基底

//定義 particle 類別

let Particle = function (x, y, base_h){
	this.x = x;
	this.y = y;
	this.base_h = base_h;
};

Particle.prototype = {
	x: null,
	y: null,
	vx: 0,
	vy: 0,
	radius: 0,
	color: null,
	isRemove: false,
	base_h :0,

	create: function(){
		// console.log('產生');
		this.vx = Math.random() * 6 - 3;   //-3~3之間的數值
		this.vy = Math.random() * (-6) - 2; //-8~-2之間的數值
		this.radius = Math.random()* 20 +5;
		let r = 150;
		let g = Math.floor(Math.random()* 100 + 155);
		let b = Math.floor(Math.random()* 155 + 100);


		let h = Math.floor( Math.random()*90  + this.base_h); //0~360
		let s = Math.floor( Math.random()*100 ); //0~100
		let l = Math.floor( Math.random()*100 ); //0~100

		this.color = `hsla(${h}, 100%, 50%, 0.9`;
		// this.color = `rgb(${r}, ${g}, ${b} )`;
		// this.color = 'rgba(150, 150, 150, 1 )';
	},
	update: function () {
		this.vy += gravity;
		this.x +=this.vx;
		this.y +=this.vy;
		this.radius *= 0.97;
		if(this.x <0 || this.x > window.innerWidth || this.y > window.innerHeight){
			//this.x <0 || this.x > screen_width || this.y > screen.height
			// console.log('移除');
			this.isRemove = true;
		}
	},
	draw: function (){
		// console.log('draw');
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2, false);
		ctx.fill();
	}
}

window.onload = function(){
	init();
}

let init = function(){

	
	let canvas = document.querySelector('#mycanvas');
	if( !canvas || !canvas.getContext){
		return false;
	}
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx = canvas.getContext('2d');

	// canvas.addEventListener('touchstart', handleTouched, false);
	// canvas.addEventListener('touchmove', handleTouched, false);
	// canvas.addEventListener('mousedown', updateMousePos, false);
	// canvas.addEventListener('mousemove', updateMouseMove, false);

	window.addEventListener('resize', resize);

	loop(); //主迴圈
}
const resize = ()=>{

	let canvas = document.querySelector('#mycanvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
const updateMouseMove = (e)=>{
	console.log('mousemove e',e);
	e.preventDefault();
	mx = e.clientX;
	my = e.clientY;
	// base_h =  Math.floor( Math.random()*360  ); //移動時不需改變基底顏色
}
const handleTouched = (event)=>{
	let touches = event.changedTouches,
		first = touches[0],
		type = "";
	console.log('touches',touches);
	console.log('first',first);
	switch(event.type){
		case "touchstart": type = "mousedown"; break;
		case "touchmove": type = "mousemove"; break;
		case "touchend": type = "mouseup"; break;
		default: 	return ;
	}

	let simulatedEvent = document.createEvent("MouseEvent");
	simulatedEvent.initMouseEvent(type, true, true, window, 1,
											first.screenX, first.screenY,
											first.clientX, first.clientY, event.ctrlKey,
											event.altKey, event.shiftKey, event.metaKey, 0, null);
	first.target.dispatchEvent(simulatedEvent);
	event.preventDefault();
	// evt.preventDefault();
	// if (evt.touches.length > 1 || (evt.type == "touchend" && evt.touches.length > 0))
	//   return;
 
	// var newEvt = document.createEvent("MouseEvents");
	// var type = null;
	// var touch = null;
 
	// switch (evt.type) {
	//   case "touchstart": 
	// 	 type = "mousedown";
	// 	 touch = evt.changedTouches[0];
	// 	 break;
	//   case "touchmove":
	// 	 type = "mousemove";
	// 	 touch = evt.changedTouches[0];
	// 	 break;
	//   case "touchend":        
	// 	 type = "mouseup";
	// 	 touch = evt.changedTouches[0];
	// 	 break;
	// }
 
	// newEvt.initMouseEvent(type, true, true, evt.target.ownerDocument.defaultView, 0,
	//   touch.screenX, touch.screenY, touch.clientX, touch.clientY,
	//   evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, 0, null);
	// evt.target.dispatchEvent(newEvt);	
}


// 加入下面2個，以及 82,83行的監聽事件，即可改成可以「仙女棒」
// const updateTouchMove = (e)=>{
// 	console.log('move e',e);
// 	e.preventDefault();
// 	let touches = e.changedTouches;
// 	console.log('touches event:',touches);
// 	mx = touches[0].pageX;
// 	my = touches[0].pageY;
// 	// base_h =  Math.floor( Math.random()*360  ); //移動時不需改變基底顏色
// }
// const updateTouchPos = (e)=>{
// 	let touches = e.changedTouches;
// 	console.log('touches',touches);
// 	mx = touches[0].pageX;
// 	my = touches[0].pageY;
// 	base_h =  Math.floor( Math.random()*360  );
// }


const updateMousePos = function (e){
	let rect = e.target.getBoundingClientRect();
	mx = e.clientX - rect.left;
	my = e.clientY - rect.top;

	base_h =  Math.floor( Math.random()*360  );
};

const resetMousePos = function(e){
	mx = null; my = null;
}
const loop = function(){
	add();
	update();
	draw();
	setTimeout(loop, 1000/FPS);
}
const add = ()=>{
	if(mx !== null && my !== null){
		//建立實體
		let p = new Particle(mx, my, base_h);
		p.create();

		particle_list.push(p);
		// console.log('長度：',particle_list.length);
	}
}

const update = () => {
	// console.log('particle_list.length',particle_list.length);
	// 建立空的 list ，只把目前的粒子加入 list ，再把 list 塞給 particle_list。以保持粒子數量只有1顆
	let list = [];

	for (let i = 0; i < particle_list.length; i++) {
		particle_list[i].update();
		if (!particle_list[i].isRemove) {
			list.push(particle_list[i]);
		}
	}
	particle_list = list;// 建立空的 list ，只把目前的粒子加入 list ，再把 list 塞給 particle_list。以保持粒子數量只有1顆
}

const draw = ()=>{
	
	ctx.fillStyle = 'rgba(0, 0, 0, 1)';
	ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

	//描繪顆粒
	ctx.save();
	ctx.globalCompositeOperation = 'lighter';

	for(let i=0;i<particle_list.length; i++){
		particle_list[i].draw();
	}
	ctx.restore();
}
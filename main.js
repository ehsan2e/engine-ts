(()=>{"use strict";var t,i={998:()=>{const t="timer.tick",i="renderable",e="game.state.undefined";var s,n,o;class h{constructor(t,i){this.state=e,this.validTransitions={},this.context=t,this.config=i;for(const t of i.transitions)this.validTransitions[h.getTransitionIdentifier(t.from,t.to)]=t;this.context.timer.attach(this.run.bind(this))}run(t){var i,e;for(let i=t.intervals;i>0&&void 0!==this.currentState;i--)this.currentState.update(t),this.context.mouse.flush(),this.context.keyboard.flush();null===(i=this.currentState)||void 0===i||i.draw(t.lag),this.context.debug&&(void 0===this.currentState&&(null===(e=this.debugState)||void 0===e||e.draw(t.lag)),this.context.debugger.sample(t),this.context.debugger.draw(this.context.display.ctx,this.context.display.width))}static getTransitionIdentifier(t,i){return`${t} -> ${i}`}switchState(t,i){return e=this,s=void 0,o=function*(){if(this.context.timer.stop(),!(t in this.config.states))throw new Error(`Unknown state '${t}" is requested`);if(!(h.getTransitionIdentifier(this.state,t)in this.validTransitions)&&!(h.getTransitionIdentifier(this.state,"game.state.*")in this.validTransitions))throw new Error(`Cannot transition from ${this.state} to ${t}`);this.state=t,this.currentState=this.config.states[this.state],this.context.debug&&(this.debugState=this.currentState),yield this.currentState.enter(this.context,this,i),this.context.debug&&this.context.debugger.reset(),this.currentState.shouldResetTimer()?this.context.timer.start():this.context.timer.continue(),this.context.keyboard.flush(),this.context.mouse.flush()},new((n=void 0)||(n=Promise))((function(t,i){function h(t){try{r(o.next(t))}catch(t){i(t)}}function a(t){try{r(o.throw(t))}catch(t){i(t)}}function r(i){var e;i.done?t(i.value):(e=i.value,e instanceof n?e:new n((function(t){t(e)}))).then(h,a)}r((o=o.apply(e,s||[])).next())}));var e,s,n,o}}class a{constructor(){this.height=200,this.SAMPLE_LENGTH=10,this.width=400,this.canvas=u(this.width,this.height),this.ctx=this.canvas.getContext("2d"),this.reset()}draw(t,i){var e;this.ctx.clearRect(0,0,this.width,this.height),this.ctx.fillStyle="rgba(0,0,0, 0.15)",this.ctx.fillRect(0,0,this.width,this.height),this.ctx.strokeStyle="rgba(255,255,255, 0.25)",this.ctx.lineWidth=2,this.ctx.strokeRect(2,2,this.width-4,this.height-4),this.ctx.fillStyle="rgba(255,255,255, 0.5)",this.ctx.font="15px Helvetica",this.ctx.textAlign="left",this.ctx.textBaseline="top";const s=t=>25*t-20;this.ctx.fillText("Debug mode:",5,s(1)),this.ctx.fillText(`Time: ${(this.now/1e3).toFixed(1)}`,5,s(2)),this.ctx.fillText(`Frame rate [${this.samples.slice().reverse().join(", ")}]: ${null===(e=this.frameRate)||void 0===e?void 0:e.toFixed(2)}`,5,s(3)),t.drawImage(this.canvas,i-this.width-10,10)}reset(){this.currentSamples=0,this.frameRate=0,this.lastTime=void 0,this.samples=new Array(this.SAMPLE_LENGTH).fill(0)}sample(t){if(void 0===this.lastTime)this.lastTime=t.time,this.currentSamples=1;else if(t.time-this.lastTime>1e3){do{this.samples.unshift(this.currentSamples),this.lastTime+=1e3,this.currentSamples=0}while(t.time-this.lastTime>1e3);this.samples.length>=this.SAMPLE_LENGTH&&(this.samples.length=this.SAMPLE_LENGTH),this.frameRate=this.samples.reduce(((t,i)=>t+i),0)/this.samples.length,this.lastTime=t.time,this.currentSamples=1}else this.currentSamples++;this.now=t.time}}class r{constructor(){this.listeners={},this.listeners["*"]=[]}on(t,i){t in this.listeners||(this.listeners[t]=[]),this.listeners[t].push(i)}emit(t,i){if(t in this.listeners)for(const e of this.listeners[t])e(i);for(const t of this.listeners["*"])t(i)}}class c{constructor(t){this.animationId=void 0,this.lag=0,this.offset=0,this.time=void 0,this.running=!1,this.config=t,this.intervalDuration=1e3/t.frameRate}enqueue(){this.isRunning()&&(this.animationId=requestAnimationFrame(this.run.bind(this)))}run(i){var e;void 0===this.time&&(this.time=0,this.offset=i),void 0!==this.stoppedAt&&(this.offset=i-this.stoppedAt,this.stoppedAt=void 0);let s=(i-(this.offset+this.time))/this.intervalDuration|0;if(s<0)throw new Error("!...");if(s>this.config.maxIntervals&&(this.offset+=(s-1)*this.intervalDuration,s=1),this.time+=s*this.intervalDuration,this.lag=i-this.time,s>0){const i={duration:this.intervalDuration,intervals:s,lag:this.lag,time:this.time};null===(e=this.config.eventEmitter)||void 0===e||e.emit(t,i)}this.enqueue()}attach(i){this.config.eventEmitter.on(t,i)}continue(){this.running=!0,this.enqueue()}isRunning(){return this.running}start(){this.reset(),this.running=!0,this.enqueue()}stop(){this.isRunning()&&(this.running=!1,this.stoppedAt=this.time,void 0!==this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=void 0))}reset(){this.lag=0,this.offset=0,this.running=!1,this.stoppedAt=void 0,this.time=void 0}}!function(t){t.PRESSED="PRESSED",t.RELEASED="RELEASED"}(s||(s={})),function(t){t.LEFT="LEFT",t.RIGHT="RIGHT"}(n||(n={})),function(t){t.NEUTRAL="NEUTRAL",t.PRESSED="PRESSED",t.RELEASED="RELEASED"}(o||(o={}));class l{constructor(){this.state={}}attach(){window.addEventListener("keydown",(t=>{this.state[t.key]=s.PRESSED})),window.addEventListener("keyup",(t=>{this.state[t.key]=s.RELEASED}))}flush(){for(const[t,i]of Object.entries(this.state))i===s.RELEASED&&delete this.state[t]}isPressed(t){return t in this.state&&this.state[t]===s.PRESSED}isReleased(t){return t in this.state&&this.state[t]===s.RELEASED}read(){return this.state}}class d{constructor(t){this.sketch=t}draw(t){this.sketch.draw(this.context.display.ctx,this.context.display.width,this.context.display.height)}enter(t,i,e){return s=this,n=void 0,h=function*(){this.context=t,t.timer.start()},new((o=void 0)||(o=Promise))((function(t,i){function e(t){try{r(h.next(t))}catch(t){i(t)}}function a(t){try{r(h.throw(t))}catch(t){i(t)}}function r(i){var s;i.done?t(i.value):(s=i.value,s instanceof o?s:new o((function(t){t(s)}))).then(e,a)}r((h=h.apply(s,n||[])).next())}));var s,n,o,h}shouldResetTimer(){return!0}update(t){this.sketch.update(this.context.timer,this.context.mouse,this.context.keyboard),this.context.keyboard.flush(),this.context.mouse.flush()}}function u(t,i){const e=document.createElement("canvas");return e.width=t,e.height=i,e}function f(t,i,e,s,n){return s+((t=Math.max(i,Math.min(t,e)))-i)*(n-s)/(e-i)}class g{constructor(t,i){this.set(t,i)}add(t,i){this.set(this.x+t,this.y+i)}set(t,i){this.x=t,this.y=i}}class m{constructor(t){this.levelFactory=t}draw(t){var i;null===(i=this.level)||void 0===i||i.draw(t)}enter(t,i,e){return s=this,n=void 0,h=function*(){this.level=yield this.levelFactory.load(e.level,t,i)},new((o=void 0)||(o=Promise))((function(t,i){function e(t){try{r(h.next(t))}catch(t){i(t)}}function a(t){try{r(h.throw(t))}catch(t){i(t)}}function r(i){var s;i.done?t(i.value):(s=i.value,s instanceof o?s:new o((function(t){t(s)}))).then(e,a)}r((h=h.apply(s,n||[])).next())}));var s,n,o,h}shouldResetTimer(){return this.level.shouldResetTimer()}update(t){var i;null===(i=this.level)||void 0===i||i.update(t.duration)}}class p{constructor(t,i="renderable"){this.entityManager=t,this.tag=i}render(t){this.entityManager.forEach((i=>{const e=i.renderInfo();t.drawImage(e.buffer,e.position.x,e.position.y)}),this.tag)}}const v="game play";class y{constructor(t,i="#F00",e="#FFF"){this.acceleration=new g(3e-4,3e-4),this.age=0,this.boost=new g(0,0),this.boostX=3e-4,this.boostXL=0,this.boostXR=0,this.dragSamples=[],this.dragging=!1,this.height=96,this.position=new g(200,50),this.velocity=new g(.3,0),this.width=64,this.id=t,this.background=i,this.foreground=e;const s=u(this.width,this.height);this.ctx=s.getContext("2d"),this.renderInformation={buffer:s,position:this.position}}boostLeft(t){this.boostXL=t?this.boostX:0,this.boost.x=this.boostXR-this.boostXL}boostRight(t){this.boostXR=t?this.boostX:0}boostUp(t){this.boost.y=t?-5e-4:0}navigate(t,i){if(t.isPressed("ArrowUp")?this.boostUp(!0):t.isReleased("ArrowUp")&&this.boostUp(!1),t.isPressed("ArrowLeft")?this.boostLeft(!0):t.isReleased("ArrowLeft")&&this.boostLeft(!1),t.isPressed("ArrowRight")?this.boostRight(!0):t.isReleased("ArrowRight")&&this.boostRight(!1),i.isLeftKeyDown()){const t=i.getPosition();this.position.set(t.x,t.y),this.dragging=!0}else if(i.isLeftKeyReleased()){this.dragging=!1;const t=i.getPosition();this.position.set(t.x,t.y)}}renderInfo(){return this.ctx.fillStyle=this.background,this.ctx.fillRect(0,0,this.width,this.height),this.ctx.fillStyle=this.foreground,this.ctx.font="20px Helvetica",this.ctx.textAlign="center",this.ctx.textBaseline="middle",this.ctx.fillText(`${this.id}`,this.width/2,this.height/2-25),this.ctx.fillText((this.age/1e3).toFixed(1).toString(),this.width/2,this.height/2+10),this.renderInformation}update(t){if(this.age+=t,this.dragging)this.dragSamples.unshift(new g(this.position.x,this.position.y)),this.dragSamples.length=3,this.velocity.set(0,0);else{const i=this.dragSamples.length;i>1?(this.velocity.set(f(this.dragSamples[0].x-this.dragSamples[i-1].x,-105,105,-45,45)/(t*(i-1)),f(this.dragSamples[0].y-this.dragSamples[i-1].y,-105,105,-45,45)/(t*(i-1))),this.dragSamples.length=0):1===i?this.dragSamples.length=0:(this.boost.x=this.boostXR-this.boostXL,this.velocity.add((this.acceleration.x+this.boost.x)*t,(this.acceleration.y+this.boost.y)*t)),this.position.add(this.velocity.x*t,this.velocity.y*t),this.position.x<5&&(this.position.x=5),this.position.y<5&&(this.position.y=5)}}static make(t){return t%2==0?new y(t,"#0F0","#050"):new y(t,"#F00","#500")}}const x="dynamic";class E{constructor(t){this.config=t}draw(t){this.config.compositor.draw(this.config.context.display.ctx,this.config.context.display.width,this.config.context.display.height,t)}loadScheduler(){this.update=t=>{this.config.scheduler.update(t),this.config.entityManager.forEach((i=>i.update(t)),x)};const t=0|Number(this.config.name),e=Math.max(1e3-25*t,20);for(let s=0;s<t;s++){const t="player "+s;0===s?this.config.entityManager.add(t,y.make(s),[i,x]):this.config.scheduler.schedule(e*s,(()=>this.config.entityManager.add(t,y.make(s),[i,x]))),this.config.scheduler.schedule(2500+e*s,(()=>this.config.entityManager.remove(t)))}this.config.scheduler.schedule(2500+e*(t-1),(()=>{const i={level:`${t+1}`};this.config.stateMachine.switchState(v,i)}))}loadNavigation(){const t=y.make(1);this.config.entityManager.add("player",t,[i,x]),this.update=i=>{t.navigate(this.config.context.keyboard,this.config.context.mouse),t.update(i)}}load(){return t=this,i=void 0,s=function*(){this.loadNavigation(),this.config.compositor.addLayer((t=>{const i=t.getContext("2d");return i.fillStyle="#FFF",i.font="30px Helvetica",i.fillText(`Level: ${this.config.name}`,10,t.height/2),i.textBaseline="middle",i=>{i.drawImage(t,0,0)}})(u(200,100)));const t=new p(this.config.entityManager);this.config.compositor.addLayer(t.render.bind(t),0)},new((e=void 0)||(e=Promise))((function(n,o){function h(t){try{r(s.next(t))}catch(t){o(t)}}function a(t){try{r(s.throw(t))}catch(t){o(t)}}function r(t){var i;t.done?n(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(h,a)}r((s=s.apply(t,i||[])).next())}));var t,i,e,s}shouldResetTimer(){return!0}update(t){throw Error(`What the ...! ${t}`)}}class w{constructor(){this.layers=[]}addLayer(t,i=0){this.layers.push({layer:t,depth:i}),this.layers.sort(((t,i)=>t.depth-i.depth))}draw(t,i,e,s){t.clearRect(0,0,i,e),this.layers.forEach((i=>{i.layer(t,s)}))}}class S{constructor(){this.entities={},this.taggedEntities={}}add(t,i,e=[]){this.entities[t]=i;for(const s of e)s in this.taggedEntities||(this.taggedEntities[s]={}),this.taggedEntities[s][t]=i}forEach(t,i){if(void 0===i)for(const i of Object.values(this.entities))t(i);else if(i in this.taggedEntities)for(const e of Object.values(this.taggedEntities[i]))t(e)}remove(t){delete this.entities[t];for(const i of Object.values(this.taggedEntities))delete i[t]}}class b{constructor(){this.tasks=[],this.time=0}reset(){this.tasks=[],this.time=0}update(t){this.time+=t;const i=this.tasks.length;if(i>0){let t=0;for(;t<i;){const i=this.tasks[t];if(i.time>this.time)break;i.task(),t++}t>0&&this.tasks.splice(0,t)}}schedule(t,i){this.tasks.push({time:t,task:i}),this.tasks.sort(((t,i)=>t.time-i.time))}}class R{load(t,i,e){return s=this,n=void 0,h=function*(){const s=new w,n=new S,o=new b,h=new E({compositor:s,context:i,entityManager:n,name:t,scheduler:o,stateMachine:e});return yield h.load(),h},new((o=void 0)||(o=Promise))((function(t,i){function e(t){try{r(h.next(t))}catch(t){i(t)}}function a(t){try{r(h.throw(t))}catch(t){i(t)}}function r(i){var s;i.done?t(i.value):(s=i.value,s instanceof o?s:new o((function(t){t(s)}))).then(e,a)}r((h=h.apply(s,n||[])).next())}));var s,n,o,h}}const L=document.querySelector("canvas");L.width=1360,L.height=765;const T={ctx:L.getContext("2d"),width:1360,height:765};let k=!0;k=!1;const A=new class{constructor(){this.leftKey=o.NEUTRAL,this.rightKey=o.NEUTRAL,this.position=new g(0,0)}attach(t){t.addEventListener("mousedown",(i=>{0===i.button?this.leftKey=o.PRESSED:2===i.button&&(this.rightKey=o.PRESSED),this.position.set(Math.max(0,Math.min(i.offsetX,t.width)),Math.max(0,Math.min(i.offsetY,t.height)))})),t.addEventListener("mouseup",(i=>{0===i.button?this.leftKey=o.RELEASED:2===i.button&&(this.rightKey=o.RELEASED),this.position.set(Math.max(0,Math.min(i.offsetX,t.width)),Math.max(0,Math.min(i.offsetY,t.height)))})),window.addEventListener("mouseup",(t=>{0===t.button?this.leftKey===o.PRESSED&&(this.leftKey=o.RELEASED):2===t.button&&this.rightKey===o.PRESSED&&(this.rightKey=o.RELEASED)})),t.addEventListener("mousemove",(i=>{this.position.set(Math.max(0,Math.min(i.offsetX,t.width)),Math.max(0,Math.min(i.offsetY,t.height)))})),t.addEventListener("contextmenu",(t=>(t.preventDefault(),!1)))}flush(){this.leftKey===o.RELEASED&&(this.leftKey=o.NEUTRAL),this.rightKey===o.RELEASED&&(this.rightKey=o.NEUTRAL)}getPosition(){return this.position}isLeftKeyDown(){return this.leftKey===o.PRESSED}isLeftKeyReleased(){return this.leftKey===o.RELEASED}isRightKeyDown(){return this.rightKey===o.PRESSED}isRightKeyReleased(){return this.rightKey===o.RELEASED}read(){return{left:this.leftKey,position:this.position,right:this.rightKey}}};A.attach(L);const D=function(t,i,e,s=!1,n){const o=new l;return o.attach(),{debug:s,debugger:new a,display:t,keyboard:o,mouse:i,timer:new c({eventEmitter:new r,frameRate:e,maxIntervals:n})}}(T,A,60,false,80);let P=[function(){const t={};return t["game play"]=new m(new R),{initialState:"game play",initialStatePayload:{level:"1"},stateMachineConfig:{states:t,transitions:[{from:e,to:v},{from:v,to:v}]}}}(),function(t){const i="SKETCH",s={};return s.SKETCH=new d(t),{initialState:i,initialStatePayload:{},stateMachineConfig:{states:s,transitions:[{from:e,to:i}]}}}(new class{constructor(){this.reset()}draw(t,i,e){const s=`Hello World! ${(this.cnt/60).toFixed(1)}`;t.fillStyle="#DEDEDE",t.fillRect(0,0,i,e),t.strokeStyle="#F00",t.beginPath(),t.moveTo(i/2,0),t.lineTo(i/2,e),t.moveTo(0,e/2),t.lineTo(i,e/2),t.stroke(),t.font="45px Helvetica",t.textAlign="center",t.textBaseline="middle",t.fillStyle="#009",t.fillText(s,i/2-1,e/2-1),t.fillStyle="#00F",t.fillText(s,i/2,e/2)}update(t,i,e){this.cnt++,0===this.state&&e.isPressed(" ")?(this.state=1,this.cnt=0):1===this.state&&e.isReleased(" ")&&(this.state=0),i.isLeftKeyDown()&&(t.stop(),t.start(),this.reset())}reset(){this.cnt=0,this.state=0}})];const M=P[1],K=new h(D,M.stateMachineConfig);K.switchState(M.initialState,M.initialStatePayload).catch(console.error.bind(console))}},e={};function s(t){var n=e[t];if(void 0!==n)return n.exports;var o=e[t]={exports:{}};return i[t](o,o.exports,s),o.exports}s.m=i,t=[],s.O=(i,e,n,o)=>{if(!e){var h=1/0;for(l=0;l<t.length;l++){for(var[e,n,o]=t[l],a=!0,r=0;r<e.length;r++)(!1&o||h>=o)&&Object.keys(s.O).every((t=>s.O[t](e[r])))?e.splice(r--,1):(a=!1,o<h&&(h=o));if(a){t.splice(l--,1);var c=n();void 0!==c&&(i=c)}}return i}o=o||0;for(var l=t.length;l>0&&t[l-1][2]>o;l--)t[l]=t[l-1];t[l]=[e,n,o]},s.o=(t,i)=>Object.prototype.hasOwnProperty.call(t,i),(()=>{var t={179:0,532:0};s.O.j=i=>0===t[i];var i=(i,e)=>{var n,o,[h,a,r]=e,c=0;if(h.some((i=>0!==t[i]))){for(n in a)s.o(a,n)&&(s.m[n]=a[n]);if(r)var l=r(s)}for(i&&i(e);c<h.length;c++)o=h[c],s.o(t,o)&&t[o]&&t[o][0](),t[o]=0;return s.O(l)},e=self.webpackChunkmy_webpack_project=self.webpackChunkmy_webpack_project||[];e.forEach(i.bind(null,0)),e.push=i.bind(null,e.push.bind(e))})();var n=s.O(void 0,[532],(()=>s(998)));n=s.O(n)})();
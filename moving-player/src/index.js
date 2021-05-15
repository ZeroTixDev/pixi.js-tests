import rgb from './rgb.js';

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    view: document.getElementById('canvas'),
    antialias: true,
    resolution: window.devicePixelRatio,
    backgroundColor: rgb(255, 255, 255),
    autoDensity: true,
});

const addToObject = (obj, data) => {
    for (const key of Object.keys(data)) {
        obj[key] = data[key];
    }
}

const getCircleTexture = (radius, color, renderer = app.renderer) => {
    const gfx = new PIXI.Graphics();
    
    gfx.beginFill(color);
    gfx.drawCircle(0, 0, radius);
    gfx.endFill();

    return renderer.generateTexture(gfx);
}


const controls = { 
    KeyW: { control: 'up' },
    KeyA: { control: 'left' },
    KeyD: { control: 'right' },
    KeyS: { control: 'down' },
};
const currentInput = { up: false, down: false, right: false, left: false };
const playerRadius = 30;

const texture = getCircleTexture(playerRadius, rgb(200, 0, 0));
const framesText = new PIXI.Text('Frames: 60fps', { fontFamily: 'Arial', fontSize: 24, fill: rgb(255, 255, 255) });
addToObject(framesText, { x: 50, y: 50 })
const player = new PIXI.Sprite(texture);

addToObject(player, 
    { x: 300, y: 300, _internal: { x: 300, y: 300 }, rotation: 0, xv: 0, yv: 0, radius: playerRadius, friction: 0.75, speed: 10000 }
);
player.anchor.set(0.5);

app.stage.addChild(player);   
app.stage.addChild(framesText);

const update = (delta) => {
    player.xv += (currentInput.right - currentInput.left) * player.speed * delta;
    player.yv += (currentInput.down - currentInput.up) * player.speed * delta;
    player.xv *= Math.pow(player.friction, delta * 120);
    player.yv *= Math.pow(player.friction, delta * 120);
    player._internal.x += player.xv * delta;
    player._internal.y += player.yv * delta;
    player.x = Math.round(player._internal.x);
    player.y = Math.round(player._internal.y);
}

let lastTime = 0;
let frames = 0;
let frameTimeCounter = 0;
const animate = (time) => {
    const delta = (time - lastTime) / 1000;
    update(delta);
    lastTime = time;

    if (frameTimeCounter >= 1) {
        framesText.text = `Frames: ${frames}fps`;
        frameTimeCounter = frames = 0;
    }
    frames++;
    frameTimeCounter += delta;

    requestAnimationFrame(animate);
};

requestAnimationFrame(animate);

const trackKeys = (event) => {
    if (event.repeat || (controls[event.code] === undefined)) return;
    currentInput[controls[event.code].control] = event.type === 'keydown';
}

window.addEventListener('keydown', trackKeys);
window.addEventListener('keyup', trackKeys);

const resize = () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', resize);

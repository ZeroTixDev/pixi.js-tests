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

const getRectTexture = (width, height, color, renderer = app.renderer) => {
    const gfx = new PIXI.Graphics();
    
    gfx.beginFill(color);
    gfx.drawRect(0, 0, width, height);
    gfx.endFill();

    return renderer.generateTexture(gfx);
}


const texture = getRectTexture(200, 200, rgb(0, 0, 200));
const square = new PIXI.Sprite(texture);
const speed = 1.2;

addToObject(square, 
    { x: window.innerWidth / 2, y: window.innerHeight / 2, rotation: 0, xv: 0, yv: 0 }
);
square.anchor.set(0.5);

app.stage.addChild(square);   

const update = (delta) => {
    square.x = window.innerWidth / 2;
    square.y = window.innerHeight / 2;
    square.rotation += speed * delta;
}

let lastTime = 0;
const animate = (time) => {
    const delta = (time - lastTime) / 1000;
    update(delta);
    lastTime = time;
    requestAnimationFrame(animate);
};

requestAnimationFrame(animate);


const resize = () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', resize);

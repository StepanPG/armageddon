import { obj } from "./input";
import { resources as images } from "./resourses";
import { Sprite } from "./sprite";
import { input } from "./input";
import { boxCollides } from "./collides";


let canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 600;
document.getElementById('game').appendChild(canvas);

let ctx = canvas.getContext('2d');

document.getElementById('restartGameOver').addEventListener('click', () => {
    reset();
});
document.getElementById('restartWinGame').addEventListener('click', () => {
    reset();
});

let score = 0;
let scoreEl = document.querySelector('#score span');

// Game variables 
let playerSpeed = 300;
let bulletSpeed = 500;
let asteroidSpeed = 100;

let bullets = [];
let asteroids = [];
let explosions = [];

let gameTime = 0;
let isGameFinished;

let lastFire = Date.now();
let lastTime = Date.now();

images.load([
    './img/a1.png',
    './img/a2.png',
    './img/a3.png',
    './img/player.png',
    './img/bg.jpg',
    './img/laser/lb3.png',
    './img/laser/lg3.png',
    './img/explosion.png',
]);

images.onReady(init);

let asteroidsArray;

let player = {
    pos: [canvas.width / 2 - 30, canvas.height - 60],
    weapon: 1
}

function init(){
    asteroidsArray = [images.get('./img/a1.png'), images.get('./img/a2.png'), images.get('./img/a3.png')];

    reset();
    player.sprite = new Sprite(images.get('./img/player.png'), [0, 0], [60, 60]);

    lastTime = Date.now();
    main();
}

function main(){
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;
    lastTime = now;

    update(dt);
    render();

    requestAnimationFrame(main);
}

function update(dt) {
    gameTime += dt;

    handleInput(dt);
    updateEntities(dt);

    // It gets harder over time by adding enemies using this
    // equation: 1-.993^gameTime
    if (Math.random() < 1 - Math.pow(.993, gameTime)) {
        let random = Math.floor(Math.random() * 10);
        let currentAsteroid;

        if (random < 3) {
            currentAsteroid = asteroidsArray[0];
        } else if (random > 6) {
            currentAsteroid = asteroidsArray[1];
        } else {
            currentAsteroid = asteroidsArray[2];
        }

        asteroids.push({
            pos: [Math.random() * (canvas.width - 33), -33],
            sprite: new Sprite(currentAsteroid, [0, 0], [33, 33])
        });
        
    }

    checkCollisions();
    isWin();

    scoreEl.innerHTML = score;
};

function handleInput(time) {
    if (input.isDown('DOWN')) {
        player.pos[1] += playerSpeed * time;
    }

    if (input.isDown('UP')) {
        player.pos[1] -= playerSpeed * time;
    }

    if (input.isDown('LEFT')) {
        player.pos[0] -= playerSpeed * time;
    }

    if (input.isDown('RIGHT')) {
        player.pos[0] += playerSpeed * time;
    }

    if (input.isDown('SPACE') && !isGameFinished && Date.now() - lastFire > 100) {
        let x = player.pos[0] + player.sprite.size[0] / 2;
        let y = player.pos[1] - player.sprite.size[1] / 2;

        switch (player.weapon) {
            case 1: 
                weaponOne(x, y); 
                break;
            case 2: 
                weaponOne(x, y);
                weaponTwo(x, y);
                break;

            default:
                weaponOne(x, y);
                break;
        }


        lastFire = Date.now();
    }
}

function weaponOne(x, y){
    bullets.push({
        type: 'straight',
        pos: [x - 18, y],
        sprite: new Sprite(images.get('./img/laser/lb3.png'), [0, 0], [9, 37])
    });

    bullets.push({
        type: 'straight',
        pos: [x + 8, y],
        sprite: new Sprite(images.get('./img/laser/lb3.png'), [0, 0], [9, 37])
    });
}

function weaponTwo(x, y){
    bullets.push({
        type: 'left',
        pos: [x - 18, y],
        sprite: new Sprite(images.get('./img/laser/lg3.png'), [0, 0], [9, 37])
    });

    bullets.push({
        type: 'right',
        pos: [x + 8, y],
        sprite: new Sprite(images.get('./img/laser/lg3.png'), [0, 0], [9, 37])
    });
}

function updateEntities(dt) {
    // Update the player sprite animation
    player.sprite.update(dt);

    //Update weapon
    if(score == 100){
        player.weapon = 2;
    }

    // Update all the bullets
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        let bulletHeight = bullet.sprite.size[1];

        if(bullet.type == 'straight'){
            bullet.pos[1] -= bulletSpeed * dt;
        } else if (bullet.type == 'left') {
            bullet.pos[0] -= bulletSpeed * dt / 2;
            bullet.pos[1] -= bulletSpeed * dt;
        } else if (bullet.type == 'right') {
            bullet.pos[0] += bulletSpeed * dt / 2;
            bullet.pos[1] -= bulletSpeed * dt;
        }

        // Remove the bullet if it goes offscreen
        if (bullet.pos[1] < -bulletHeight) {
            bullets.splice(i, 1);
            i--;
        }
    }

    // Update all the enemies
    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].pos[1] += asteroidSpeed * dt;
        asteroids[i].sprite.update(dt);

        // Remove if offscreen
        if (asteroids[i].pos[1] + asteroids[i].sprite.size[1] > canvas.height + asteroids[i].sprite.size[1]) {
            asteroids.splice(i, 1);
            i--;
        }
    }

    // Update all the explosions
    for (let i = 0; i < explosions.length; i++) {
        explosions[i].sprite.update(dt);

        // Remove if animation is done
        if (explosions[i].sprite.done) {
            explosions.splice(i, 1);
            i--;
        }
    }
}

function checkCollisions() {
    checkPlayerBounds();

    // Run collision detection for all enemies and bullets
    for (let i = 0; i < asteroids.length; i++) {
        let pos = asteroids[i].pos;
        let size = asteroids[i].sprite.size;

        for (let j = 0; j < bullets.length; j++) {
            let pos2 = bullets[j].pos;
            let size2 = bullets[j].sprite.size;

            if (boxCollides(pos, size, pos2, size2)) {
                // Remove the enemy
                asteroids.splice(i, 1);
                i--;

                // Add score
                score += 1;

                // Add an explosion
                explosions.push({
                    pos: pos,
                    sprite: new Sprite(images.get('./img/explosion.png'),
                        [0, 0],
                        [39, 39],
                        16,
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        null,
                        true)
                });

                // Remove the bullet and stop this iteration
                bullets.splice(j, 1);
                break;
            }
        }

        if (boxCollides(pos, size, player.pos, player.sprite.size) && !isGameFinished) {
            gameOver();
        }
    }
}

function checkPlayerBounds() {
    if (player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if (player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if (player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if (player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images.get('./img/bg.jpg'), 0, 0, canvas.width, canvas.height);

    if (!isGameFinished) {
        renderEntity(player);
    }

    renderEntities(bullets);
    renderEntities(asteroids);
    renderEntities(explosions);
}

function renderEntities(list) {
    for (let i = 0; i < list.length; i++) {
        renderEntity(list[i]);
    }
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}

function isWin(){
    if(score > 1000){
        winGame();
    }
}

//Win
function winGame(){
    document.getElementById('win-state').style.display = 'block';
    isGameFinished = true;
}

// Game over
function gameOver() {
    document.getElementById('game-over-state').style.display = 'block';
    isGameFinished = true;
}

// Reset game to original state
function reset() {
    document.getElementById('game-over-state').style.display = 'none';
    document.getElementById('win-state').style.display = 'none';

    isGameFinished = false;
    gameTime = 0;
    score = 0;

    asteroids = [];
    bullets = [];

    player.pos = [canvas.width / 2 - 30, canvas.height - 60];
    player.weapon = 1;
};

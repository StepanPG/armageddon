/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return input; });
var pressedKeys = {};

function setKey(event, status) {
    var code = event.keyCode;
    var key;

    switch (code) {
        case 32:
            key = 'SPACE'; break;
        case 37:
            key = 'LEFT'; break;
        case 38:
            key = 'UP'; break;
        case 39:
            key = 'RIGHT'; break;
        case 40:
            key = 'DOWN'; break;
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code);
    }

    pressedKeys[key] = status;
}

document.addEventListener('keydown', function (e) {
    setKey(e, true);
});

document.addEventListener('keyup', function (e) {
    setKey(e, false);
});

window.addEventListener('blur', function () {
    pressedKeys = {};
});

let input = {
    isDown: function (key) {
        return pressedKeys[key.toUpperCase()];
    }
};




/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__input__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__resourses__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sprite__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__collides__ = __webpack_require__(4);







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

__WEBPACK_IMPORTED_MODULE_1__resourses__["a" /* resources */].load([
    './img/a1.png',
    './img/a2.png',
    './img/a3.png',
    './img/player.png',
    './img/bg.jpg',
    './img/laser/lb3.png',
    './img/laser/lg3.png',
    './img/explosion.png',
]);

__WEBPACK_IMPORTED_MODULE_1__resourses__["a" /* resources */].onReady(init);

let asteroidsArray;

let player = {
    pos: [canvas.width / 2 - 30, canvas.height - 60],
    weapon: 1
}

function init(){
    asteroidsArray = [__WEBPACK_IMPORTED_MODULE_1__resourses__["a" /* resources */].get('./img/a1.png'), __WEBPACK_IMPORTED_MODULE_1__resourses__["a" /* resources */].get('./img/a2.png'), __WEBPACK_IMPORTED_MODULE_1__resourses__["a" /* resources */].get('./img/a3.png')];

    reset();
    player.sprite = new __WEBPACK_IMPORTED_MODULE_2__sprite__["a" /* Sprite */](__WEBPACK_IMPORTED_MODULE_1__resourses__["a" /* resources */].get('./img/player.png'), [0, 0], [60, 60]);

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
            sprite: new __WEBPACK_IMPORTED_MODULE_2__sprite__["a" /* Sprite */](currentAsteroid, [0, 0], [33, 33])
        });
        
    }

    checkCollisions();
    isWin();

    scoreEl.innerHTML = score;
};

function handleInput(time) {
    if (__WEBPACK_IMPORTED_MODULE_0__input__["a" /* input */].isDown('DOWN')) {
        player.pos[1] += playerSpeed * time;
    }

    if (__WEBPACK_IMPORTED_MODULE_0__input__["a" /* input */].isDown('UP')) {
        player.pos[1] -= playerSpeed * time;
    }

    if (__WEBPACK_IMPORTED_MODULE_0__input__["a" /* input */].isDown('LEFT')) {
        player.pos[0] -= playerSpeed * time;
    }

    if (__WEBPACK_IMPORTED_MODULE_0__input__["a" /* input */].isDown('RIGHT')) {
        player.pos[0] += playerSpeed * time;
    }

    if (__WEBPACK_IMPORTED_MODULE_0__input__["a" /* input */].isDown('SPACE') && !isGameFinished && Date.now() - lastFire > 100) {
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
        sprite: new __WEBPACK_IMPORTED_MODULE_2__sprite__["a" /* Sprite */](__WEBPACK_IMPORTED_MODULE_1__resourses__["a" /* resources */].get('./img/laser/lb3.png'), [0, 0], [9, 37])
    });

    bullets.push({
        type: 'straight',
        pos: [x + 8, y],
        sprite: new __WEBPACK_IMPORTED_MODULE_2__sprite__["a" /* Sprite */](__WEBPACK_IMPORTED_MODULE_1__resourses__["a" /* resources */].get('./img/laser/lb3.png'), [0, 0], [9, 37])
    });
}

function weaponTwo(x, y){
    bullets.push({
        type: 'left',
        pos: [x - 18, y],
        sprite: new __WEBPACK_IMPORTED_MODULE_2__sprite__["a" /* Sprite */](__WEBPACK_IMPORTED_MODULE_1__resourses__["a" /* resources */].get('./img/laser/lg3.png'), [0, 0], [9, 37])
    });

    bullets.push({
        type: 'right',
        pos: [x + 8, y],
        sprite: new __WEBPACK_IMPORTED_MODULE_2__sprite__["a" /* Sprite */](__WEBPACK_IMPORTED_MODULE_1__resourses__["a" /* resources */].get('./img/laser/lg3.png'), [0, 0], [9, 37])
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

            if (Object(__WEBPACK_IMPORTED_MODULE_3__collides__["a" /* boxCollides */])(pos, size, pos2, size2)) {
                // Remove the enemy
                asteroids.splice(i, 1);
                i--;

                // Add score
                score += 1;

                // Add an explosion
                explosions.push({
                    pos: pos,
                    sprite: new __WEBPACK_IMPORTED_MODULE_2__sprite__["a" /* Sprite */](__WEBPACK_IMPORTED_MODULE_1__resourses__["a" /* resources */].get('./img/explosion.png'),
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

        if (Object(__WEBPACK_IMPORTED_MODULE_3__collides__["a" /* boxCollides */])(pos, size, player.pos, player.sprite.size) && !isGameFinished) {
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
    ctx.drawImage(__WEBPACK_IMPORTED_MODULE_1__resourses__["a" /* resources */].get('./img/bg.jpg'), 0, 0, canvas.width, canvas.height);

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


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return resources; });
let resourceCache = {};
let loading = [];
let readyCallbacks = [];

// Load an image url or an array of image urls
function load(urlOrArr) {
    if (urlOrArr instanceof Array) {
        urlOrArr.forEach(function (url) {
            _load(url);
        });
    }
    else {
        _load(urlOrArr);
    }
}

function _load(url) {
    if (resourceCache[url]) {
        return resourceCache[url];
    }
    else {
        let img = new Image();
        img.onload = function () {
            resourceCache[url] = img;

            if (isReady()) {
                readyCallbacks.forEach( (func) => { func(); });
            }
        };
        resourceCache[url] = false;
        img.src = url;
    }
}

function get(url) {
    return resourceCache[url];
}

function isReady() {
    let ready = true;
    for (let k in resourceCache) {
        if (resourceCache.hasOwnProperty(k) &&
            !resourceCache[k]) {
            ready = false;
        }
    }
    return ready;
}

function onReady(func) {
    readyCallbacks.push(func);
}

let resources = {
    load: load,
    get: get,
    onReady: onReady,
    isReady: isReady
};




/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Sprite; });
class Sprite {
    constructor(image, pos, size, speed, frames, dir, once) {
        this.image = image;
        this.pos = pos; // array ??
        this.size = size; // size of the sprite 
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames; //array of indexes for animating: [0, 1, 2, 1]
        this.dir = dir || 'horizontal';
        this.once = once; //true to only run the animation once

        this._index = 0;
    }

    update(dt) {
        this._index += this.speed * dt;
    }

    render(canvas2D) {
        var frame;

        if (this.speed > 0) {
            var max = this.frames.length;
            var idx = Math.floor(this._index);
            frame = this.frames[idx % max];

            if (this.once && idx >= max) {
                this.done = true;
                return;
            }
        }
        else {
            frame = 0;
        }

        var x = this.pos[0];
        var y = this.pos[1];

        if (this.dir == 'vertical') {
            y += frame * this.size[1];
        }
        else {
            x += frame * this.size[0];
        }

        canvas2D.drawImage(this.image,
            x, y,
            this.size[0], this.size[1],
            0, 0,
            this.size[0], this.size[1]);
    }
} 





/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return boxCollides; });


function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
        b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
        pos[0] + size[0], pos[1] + size[1],
        pos2[0], pos2[1],
        pos2[0] + size2[0], pos2[1] + size2[1]);
}



/***/ })
/******/ ]);
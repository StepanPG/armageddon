class Sprite {
    constructor(image, pos, size, speed, frames, dir, once) {
        this.image = image;
        this.pos = pos; 
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

export {Sprite}


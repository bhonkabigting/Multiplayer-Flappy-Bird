class Bird {
    constructor(images, y) {
        this.images = images;
        this.div = 0;
        this.gravity = -.4;
        this.velocity = 0;
        this.posY = y;
        this.posX = 72;
        this.fly = new Audio("/audio/wing.wav");
        this.bird = document.createElement("div");
        this.create();
    }

    create() {
        this.bird.style.position = "absolute";
        this.bird.style.bottom = this.posY + "px";
        this.bird.style.left = this.posX + "px";
        this.bird.style.width = "34px";
        this.bird.style.height = "24px";
        this.bird.style.backgroundImage = `url(${this.images[0]})`;
        this.bird.style.zIndex = 2;

        container.appendChild(this.bird);
    }

    jump() {
        this.velocity = 8;
        this.fly.play();
    }

    update() {
        this.velocity += this.gravity;
        this.posY += this.velocity;
        this.bird.style.bottom = this.posY + "px";
        this.bird.style.transform = `rotate(${-this.velocity * 5}deg)`;

        let index = Math.floor(this.div % 4);
        this.bird.style.backgroundImage = `url(${this.images[index]})`;
        this.div += 0.3;
    }
}

export default  Bird;
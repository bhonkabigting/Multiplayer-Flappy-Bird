class Pipe {
    constructor(x, y) {
        this.posX = x;
        // this.posY = -Math.floor(Math.random() * 208);
        this.posY = y;
        this.pipe = document.createElement("div");
        this.create();
    }

    create() {
        this.pipe.style.position = "absolute";
        this.pipe.style.left = this.posX + "px";
        this.pipe.style.bottom = this.posY + "px";
        this.pipe.style.width = "52px";
        this.pipe.style.height = "800px";
        this.pipe.style.backgroundImage = "url('sprites/pipes.png')";

        container.appendChild(this.pipe);
    }

    update() {
        this.posX -= 4;
        this.pipe.style.left = this.posX + "px";
        this.pipe.style.bottom = this.posY + "px";
    }
}

export default  Pipe;
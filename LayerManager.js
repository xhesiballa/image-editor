class LayerManager {
    constructor() {
        this.layers = [];
    }

    createNewLayerFromImage(image) {
        const layer = new Layer(500, 500);
        image.onload = () => {
            layer.drawImage(image);
        }
        this.layers.push(layer);
        return layer;
    }

    createEmptyLayer(){
        return new Layer(500, 500);
    }

    addEmptyLayer() {
        const layer = this.createEmptyLayer();
        this.layers.push(layer);
        return layer;
    }

    bringLayerToFront(layer) {
        this.layers.forEach(layer => layer.canvas.parentElement.style.zIndex = 0);
        layer.canvas.parentElement.style.zIndex = 1;
    }
}

class Layer {
    constructor(height, width) {
        Object.assign(this, { height, width });
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute("width", width);
        this.canvas.setAttribute("height", height);
    }

    drawImage(image) {
        this.canvas.getContext('2d').drawImage(image, 0, 0, 500, 500);
    }

    drawRectangle(x1, y1, x2, y2) {
        const start = this.translate(x1, y1);
        const end = this.translate(x2, y2);
        const width = end.x - start.x;
        const height = end.y - start.y;

        this.clear();
        const ctx = this.canvas.getContext('2d');
        ctx.setLineDash([4, 2]);
        ctx.strokeRect(start.x, start.y, width, height);
    }

    clear() {
        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getPixel(x, y) {
        let index = y * (this.width * 4) + x * 4;
        const imageData = this.canvas.getContext('2d').getImageData(0, 0, this.width, this.height);
        return [
            imageData.data[index++],
            imageData.data[index++],
            imageData.data[index++],
            imageData.data[index++]
        ]
    }

    crop({ start, end }) {
        const width = end.x - start.x;
        const height = end.y - start.y;

        const ctx = this.canvas.getContext('2d');
        const imagedata = ctx.getImageData(start.x, start.y, width, height);
        this.clear();
        this.canvas.setAttribute("width", imagedata.width);
        this.canvas.setAttribute("height", imagedata.height);
        ctx.putImageData(imagedata, 0, 0);
    }

    translate(x, y) {
        return { x: x * this.canvas.width / this.width, y: y * this.canvas.height / this.height }
    }

    set opacity(opacity) {
        const ctx = this.canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, this.width, this.height);
        let index = 1;
        while (index <= imageData.data.length) {
            if (index % 4 === 0) {
                imageData.data[index - 1] = opacity;
            }
            index++;
        }
        ctx.putImageData(imageData, 0, 0);
    }
}

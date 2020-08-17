class LayerManager {
    constructor(){
        this.layers = [];
    }

    createNewLayerFromImage(image){
        const layer = new Layer(500, 500);
        image.onload = () => {
            layer.drawImage(image);
        }
        this.layers.push(layer);
        return layer;
    }

    bringLayerToFront(layer){
        this.layers.forEach(layer => layer.canvas.style.zIndex = 0);
        layer.canvas.style.zIndex = 1;        
    }
}

class Layer{
    constructor(height, width){
        Object.assign(this, {height, width});
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute("width", width);
        this.canvas.setAttribute("height", height);
    }

    drawImage(image){
        this.canvas.getContext('2d').drawImage(image, 0, 0, 500, 500);
    }

    set opacity(opacity){
        const ctx = this.canvas.getContext('2d');
        const imageData = ctx.getImageData(0,0,this.width, this.height);
        let index = 1;
        while(index <= imageData.data.length){
            if(index%4 === 0){
                imageData.data[index-1] = opacity;
            }
            index++;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    getPixel(x, y) {
        let index = y * (this.width * 4) + x * 4;
        const imageData = this.canvas.getContext('2d').getImageData(0,0,this.width, this.height);
        return [
            imageData.data[index++],
            imageData.data[index++],
            imageData.data[index++],
            imageData.data[index++]
        ]
    }
}

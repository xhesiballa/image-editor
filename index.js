let layerManager  = null;
const layerMap = {};

document.addEventListener("DOMContentLoaded", () => {
    layerManager= new LayerManager();

    const input = document.querySelector('input[type=file]');
    input.addEventListener("change", (event) => {
        const file = event.target.files[0];
        const fileReader = new FileReader();

        const image = new Image();

        fileReader.onload = () => {
            image.src = fileReader.result;
        }
        fileReader.readAsDataURL(file);

        const layer = layerManager.createNewLayerFromImage(image);
        document.getElementById('canvasContainer').append(layer.canvas);

        const li = document.createElement('li');
        li.layer = layer;
       
        li.innerText = `Layer ${layerManager.layers.length}`
        li.addEventListener('click', (event) => {
            layerManager.bringLayerToFront(layer);
        })
        document.getElementById('layers').append(li);
    })
});

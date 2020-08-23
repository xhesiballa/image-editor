let layerManager = null;
let actionsLayer = null;
let activeLayer = null;

document.addEventListener("DOMContentLoaded", () => {
    layerManager = new LayerManager();
    actionsLayer = layerManager.createEmptyLayer();
    actionsLayer.canvas.style.zIndex = 5;
    showNewLayer(actionsLayer, false);
    initializeActionsLayer(actionsLayer, false);
    actionsLayer.canvas.parentElement.style.zIndex = 5;

    const input = document.querySelector('input[type=file]');
    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const fileReader = new FileReader();

        const image = new Image();

        fileReader.onload = () => {
            image.src = fileReader.result;
        }
        fileReader.readAsDataURL(file);

        showNewLayer(layerManager.createNewLayerFromImage(image));
    })

    const button = document.querySelector('input[type=button]');
    button.addEventListener('click', crop);
});

function showNewLayer(layer, list = true) {
    const layerContainer = document.createElement('div');
    layerContainer.classList.add('layer');
    layerContainer.append(layer.canvas);
    document.getElementById('canvasContainer').append(layerContainer);
    if (list) {
        activeLayer = layer;
        const li = document.createElement('li');
        li.layer = layer;

        li.innerText = `Layer ${layerManager.layers.length}`
        li.addEventListener('click', (event) => {
            layerManager.bringLayerToFront(layer);
            activeLayer = layer;
        })
        document.getElementById('layers').append(li);
    }
}

function initializeActionsLayer(layer) {
    let start = null;
    actionsLayer = layer;
    layer.canvas.addEventListener('mousedown', (event) => {
        const x = event.offsetX;
        const y = event.offsetY;
        start = { x, y };
    });

    layer.canvas.addEventListener('mouseup', (event) => {
        start = null;
    })

    layer.canvas.addEventListener('mouseleave', (event) => {
        start = null;
    })

    layer.canvas.addEventListener('mousemove', (event) => {
        if (start) {
            const x = event.offsetX;
            const y = event.offsetY;
            actionsLayer.drawRectangle(start.x, start.y, x, y);
            layer.selection = { start, end: { x, y } }
        }
    })
}

function crop() {
    if (activeLayer && actionsLayer.selection) {
        console.log(activeLayer,actionsLayer.selection);
        actionsLayer.clear();
        activeLayer.crop(actionsLayer.selection);
        actionsLayer.selection = null;
    }
}

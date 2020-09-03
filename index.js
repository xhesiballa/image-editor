let layerManager = null;
let actionsLayer = null;
let activeLayer = null;
let movingLayer = null;

document.addEventListener("DOMContentLoaded", () => {
    layerManager = new LayerManager();
    actionsLayer = layerManager.createEmptyLayer();
    actionsLayer.canvas.style.zIndex = 5;
    showNewLayer(actionsLayer, false);
    initializeActionsLayer(actionsLayer, false);
    actionsLayer.canvas.parentElement.style.zIndex = 5;
    actionsLayer.canvas.parentElement.style.visibility = 'hidden';

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

    document.addEventListener('keydown', (event) => {
        if (event.key == "Enter") {
            crop();
        }
    });

    document.body.addEventListener('mousemove', (event) => {
        if (movingLayer) {
            const { movementX, movementY } = event;
            const style = movingLayer.canvas.parentElement.style;

            let left = Number(style.left.substring(0, style.left.indexOf('px'))) || 0;
            let top = Number(style.top.substring(0, style.top.indexOf('px'))) || 0;

            style.left = (left + Number(movementX)) + 'px';
            style.top = (top + Number(movementY)) + 'px';
        }
    });

});

function exportImage(){
    const {clientWidth, clientHeight} = document.getElementById('canvasContainer');
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', clientWidth);
    canvas.setAttribute('height', clientHeight);
    layerManager.layers.forEach(layer => {
        let {top, left} = layer.canvas.parentElement.style;
        left = Number(left.substring(0, left.indexOf('px'))) || 0;
        top = Number(top.substring(0, top.indexOf('px'))) || 0;
        const data = layer.canvas.getContext('2d').getImageData(0,0,layer.canvas.width, layer.canvas.height);
        canvas.getContext('2d').putImageData(data, left, top);
    });
    
    const a = document.createElement("a");
    a.href = canvas.toDataURL('image/jpeg');;
    a.setAttribute("download", 'image.jpeg');
    a.click();
}

function startCrop(){
    const style = activeLayer.canvas.parentElement.style;
    const _style = actionsLayer.canvas.parentElement.style
    actionsLayer.canvas.parentElement.classList.add('active');
    _style.top = style.top;
    _style.left = style.left;
    actionsLayer.canvas.getContext('2d').putImageData(new ImageData(activeLayer.canvas.width, activeLayer.canvas.height), 0, 0);
    actionsLayer.canvas.setAttribute("width", activeLayer.canvas.width);
    actionsLayer.canvas.setAttribute("height", activeLayer.canvas.height);
    actionsLayer.canvas.parentElement.style.removeProperty('visibility');
}

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
        });

        document.getElementById('layers').append(li);

        layer.canvas.addEventListener("mousedown", () => {
            if (activeLayer === layer) {
                movingLayer = layer;
            }
        });

        layer.canvas.addEventListener("mouseup", () => {
            movingLayer = null;
        });

        document.body.addEventListener("mouseup", () => {
            movingLayer = null;
        });

        document.getElementById('canvasContainer').addEventListener('mouseleave', (event) => {
            movingLayer = null;
        })
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
    actionsLayer.canvas.parentElement.style.visibility = 'hidden';
    actionsLayer.canvas.parentElement.style.removeProperty('active');

    if (activeLayer && actionsLayer.selection) {
        actionsLayer.clear();
        activeLayer.crop(actionsLayer.selection);
        actionsLayer.selection = null;
    }
}

function openFileUploadDialog(){
    document.querySelector('input[type="file"]').click();
}

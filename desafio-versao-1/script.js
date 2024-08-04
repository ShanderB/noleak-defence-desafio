var data = null;
var filteredDeepstreamMsgs = null;
const objectToFilter = "";
const foundObjects = new Set();
let allPoints = [];
let heatmapInstance = null;

function calculateCentroid(xMin, yMin, xMax, yMax) {
    const centroidX = (xMin + xMax) / 2;
    const centroidY = (yMin + yMax) / 2;
    return { x: centroidX, y: centroidY };
}

async function filterByObject(object) {
    const data = await loadJSON();

    return data.hits.hits.flatMap(msg => {
        return msg.fields["deepstream-msg"].filter(deepstreamMsg => {
            const [trackingId, xMin, yMin, xMax, yMax, deepstreamObject] = deepstreamMsg.split('|');
            foundObjects.add(deepstreamObject);

            return deepstreamObject === object;
        });
    });
}

async function loadJSON() {
    const response = await fetch('../assets/response.json');
    if (!response.ok) {
        throw new Error('Erro ao carregar o JSON');
    }

    return await response.json();
}

(async function loadAndRenderData() {
    const data = await loadJSON();

    allPoints = data.hits.hits.flatMap((msg) => {
        return msg.fields["deepstream-msg"].map((deepstreamMsg) => {
            const [trackingId, xMin, yMin, xMax, yMax, deepstreamObject] = deepstreamMsg.split('|');
            foundObjects.add(deepstreamObject);
            return {
                x: (parseFloat(xMin) + parseFloat(xMax)) / 2,
                y: (parseFloat(yMin) + parseFloat(yMax)) / 2,
                object: deepstreamObject,
            };
        });
    });

    updateObjectList();
})()

function updateObjectList() {
    const objectSelect = document.getElementById("objectSelect");
    foundObjects.forEach((object) => {
        const option = document.createElement("option");
        option.value = object;
        option.textContent = object;
        objectSelect.appendChild(option);
    });
}

function plotPoints(object) {
    const points = allPoints.filter((point) => point.object === object);

    if (!heatmapInstance) {
        heatmapInstance = h337.create({
            container: document.querySelector('.heatmap')
        });
    }

    heatmapInstance.setData({ max: 10, data: [] });

    const heatmapData = {
        max: 10,
        data: points.map(point => ({
            x: point.x,
            y: point.y,
            value: 1
        }))
    };

    heatmapInstance.setData(heatmapData);
}

document.getElementById("objectSelect").addEventListener("change", () => {
    const selectedObject = document.getElementById("objectSelect").value;
    plotPoints(selectedObject);
});

document.getElementById("downloadButton").addEventListener("click", () => {
    const canvas = document.querySelector('.heatmap canvas');
    const link = document.createElement('a');
    link.download = 'heatmap.png';
    link.href = canvas.toDataURL();
    link.click();

});
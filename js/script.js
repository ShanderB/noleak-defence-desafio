var data = null;
var filteredDeepstreamMsgs = null;
const objectToFilter = "chair";

function calculateCentroid(xMin, yMin, xMax, yMax) {
    const centroidX = (xMin + xMax) / 2;
    const centroidY = (yMin + yMax) / 2;
    return { x: centroidX, y: centroidY };
}
const foundObjects = new Set();


async function filterByObject(object) {
    const data = await loadJSON();


    if (data && data.hits && data.hits.hits) {
        return data.hits.hits.flatMap(msg => {
            if (msg.fields && msg.fields["deepstream-msg"]) {
                return msg.fields["deepstream-msg"].filter(deepstreamMsg => {
                    const [trackingId, xMin, yMin, xMax, yMax, deepstreamObject] = deepstreamMsg.split('|');
                    foundObjects.add(deepstreamObject);

                    return deepstreamObject === object;
                });
            }
            return [];
        });
    } else {
        console.error('Dados inválidos ou ausentes');
        return [];
    }
}


async function loadJSON() {
    try {
        const response = await fetch('response.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar o JSON');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}

filterByObject(objectToFilter).then(filteredMessages => {
    const points = filteredMessages.map(msg => {
        const [trackingId, xMin, yMin, xMax, yMax] = msg.split('|');
        return calculateCentroid(parseFloat(xMin), parseFloat(yMin), parseFloat(xMax), parseFloat(yMax));
    });

    console.log(foundObjects)

    const heatmapInstance = h337.create({
        container: document.querySelector('.heatmap')
    });

    const heatmapData = {
        max: 10,
        data: points.map(point => ({
            x: point.x,
            y: point.y,
            value: 1
        }))
    };

    heatmapInstance.setData(heatmapData);
});
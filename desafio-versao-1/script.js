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

filterByObject(objectToFilter).then(filteredMessages => {

    if (!filteredMessages) {
        throw new Error('Erro ao filtrar as mensagens. Possívelmente o objeto não foi encontrado');
    }

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
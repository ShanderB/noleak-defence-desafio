export default class PointFilter {
    constructor(object) {
        this.object = object;
    }

    filterPoints(data) {
        return data.hits.hits.flatMap(msg => {
            return msg.fields["deepstream-msg"].filter(deepstreamMsg => {
                const [trackingId, xMin, yMin, xMax, yMax, deepstreamObject] = deepstreamMsg.split('|');
                return deepstreamObject === this.object;
            }).map(deepstreamMsg => {
                const [trackingId, xMin, yMin, xMax, yMax, deepstreamObject] = deepstreamMsg.split('|');
                return { xMin: parseFloat(xMin), yMin: parseFloat(yMin), xMax: parseFloat(xMax), yMax: parseFloat(yMax) };
            });
        });
    }
}
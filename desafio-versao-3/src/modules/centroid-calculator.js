export default class CentroidCalculator {
    calculateCentroid(point) {
        const xCentroid = (point.xMin + point.xMax) / 2;
        const yCentroid = (point.yMin + point.yMax) / 2;
        return { x: xCentroid, y: yCentroid };
    }
}
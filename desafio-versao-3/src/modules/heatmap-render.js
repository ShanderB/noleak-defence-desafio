export default class HeatmapRenderer {
    constructor(heatmapLib) {
        this.heatmapLib = heatmapLib;
    }

    renderHeatmap(points) {
        const heatmapData = points.map(point => ({
            x: point.x,
            y: point.y,
            value: 1
        }));

        this.heatmapLib.setData({
            max: 1,
            data: heatmapData
        });
    }
}
import Heatmap from 'visual-heatmap';
import DataLoader from './modules/data-loader.js';
import PointFilter from './modules/point-filter.js';
import CentroidCalculator from './modules/centroid-calculator.js';
import HeatmapRenderer from './modules/heatmap-render.js';

console.log('aaaaaaa');

(async () => {
    /* const dataLoader = new DataLoader('../assets/response.json');
    const data = await dataLoader.loadData();

    const pointFilter = new PointFilter('person');
    const filteredPoints = pointFilter.filterPoints(data);

    const centroidCalculator = new CentroidCalculator();
    const centroids = filteredPoints.map(point => centroidCalculator.calculateCentroid(point));

    const heatmapLib = Heatmap('#heatmapContainer');
    const heatmapRenderer = new HeatmapRenderer(heatmapLib); */
    heatmapRenderer.renderHeatmap(centroids);
})();
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { GroupedData } from '../interfaces/grouped-data';

@Injectable({
  providedIn: 'root',
})
export class PlotDataService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  private gaussian(x: number, y: number, sigma: number): number {
    return (
      Math.exp(-(x * x + y * y) / (2 * sigma * sigma)) /
      (2 * Math.PI * sigma * sigma)
    );
  }

  private interpolateColor(value: number): [number, number, number, number] {
    const r = Math.min(255, Math.max(0, 255 * (value - 0.5) * 1231));
    const g = Math.min(255, Math.max(0, 255 * (1 - Math.abs(value - 0.5) * 2)));
    const b = Math.min(255, Math.max(0, 255 * (0.5 - value) * 1.5));
    const a = value > 0.01 ? Math.min(255, Math.max(150, value * 255)) : 0;
    return [r, g, b, a];
  }

  plotData(filteredData: GroupedData, selectedObject: string) {
    const points = filteredData[selectedObject!];

    const canvas = this.document.getElementById(
      'heatmap-container'
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const largura = canvas.width;
    const altura = canvas.height;
    const sigma = 8;

    ctx.clearRect(0, 0, largura, altura);

    const imgData = ctx.createImageData(largura, altura);
    const data = new Uint8ClampedArray(imgData.data.buffer);

    let maxDensity = 0;
    const densityMap = new Array(altura)
      .fill(0)
      .map(() => new Array(largura).fill(0));

    for (let y = 0; y < altura; y++) {
      for (let x = 0; x < largura; x++) {
        let densidade = 0;
        points.forEach((point) => {
          densidade += this.gaussian(x - point.x, y - point.y, sigma);
        });
        densityMap[y][x] = densidade;
        if (densidade > maxDensity) {
          maxDensity = densidade;
        }
      }
    }

    for (let y = 0; y < altura; y++) {
      for (let x = 0; x < largura; x++) {
        const densidade = densityMap[y][x];
        const normalizedDensity = densidade / maxDensity;
        const [r, g, b, a] = this.interpolateColor(normalizedDensity);
        const index = (y * largura + x) * 4;
        data[index] = r; // R
        data[index + 1] = g; // G
        data[index + 2] = b; // B
        data[index + 3] = a; // A
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }
}

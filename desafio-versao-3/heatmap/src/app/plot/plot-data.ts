import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { GroupedData } from '../interfaces/grouped-data';
import { DataItem } from '../interfaces/data-item';

@Injectable({
  providedIn: 'root',
})
export class PlotDataService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  plotData(filteredData: GroupedData, selectedObject: string) {
    const points = filteredData[selectedObject!];

    const canvas = this.document.getElementById(
      'heatmap-container'
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach((point: Pick<DataItem, "x" | "y">) => {
      ctx.fillStyle = 'blue';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    points.forEach((point: Pick<DataItem, "x" | "y">) => {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

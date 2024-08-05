import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class CalculateCentroideService {
  constructor() {}

  calculateCentroide(
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number
  ): { x: number; y: number } {
    const centroidX = (xMin + xMax) / 2;
    const centroidY = (yMin + yMax) / 2;
    return { x: centroidX, y: centroidY };
  }
}

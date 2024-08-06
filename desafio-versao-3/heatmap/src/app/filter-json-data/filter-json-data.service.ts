import { Injectable } from '@angular/core';
import { CalculateCentroideService } from '../centroide/centroide';
import { DeepstreamMsg } from '../interfaces/deep-stream-msg';
import { DataItem } from '../interfaces/data-item';
import { GroupedData } from '../interfaces/grouped-data';

@Injectable({
  providedIn: 'root',
})
export class FilterJsonDataService {
  foundObjects = new Set<string>();
  constructor(
    private readonly calculateCentroideService: CalculateCentroideService
  ) {}

  filterJson(data: DeepstreamMsg): DataItem[] {
    return data.hits.hits.flatMap((msg) => {
      return msg.fields['deepstream-msg'].map((deepstreamMsg: string) => {
        const [trackingId, xMin, yMin, xMax, yMax, deepstreamObject] =
          deepstreamMsg.split('|');
        this.foundObjects.add(deepstreamObject);

        return {
          ...this.calculateCentroideService.calculateCentroide(
            +xMin,
            +xMax,
            +yMin,
            +yMax
          ),
          object: deepstreamObject,
        };
      });
    });
  }

  reduceData(data: DataItem[]): GroupedData {
    return data.reduce((acc: GroupedData, item: DataItem) => {
      if (!acc[item.object]) {
        acc[item.object] = [];
      }
      acc[item.object].push({ x: item.x, y: item.y });
      return acc;
    }, {});
  }
}

import { Injectable } from '@angular/core';
import { CalculateCentroideService } from '../centroide/centroide';

interface DeepstreamMsg {
  hits: { hits: [{ fields: { 'deepstream-msg': string[] } }] };
}

@Injectable({
  providedIn: 'root',
})
export class FilterJsonDataService {
  foundObjects = new Set<string>();
  constructor(
    private readonly calculateCentroideService: CalculateCentroideService
  ) {}

  filterJson(data: DeepstreamMsg): { object: string; x: number; y: number; }[] {
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
}

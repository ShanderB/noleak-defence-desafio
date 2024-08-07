import { Component } from '@angular/core';
import { LoadJsonService } from './load-json/load-json.service';
import { HttpClientModule } from '@angular/common/http';
import { FilterJsonDataService } from './filter-json-data/filter-json-data.service';
import { CalculateCentroideService } from './centroide/centroide';
import { CommonModule } from '@angular/common';
import { GroupedData } from './interfaces/grouped-data';
import { DataItem } from './interfaces/data-item';
import { PlotDataService } from './plot/plot-data';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, CommonModule, MatProgressSpinnerModule],
  providers: [
    LoadJsonService,
    FilterJsonDataService,
    CalculateCentroideService,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  data: DataItem[] = [];
  filteredData: GroupedData = {};
  allObjects: string[] = [];
  selectedObject: string | null = null;
  isLoading: boolean = true;

  constructor(
    private readonly loadJsonService: LoadJsonService,
    private readonly filterJsonDataService: FilterJsonDataService,
    private readonly plotDataService: PlotDataService
  ) {}

  ngOnInit() {
    this.loadJsonService
      .fetchJson('assets/response.json')
      .subscribe((response) => {
        this.data = this.filterJsonDataService.filterJson(response);
        this.filteredData = this.filterJsonDataService.reduceData(this.data);
        this.allObjects = Object.keys(this.filteredData);

        if (this.allObjects.length > 0) {
          this.selectedObject = this.allObjects[0];
          this.plotDataService
            .plotData(this.filteredData, this.selectedObject)
            .subscribe(() => {
              this.isLoading = false;
            });
        }
      });
  }

  onObjectSelect(event: Event) {
    this.isLoading = true;

    const selectElement = event.target as HTMLSelectElement;
    this.selectedObject = selectElement.value;
    this.plotDataService
      .plotData(this.filteredData, this.selectedObject)
      .subscribe(() => {
        this.isLoading = false;
      });
  }
}

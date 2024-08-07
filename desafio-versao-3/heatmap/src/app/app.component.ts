import { Component } from '@angular/core';
import { LoadJsonService } from './load-json/load-json.service';
import { HttpClientModule } from '@angular/common/http';
import { FilterJsonDataService } from './filter-json-data/filter-json-data.service';
import { CalculateCentroideService } from './centroide/centroide';
import { CommonModule } from '@angular/common';
import { GroupedData } from './interfaces/grouped-data';
import { DataItem } from './interfaces/data-item';
import { PlotDataService } from './plot/plot-data';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
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
  selectedObject: string | null = 'person';
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

  onObjectSelect(event: MatSelectChange) {
    this.isLoading = true;

    this.selectedObject = event.value;
    this.plotDataService
      .plotData(this.filteredData, this.selectedObject!)
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  downloadCanvas() {
    const canvas = document.getElementById(
      'heatmap-container'
    ) as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const image = new Image();
    image.src = '../assets/image-overlay.png';

    image.onload = () => {
      const plotDataUrl = canvas.toDataURL();

      context!.drawImage(image, 0, 0, canvas.width, canvas.height);

      const plotImage = new Image();
      plotImage.src = plotDataUrl;

      plotImage.onload = () => {
        context!.drawImage(plotImage, 0, 0, canvas.width, canvas.height);

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'canvas-image.png';
        link.click();
      };
    };
  }
}

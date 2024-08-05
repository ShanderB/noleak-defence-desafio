import { Component } from '@angular/core';
import { LoadJsonService } from './load-json/load-json.service';
import { HttpClientModule } from '@angular/common/http';
import { FilterJsonDataService } from './filter-json-data/filter-json-data.service';
import { CalculateCentroideService } from './centroide/centroide';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  providers: [
    LoadJsonService,
    FilterJsonDataService,
    CalculateCentroideService,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  data: { object: string; x: number; y: number; }[] = [];

  constructor(
    private readonly loadJsonService: LoadJsonService,
    private readonly filterJsonDataService: FilterJsonDataService
  ) {}

  ngOnInit() {
    this.loadJsonService
      .fetchJson('assets/response.json')
      .subscribe((response) => {
        this.data = this.filterJsonDataService.filterJson(response);

        console.log(this.data);
      });
  }
}

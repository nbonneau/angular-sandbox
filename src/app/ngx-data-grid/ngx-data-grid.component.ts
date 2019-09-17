import { Component, OnInit, Input, TemplateRef, ContentChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ngx-data-grid',
  templateUrl: './ngx-data-grid.component.html',
  styleUrls: ['./ngx-data-grid.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NgxDataGridComponent implements OnInit {

  data: Array<any> = [];

  cellStyle: {[key: string]: string};

  @Input() dataSource: Array<any> = [];
  @Input() columns: Array<any> = [];
  @Input() rows: Array<any> = [];
  @Input() cellClass: string;
  @Input() rowClass: string;
  @Input() gridClass: string;

  @ContentChild('ngxDataGridColumnHeader') gridColumnHeaderTemplate: TemplateRef<any>;
  @ContentChild('ngxDataGridRowHeader') gridRowHeaderTemplate: TemplateRef<any>;
  @ContentChild('ngxDataGridCell') cellTemplate: TemplateRef<any>;
  @ContentChild('ngxDataGridCellEmpty') emptyTemplate: TemplateRef<any>;
  @ContentChild('ngxDataGridActions') actionsTemplate: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
    this._setup();
  }

  ngOnChanges() {
    this._setup();
  }

  private _setup() {

    this.cellStyle = {
      width: 100 / (this.columns.length + 1) + '%'
    };

    this.data = [];

    this.rows.forEach(row => {
      const r = [row];
      this.columns.forEach(col => {
        const index = this.dataSource.findIndex(t => t.x === col && t.y === row);
        if (index !== -1) {
          r.push(this.dataSource[index]);
        } else {
          r.push({
            x: col,
            y: row
          });
        }
      });
      this.data.push(r);
    });
  }

}

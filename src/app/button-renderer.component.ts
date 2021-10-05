// Author: T4professor

import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-renderer',
  template: `
  <button class="btn btn btn-outline-secondary mr-2" style="border: none;" (click)="onClick($event,'delete')" placement="right" ngbTooltip="Delete"><i class="fa fa-trash"></i></button>
  <button class="btn btn btn-outline-secondary mr-2" style="border: none;" (click)="onClick($event,'edit')" placement="right" ngbTooltip="Edit"><i class="fa fa-pencil"></i></button>
    `
})

export class ButtonRendererComponent implements ICellRendererAngularComp {

  params: any;
  label: any;

  agInit(params: any): void {
    this.params = params;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event: any,type: any) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      }
      this.params.onClick(this.params,type);

    }
  }
}
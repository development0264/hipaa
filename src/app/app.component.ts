import { Component, OnInit, ViewChild } from '@angular/core';
import { AttachmentRendererComponent } from './attachment-renderer.component';
import { ButtonRendererComponent } from './button-renderer.component';
import { NgbModal, ModalDismissReasons, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  frameworkComponents: any;
  api: any;
  columnDefs = [
    { headerName: 'Id', field: 'id', editable: true },
    { headerName: 'Status', field: 'make', editable: true },
    { headerName: 'Hipaa Signed', field: 'model', editable: true },
    { headerName: 'Hipaa Expires', field: 'price', editable: true },
    {
      headerName: 'Edit/Delete',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onEditButtonClick.bind(this),
      },
    },
    {
      headerName: 'Attach/save',
      cellRenderer: 'attachRenderer',
      cellRendererParams: {
        onClick: this.onEditButtonClick.bind(this),
      },
    }
  ];
  rowData: any = [];
  closeResult = '';
  sdate: any;
  edate: any;
  modalContent: any;
  deleteParams: any;
  id: any;
  // @ViewChild('agGrid') agGrid: AgGridAngular;
  // rowData: any[] = [];
  constructor(private modalService: NgbModal) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      attachRenderer: AttachmentRendererComponent
    }

    window.localStorage.setItem('data', JSON.stringify(this.rowData));
  }
  ngOnInit(): void {
    this.rowData = [
      {id: 1, make: 'Active', model: '06/04/2021', price: '06/04/2021' },
      {id: 2, make: 'Active', model: '06/04/2021', price: '06/04/2021' },
      {id: 3, make: 'Active', model: '06/04/2021', price: '06/04/2021' }
    ];
    // this.rowData = window.localStorage.getItem('data');
  }


  onRowEditingStopped(params: any) {
    debugger;
  }

  onEditButtonClick(params: any, type: any) {
    if (type === 'edit') {
      // document.getElementById('btn')?.click();
      // {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
      this.id = params.data.id;
      console.log(this.id)
      this.sdate = new NgbDate(parseInt(params.data.model.split('/')[2]),parseInt(params.data.model.split('/')[1]),parseInt(params.data.model.split('/')[0]));
      console.log(this.sdate)
      this.edate = new NgbDate(parseInt(params.data.price.split('/')[2]),parseInt(params.data.price.split('/')[1]),parseInt(params.data.price.split('/')[0]));

      document.getElementById('editbtn')?.click();
      // this.api.startEditingCell({
      //   rowIndex: params.rowIndex,
      //   colKey: 'make'
      // });
    } else if (type === 'delete') {
      this.deleteParams = params;
      document.getElementById('delbtn')?.click();
      // // this.showDeleteModel(params);
      // this.onDeleteButtonClick(params);
    } else if (type === 'attach') {
      var input = document.createElement('input');
      input.type = 'file';

      input.onchange = e => {
        var file = e?.target;
      }

      input.click();
    } else if(type === 'view'){
      document.getElementById('pdfbtn')?.click();
    }

  }

  onSaveButtonClick(params: any) {
    this.api.stopEditing();
  }

  onDeleteButtonClick(params: any) {
    this.api.updateRowData({ remove: [params.data] });
  }

  onGridReady(params: any) {
    this.api = params.api;
  }

  open(content: any) {
    console.log(content)
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  // @ViewChild('agGrid') agGrid: AgGridAngular;
  addToArray() {
    var id = this.rowData.length +1;
    this.api.updateRowData({
      add: [{
        id: id,
        make: 'Active',
        model: this.sdate.day + '/' + this.sdate.month + '/' + this.sdate.year,
        price: this.edate.day + '/' + this.edate.month + '/' + this.edate.year,
      }]
    })
    this.modalService.dismissAll()
  }
  edit(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  editToArray() {
    console.log(this.id)
    var rowNode = this.api.getRowNode(this.id-1);
    console.log(rowNode)
    rowNode.setDataValue('model', this.sdate.day + '/' + this.sdate.month + '/' + this.sdate.year);
    rowNode.setDataValue('price', this.edate.day + '/' + this.edate.month + '/' + this.edate.year);
    this.modalService.dismissAll()
  }

  del(content: any){
    // this.modalContent = params;
    console.log(this.modalContent)
    this.modalService.open(content ,{ ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  deleteToArray(){
    this.api.updateRowData({ remove: [this.deleteParams.data] });
    this.modalService.dismissAll()
  }
}

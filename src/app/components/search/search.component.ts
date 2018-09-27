import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'; // reactive forms
import { SearchService } from '../../services/search.service'; // service
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material'; // sort
import { Router } from '@angular/router'; // routing

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  // list of types for selection
  types = ['Brand', 'Product Name', 'Both'];

  // for showing details of film whem clicking on the film id
  showDetails = false;

  // for table
  displayedColumns: string[] = ['upc12', 'brand', 'name', 'edit'];
  displayedColumnsForDetails: string[] = ['upc12', 'brand', 'name'];
  groceries = (new MatTableDataSource([]));
  groceryDetails = (new MatTableDataSource([]));
  // sort
  @ViewChild(MatSort) sort: MatSort;
  // paginator
  length = 1000;
  pageSize = 20;
  pageSizeOptions: number[] = [5, 10, 20, 100];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  searchCriteria = {
    'brand': '',
    'name': ''
  };

  // reactive forms
  searchForm: FormGroup;
  createFormGroup() {
    return new FormGroup({
    type: new FormControl('', Validators.required),
    term: new FormControl('', Validators.required),
    });
  }

  constructor(private SearchSvc: SearchService,
              private route: Router) {
    this.searchForm = this.createFormGroup();
  }

  // validator checks called from html for reactive forms
  get type() { return this.searchForm.get('type'); }
  get term() { return this.searchForm.get('term'); }

  // reset button
  reset() {
    this.searchForm.reset();
  }

  // submit button
  onSubmit () {
    this.searchCriteria.brand = ''; // reset to default
    this.searchCriteria.name = ''; // reset to default
    this.showDetails = false; // reset to default
    console.log('Form data: ', this.searchForm.value);
    if (this.searchForm.value.type === 'Brand' ) {
    this.searchCriteria.brand = `%${this.searchForm.value.term}%`;
    }
    if (this.searchForm.value.type === 'Product Name' ) {
      this.searchCriteria.name = `%${this.searchForm.value.term}%`;
    }
    if (this.searchForm.value.type === 'Both' ) {
      this.searchCriteria.brand = `%${this.searchForm.value.term}%`;
      this.searchCriteria.name = `%${this.searchForm.value.term}%`;
    }
    console.log('Brand:', this.searchCriteria.brand, ', Product Name:', this.searchCriteria.name);
    this.SearchSvc.getGroceries(this.searchCriteria).subscribe((results) => {
      console.log('Suscribed Results; ', results);
      this.groceries = new MatTableDataSource(results);
      this.groceries.sort = this.sort;
      this.groceries.paginator = this.paginator;
    });
    this.searchForm.reset();
  }

  // go edit page
  goEditPage(upc12, brand, name) {
    this.SearchSvc.editDetails = {
      'upc12' : upc12,
      'brand' : brand,
      'name' : name
    };
    this.route.navigate(['/edit']);
  }

  // go add page
  goAddPage() {
    this.route.navigate(['/add']);
  }

  ngOnInit() {
    // init get all data
    this.SearchSvc.getGroceries(this.searchCriteria).subscribe((results) => {
      console.log('Suscribed Results; ', results);
      this.groceries = new MatTableDataSource(results);
      this.groceries.sort = this.sort;
      this.groceries.paginator = this.paginator;
    });
  }
}

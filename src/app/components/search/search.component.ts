import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'; // reactive forms
import { SearchService } from '../../services/search.service'; // service
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material'; // sort

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  // list of types for selection
  types = ['Title', 'Description', 'Both'];

  // for showing details of film whem clicking on the film id
  showDetails = false;

  // for table
  displayedColumns: string[] = ['title', 'description', 'url'];
  displayedColumnsForDetails: string[] = ['title', 'description', 'release'];
  films = (new MatTableDataSource([]));
  filmDetails = (new MatTableDataSource([]));
  // sort
  @ViewChild(MatSort) sort: MatSort;
  // paginator
  length = 1000;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  searchCriteria = {
    'title': '',
    'description': ''
  };

  // reactive forms
  searchForm: FormGroup;
  createFormGroup() {
    return new FormGroup({
    type: new FormControl('', Validators.required),
    term: new FormControl('', Validators.required),
    });
  }

  constructor(private SearchSvc: SearchService) {
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
    this.searchCriteria.title = ''; // reset to default
    this.searchCriteria.description = ''; // reset to default
    this.showDetails = false; // reset to default
    console.log('Form data: ', this.searchForm.value);
    if (this.searchForm.value.type === 'Title' ) {
    this.searchCriteria.title = `%${this.searchForm.value.term}%`;
    }
    if (this.searchForm.value.type === 'Description' ) {
      this.searchCriteria.description = `%${this.searchForm.value.term}%`;
    }
    if (this.searchForm.value.type === 'Both' ) {
      this.searchCriteria.title = `%${this.searchForm.value.term}%`;
      this.searchCriteria.description = `%${this.searchForm.value.term}%`;
    }
    console.log('Title:', this.searchCriteria.title, ', Description:', this.searchCriteria.description);
    this.SearchSvc.getFilms(this.searchCriteria).subscribe((results) => {
      console.log('Suscribed Results; ', results);
      this.films = new MatTableDataSource(results);
      this.films.sort = this.sort;
      this.films.paginator = this.paginator;
    });
    this.searchForm.reset();
  }

  // get film details when clicking on url
  getFilmDetails(url) {
    console.log('String to be passed in >>>>> ', url.substr(7));
    this.SearchSvc.getFilmDetails(url.substr(7)).subscribe((results) => {
      console.log('Suscribed Results; ', results);
      this.filmDetails = new MatTableDataSource(results);
    });
    this.showDetails = true;
  }

  ngOnInit() {
    // init get all data
    this.SearchSvc.getFilms(this.searchCriteria).subscribe((results) => {
      console.log('Suscribed Results; ', results);
      this.films = new MatTableDataSource(results);
      this.films.sort = this.sort;
      this.films.paginator = this.paginator;
    });
  }
}

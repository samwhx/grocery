import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service'; // service
import { FormGroup, FormControl, Validators } from '@angular/forms'; // reactive forms
import { Router } from '@angular/router'; // routing

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  // addFields
  addFields = {
    'brand': '',
    'name': '',
    'upc12': ''
  };

  // search criteria to get everything
  searchCriteria = {
    'brand': '',
    'name': ''
  };

  // array of all upc12
  upc12_array = [];

  // reactive forms
  addForm: FormGroup;
  createFormGroup() {
    return new FormGroup({
    brand: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    upc12: new FormControl('', Validators.required)
    });
  }

  constructor(private SearchSvc: SearchService,
    private route: Router) {
  this.addForm = this.createFormGroup();
  }

  // validator checks called from html for reactive forms
  get brand() { return this.addForm.get('brand'); }
  get name() { return this.addForm.get('name'); }
  get upc12() { return this.addForm.get('upc12'); }

  // submit button
  onSubmit () {
    console.log(this.addForm.value);
    this.addFields.brand = this.addForm.value.brand;
    this.addFields.name = this.addForm.value.name;
    this.addFields.upc12 = this.addForm.value.upc12;
    console.log('..............', this.upc12_array);
    if (this.upc12_array.find(x => x == this.addForm.value.upc12)) {
      alert('Invalid! UPC12 is not unique!');
      this.route.navigate(['/add']);
    } else {
      this.SearchSvc.addGroceryDetails(this.addFields).subscribe((results) => {
        console.log('Suscribed Results; ', results);
        alert('Record Added!');
        this.route.navigate(['/search']);
      });
    }
  }

  // back button
  goBack() {
    this.route.navigate(['/search']);
  }

  ngOnInit() {
    // init get upc12
    this.SearchSvc.getGroceries(this.searchCriteria).subscribe((results) => {
      console.log('Suscribed Results; ', results);
      results.forEach((result) => {
        this.upc12_array.push(result.upc12);
      });
      console.log('upc12_array; ', this.upc12_array);
    });
  }
}

// // custom validator
// function validupc12(input: FormControl) {
//   this.upc12_array.forEach((upc12) => {
//     if (input.value.upc12 === upc12) {
//       return true;
//     }
//   });
// return null;
// }

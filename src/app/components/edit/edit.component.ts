import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service'; // service
import { FormGroup, FormControl, Validators } from '@angular/forms'; // reactive forms
import { Router } from '@angular/router'; // routing

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  // editFields
  editFields = {
    'brand': '',
    'name': '',
    'upc12': '',
    'id': '',
  };

  // array of all upc12
  upc12_array = [];

  // reactive forms
  editForm: FormGroup;
  createFormGroup() {
    return new FormGroup({
    brand: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    upc12: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$') // regex for numbers only
      ])
    });
  }

  constructor(private SearchSvc: SearchService,
              private route: Router) {
    this.editForm = this.createFormGroup();
  }

  // validator checks called from html for reactive forms
  get brand() { return this.editForm.get('brand'); }
  get name() { return this.editForm.get('name'); }
  get upc12() { return this.editForm.get('upc12'); }

  // submit button
  onSubmit () {
    this.editFields.brand = this.editForm.value.brand;
    this.editFields.name = this.editForm.value.name;
    if (this.upc12_array.find(x => x == this.editForm.value.upc12 && x != this.editFields.upc12)) { // tslint:disable-line
      alert('Invalid! UPC12 is not unique!');
      this.route.navigate(['/edit']);
    } else {
      this.editFields.upc12 = this.editForm.value.upc12;
      this.SearchSvc.editGroceryDetails(this.editFields).subscribe((results) => {
        console.log('Suscribed Results; ', results);
        alert('Record Updated!');
        this.route.navigate(['/search']);
      });
    }
  }

  // back button
  goBack() {
    this.route.navigate(['/search']);
  }

  ngOnInit() {
    this.upc12_array = this.SearchSvc.upc12s;
    this.editForm.patchValue({
      // @ts-ignore
      brand: this.SearchSvc.editDetails.brand,
      // @ts-ignore
      name: this.SearchSvc.editDetails.name,
      // @ts-ignore
      upc12: this.SearchSvc.editDetails.upc12
   });
    // @ts-ignore
    this.editFields.upc12 = this.SearchSvc.editDetails.upc12; // for barcode image
    // @ts-ignore
    this.editFields.id = this.SearchSvc.editDetails.id; // for sql update purpose
  }

}

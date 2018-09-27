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
    'upc12': ''
  };

  // reactive forms
  editForm: FormGroup;
  createFormGroup() {
    return new FormGroup({
    brand: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    });
  }

  constructor(private SearchSvc: SearchService,
              private route: Router) {
    this.editForm = this.createFormGroup();
  }

  // validator checks called from html for reactive forms
  get brand() { return this.editForm.get('brand'); }
  get name() { return this.editForm.get('name'); }

  // submit button
  onSubmit () {
    this.editFields.brand = this.editForm.value.brand;
    this.editFields.name = this.editForm.value.name;
    this.editFields.upc12 = this.SearchSvc.editDetails.upc12;
    this.SearchSvc.editGroceryDetails(this.editFields).subscribe((results) => {
      console.log('Suscribed Results; ', results);
      alert('Record Updated!');
      this.route.navigate(['/search']);
    });
  }

  // back button
  goBack() {
    this.route.navigate(['/search']);
  }

  ngOnInit() {
    this.editForm.patchValue({
      brand: this.SearchSvc.editDetails.brand;
      name: this.SearchSvc.editDetails.name;
   });
  }

}

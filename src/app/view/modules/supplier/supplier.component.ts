import { Component } from '@angular/core';
import {RegexService} from "../../../service/regexservice";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Supplierservice} from "../../../service/supplierservice";
import {Suppliertypeservice} from "../../../service/suppliertypeservice";
import {Supcountryservice} from "../../../service/supcountryservice";
import {Supplierstatusservice} from "../../../service/supplierstatusservice";
import {Suppliertype} from "../../../entity/suppliertype";
import {Supplierstatus} from "../../../entity/supplierstatus";
import {Supcountry} from "../../../entity/supcountry";

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent {

  public form!: FormGroup;

  suppliertypes: Array<Suppliertype> = [];
  supplierstatuses: Array<Supplierstatus> = [];
  supcountries: Array<Supcountry> = [];

  regexes: any;

  uiassist: UiAssist;

  constructor(
    private sp: Supplierservice,
    private spt: Suppliertypeservice,
    private spc: Supcountryservice,
    private sps: Supplierstatusservice,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.form = this.fb.group({
      "name": new FormControl('', [Validators.required]),
      "regid": new FormControl('', [Validators.required]),
      "contactperson": new FormControl('', [Validators.required]),
      "photo": new FormControl('', [Validators.required]),
      "contactmobile": new FormControl('', [Validators.required]),
      "contactland": new FormControl('', ),
      "doregistered": new FormControl('', [Validators.required]),
      "address": new FormControl('', [Validators.required]),
      "email": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "suppliertype": new FormControl('', [Validators.required]),
      "supplierstatus": new FormControl('', [Validators.required]),
      "supcountry": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.spt.getAllList().then((spts: Suppliertype[]) => {
      this.suppliertypes = spts;
    });

    this.sps.getAllList().then((spss: Supplierstatus[]) => {
      this.supplierstatuses = spss;
    });

    this.spc.getAllList().then((spcs: Supcountry[]) => {
      this.supcountries = spcs;
    });

  }

    createForm() {
    this.form.controls['name'].setValidators([Validators.required, Validators.pattern(this.regexes['name']['regex'])]);
    this.form.controls['regid'].setValidators([Validators.required, Validators.pattern(this.regexes['regid']['regex'])]);
    this.form.controls['contactperson'].setValidators([Validators.required, Validators.pattern(this.regexes['contactperson']['regex'])]);
    this.form.controls['photo'].setValidators([Validators.required]);
    this.form.controls['contactmobile'].setValidators([Validators.required, Validators.pattern(this.regexes['contactmobile']['regex'])]);
    this.form.controls['contactland'].setValidators([Validators.pattern(this.regexes['contactland']['regex'])]);
    this.form.controls['doregistered'].setValidators([Validators.required]);
    this.form.controls['address'].setValidators([Validators.required, Validators.pattern(this.regexes['address']['regex'])]);
    this.form.controls['email'].setValidators([Validators.required,Validators.pattern(this.regexes['email']['regex'])]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['suppliertype'].setValidators([Validators.required]);
    this.form.controls['supplierstatus'].setValidators([Validators.required]);
    this.form.controls['supcountry'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    // this.enableButtons(true,false,false);

  }

}

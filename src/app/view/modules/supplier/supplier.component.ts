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
import {MatTableDataSource} from "@angular/material/table";
import {Supplier} from "../../../entity/supplier";
import {MatPaginator} from "@angular/material/paginator";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {Component, ViewChild } from "@angular/core";
import { from } from "rxjs";
import {MessageComponent} from "../../../util/dialog/message/message.component";

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent {

  columns: string[] = ['name','regid','contactperson','contactmobile','contactland','doregistered','address','email','description'];
  headers: string[] = ['Name','Registered ID','Contact Person','Contact Mobile','Contact Land','Date of registered','Address','Email','Description'];
  binders: string[] = ['name','regid','contactperson','contactmobile','contactland','doregistered','address','email','description'];

  public form!: FormGroup;
  public search!: FormGroup;

  supplier!: Supplier;
  oldSupplier!: Supplier;

  selectedrow: any;

  data!: MatTableDataSource<Supplier>;
  imageurl: string = '';
  imagesupurl: string = 'assets/default.png'

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  suppliers: Array<Supplier> = [];
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
      "photo": new FormControl(''),
      "contactmobile": new FormControl('', [Validators.required]),
      "contactland": new FormControl(''),
      "doregistered": new FormControl('', [Validators.required]),
      "address": new FormControl('', [Validators.required]),
      "email": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "suppliertype": new FormControl('', [Validators.required]),
      "supplierstatus": new FormControl('', [Validators.required]),
      "supcountry": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

    this.search = this.fb.group({
      "ssregid": new FormControl(),
      "ssname": new FormControl(),
      "sssuptype": new FormControl(),
      "sssupstatus": new FormControl(),
      "sssupcountry": new FormControl()
    });

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

    this.rs.get('supplier').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });

      this.createView();

  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {
  this.form.controls['name'].setValidators([Validators.required, Validators.pattern(this.regexes['name']['regex'])]);
  this.form.controls['regid'].setValidators([Validators.required, Validators.pattern(this.regexes['regid']['regex'])]);
  this.form.controls['contactperson'].setValidators([Validators.required, Validators.pattern(this.regexes['contactperson']['regex'])]);
  this.form.controls['photo'].setValidators([Validators.required]);
  this.form.controls['contactmobile'].setValidators([Validators.required, Validators.pattern(this.regexes['contactmobile']['regex'])]);
  this.form.controls['contactland'].setValidators([Validators.pattern(this.regexes['contactland']['regex'])]);
  this.form.controls['doregistered'].setValidators([Validators.required]);
  this.form.controls['address'].setValidators([Validators.required]);
  this.form.controls['email'].setValidators([Validators.required,Validators.pattern(this.regexes['email']['regex'])]);
  this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
  this.form.controls['suppliertype'].setValidators([Validators.required]);
  this.form.controls['supplierstatus'].setValidators([Validators.required]);
  this.form.controls['supcountry'].setValidators([Validators.required]);

  Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
            // @ts-ignore
            if (controlName == "doregistered")
              value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

            if (this.oldSupplier != undefined && control.valid) {
              // @ts-ignore
              if (value === this.supplier[controlName]) {
                control.markAsPristine();
              } else {
                control.markAsDirty();
              }
            } else {
              control.markAsPristine();
            }
          }
      );

    }

  // this.enableButtons(true,false,false);

  }

  selectImage(e: any): void {
    if (e.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.imagesupurl = event.target.result;
        this.form.controls['photo'].clearValidators();
      }
    }
  }

  clearImage(): void {
    this.imagesupurl = 'assets/default.png';
    this.form.controls['photo'].setErrors({'required': true});
  }


  add(){

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Supplier Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.supplier = this.form.getRawValue();

      this.supplier.photo = btoa(this.imagesupurl);

      let supdata: string = "";

      supdata = supdata + "<br>Name is : " + this.supplier.name;
      supdata = supdata + "<br>Registered ID is : " + this.supplier.regid;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Supplier Add",
          message: "Are you sure to Add the following Supplier? <br> <br>" + supdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.sp.add(this.supplier).then((responce: [] | undefined) => {

            if (responce != undefined) { // @ts-ignore
              console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              console.log("Add Sta-" + addstatus);
              if (!addstatus) { // @ts-ignore
                addmessage = responce['errors'];
              }
            } else {
              console.log("undefined");
              addstatus = false;
              addmessage = "Content Not Found"
            }
          }).finally(() => {

            if (addstatus) {
              addmessage = "Successfully Saved";
              this.form.reset();
              this.clearImage();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Supplier Add", message: addmessage}
            });

            stsmsg.afterClosed().subscribe(async result => {
              if (!result) {
                return;
              }
            });
          });
        }
      });
    }

  }

  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) {

        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }

    return errors;

  }

  update(){

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Supplier Update ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Supplier Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });

        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.supplier = this.form.getRawValue();
            if (this.form.controls['photo'].dirty) this.supplier.photo = btoa(this.imagesupurl);
            else this.supplier.photo = this.oldSupplier.photo;
            this.supplier.id = this.oldSupplier.id;

            this.sp.update(this.supplier).then((responce: [] | undefined) => {

              if (responce != undefined) { // @ts-ignore
                // @ts-ignore
                updstatus = responce['errors'] == "";
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                updstatus = false;
                updmessage = "Content Not Found"
              }
            } ).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.form.reset();
                this.clearImage();
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Supplier Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Supplier Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }

  }

  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;

  }

  delete(){

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Supplier Delete",
        message: "Are you sure to Delete following Supplier? <br> <br>" + this.supplier.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.sp.delete(this.supplier.id).then((responce: [] | undefined) => {

          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        } ).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.form.reset();
            this.clearImage();
            Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Supplier Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });

  }

  clear(){

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Supplier Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset()
      }
    });
  }

  fillForm(supplier: Supplier) {

    // this.enableButtons(false,true,true);

    this.selectedrow=supplier;

    this.supplier = JSON.parse(JSON.stringify(supplier));
    this.oldSupplier = JSON.parse(JSON.stringify(supplier));

    if (this.supplier.photo != null) {
      this.imagesupurl = atob(this.supplier.photo);
      this.form.controls['photo'].clearValidators();
    } else {
      this.clearImage();
    }
    this.supplier.photo = "";

    //@ts-ignore
    this.supplier.supcountry = this.supcountries.find(s => s.id === this.supplier.supcountry.id);
    //@ts-ignore
    this.supplier.supplierstatus = this.supplierstatuses.find(s => s.id === this.supplier.supplierstatus.id);
    //@ts-ignore
    this.supplier.suppliertype = this.suppliertypes.find(t => t.id === this.supplier.suppliertype.id);

    this.form.patchValue(this.supplier);
    this.form.markAsPristine();

  }

  loadTable(query: string) {

    this.sp.getAll(query)
      .then((sups: Supplier[]) => {
        this.suppliers = sups;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.suppliers);
        this.data.paginator = this.paginator;
      });

  }

  btnSearchMc(): void {

    const ssearchdata = this.search.getRawValue();

    let regid = ssearchdata.ssregid;
    let name = ssearchdata.ssname;
    let suppliertypeid = ssearchdata.sssuptype;
    let supplierstatusid = ssearchdata.sssupstatus;
    let supcountryid = ssearchdata.sssupcountry;

    let query = "";

    if (regid != null && regid.trim() != "") query = query + "&regid=" + regid;
    if (name != null && name.trim() != "") query = query + "&name=" + name;
    if (suppliertypeid != null) query = query + "&suppliertypeid=" + suppliertypeid;
    if (supplierstatusid != null) query = query + "&supplierstatusid=" + supplierstatusid;
    if (supcountryid != null) query = query + "&supcountryid=" + supcountryid;

    if (query != "") query = query.replace(/^./, "?")

    this.loadTable(query);

  }


  btnSearchClearMc(): void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.search.reset();
        this.loadTable("");
      }
    });

  }

}

import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Customer} from "../../../entity/customer";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Customerstatus} from "../../../entity/customerstatus";
import {Customertype} from "../../../entity/customertype";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Customerservice} from "../../../service/customerservice";
import {Customerstatusservice} from "../../../service/customerstatusservice";
import {Customertypeservice} from "../../../service/customertypeservice";
import {RegexService} from "../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {

  columns: string[] = ['cusid', 'name' || 'contactperson', 'companyname', 'contactmobile', 'contactland', 'email', 'address'];
  headers: string[] = ['Customer ID', 'Customer Name / Contact Person', 'Company Name', 'Mobile Number', 'Land-Phone Number', 'Email', 'Address'];
  binders: string[] = ['cusid', 'name' || 'contactperson', 'companyname', 'contactmobile', 'contactland', 'email', 'address'];

  public search!: FormGroup;
  public form!: FormGroup;

  customer!: Customer;
  oldcustomer!: Customer;

  selectedrow: any;

  data!: MatTableDataSource<Customer>;
  imageurl: string = "";
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  customers: Array<Customer> = [];
  customerstatuses: Array<Customerstatus> = [];
  customertypes: Array<Customertype> = [];

  regexes: any;

  uiassist: UiAssist;

  constructor(
    private cs: Customerservice,
    private css: Customerstatusservice,
    private cts: Customertypeservice,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.search = this.fb.group({
      "scusid": new FormControl(),
      "sname": new FormControl(),
      "scustomertype": new FormControl(),
      "scustomerstatus": new FormControl(),
      "scompanyname": new FormControl()
    });

    this.form = this.fb.group({
      "cusid": new FormControl('', [Validators.required]),
      "name": new FormControl(''),
      "companyname": new FormControl(''),
      "contactperson": new FormControl(''),
      "email": new FormControl('', [Validators.required]),
      "contactmobile": new FormControl('', [Validators.required]),
      "contactland": new FormControl(''),
      "address": new FormControl('', [Validators.required]),
      "orderhistory": new FormControl(''),
      "customertype": new FormControl('', [Validators.required]),
      "customerstatus": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.css.getAllList().then((csts: Customerstatus[]) => {
      this.customerstatuses = csts;
    });

    this.cts.getAllList().then((ctss: Customertype[]) => {
      this.customertypes = ctss;
    });

    this.rs.get('customer').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });

    this.createView();

    this.form.get('customertype')?.valueChanges.subscribe(value => {
      // console.log('Customer Type Selected:', value);
      this.toggleFields(value);
    });

  }

  toggleFields(type: string): void {
    const nameControl = this.form.get('name');
    const companynameControl = this.form.get('companyname');
    const contactpersonControl = this.form.get('contactperson');

    if (type === 'Retail Customer') {
      // Set validators for name field, clear for others
      nameControl?.setValidators([Validators.required]);
      companynameControl?.clearValidators();
      contactpersonControl?.clearValidators();
      nameControl?.updateValueAndValidity();
      companynameControl?.updateValueAndValidity();
      contactpersonControl?.updateValueAndValidity();
    } else if (type === 'Wholesale Customer' || type === 'Custom Orders') {
      // Clear validators for name field, set for others
      nameControl?.clearValidators();
      companynameControl?.setValidators([Validators.required]);
      contactpersonControl?.setValidators([Validators.required]);
      nameControl?.updateValueAndValidity();
      companynameControl?.updateValueAndValidity();
      contactpersonControl?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value;

      // Conditionally remove fields based on customer type
      if (formData.customertype.type === 'Retail Customer') {
        delete formData.companyname;
        delete formData.contactperson;
      } else if (formData.customertype.type === 'Wholesale Customer' || formData.customertype.type === 'Custom Orders') {
        delete formData.name;
      }

      // Process the form data (e.g., send it to the server)
      console.log(formData);
    }
  }

  isRetail() {
    return this.form.get('customertype')?.value?.type === 'Retail Customer';
  }

  isWholesaleOrCustomOrder(): boolean {
    const selectedType = this.form.get('customertype')?.value?.type;
    return selectedType === 'Wholesale Customer' || selectedType === 'Custom Orders';
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {
    this.form.controls['cusid'].setValidators([Validators.required, Validators.pattern(this.regexes['cusid']['regex'])]);
    this.form.controls['name'].clearValidators();
    this.form.controls['companyname'].setValidators([Validators.required, Validators.pattern(this.regexes['name']['regex'])]);
    this.form.controls['contactperson'].setValidators([Validators.required, Validators.pattern(this.regexes['name']['regex'])]);
    this.form.controls['address'].setValidators([Validators.required, Validators.pattern(this.regexes['address']['regex'])]);
    this.form.controls['contactmobile'].setValidators([Validators.required, Validators.pattern(this.regexes['contactmobile']['regex'])]);
    this.form.controls['contactland'].setValidators([Validators.pattern(this.regexes['contactland']['regex'])]);
    this.form.controls['email'].setValidators([Validators.required,Validators.pattern(this.regexes['email']['regex'])]);
    this.form.controls['customertype'].setValidators([Validators.required]);
    this.form.controls['customerstatus'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {

        if (this.oldcustomer != undefined && control.valid) {
          // @ts-ignore
          if (value === this.customer[controlName]) {
            control.markAsPristine();
          } else {
            control.markAsDirty();
          }
        } else {
          control.markAsPristine();
        }

      });

    }

  }

  loadTable(query: string) {

    this.cs.getAll(query)
      .then((cums: Customer[]) => {
        this.customers = cums;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.customers);
        this.data.paginator = this.paginator;
      });

  }

  btnSearchMc(): void {

    const searchdata = this.search.getRawValue();

    let cusid = searchdata.scusid;
    let name = searchdata.sname;
    let companyname = searchdata.scompanyname;
    let customertypeid = searchdata.scustomertype;
    let customerstatusid = searchdata.scustomerstatus;

    let query = "";

    if (cusid != null && cusid.trim() != "") query = query + "&cusid=" + cusid;
    if (name != null && name.trim() != "") query = query + "&name=" + name;
    if (companyname != null && companyname.trim() != "") query = query + "&companyname=" + companyname;
    if (customertypeid != null) query = query + "&customertypeid=" + customertypeid;
    if (customerstatusid != null) query = query + "&customerstatusid=" + customerstatusid;

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

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Customer Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.customer = this.form.getRawValue();

      let cusdata: string = "";

      cusdata = cusdata + "<br>Customer ID is : " + this.customer.cusid;
      cusdata = cusdata + "<br>Name of the Customer is : " + this.customer.name;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Customer Add",
          message: "Are you sure to Add the following Customer? <br> <br>" + cusdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          console.log("CustomerService.add(cus)");

          this.cs.add(this.customer).then((responce: [] | undefined) => {
            console.log("Res-" + responce);
            console.log("Un-" + responce == undefined);
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
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status - Customer Add", message: addmessage}
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

  fillForm(customer: Customer) {

    // this.enableButtons(false,true,true);

    this.selectedrow=customer;

    this.customer = JSON.parse(JSON.stringify(customer));
    this.oldcustomer = JSON.parse(JSON.stringify(customer));

    //@ts-ignore
    this.customer.customerstatus = this.customerstatuses.find(s => s.id === this.customer.customerstatus.id);
    //@ts-ignore
    this.customer.customertype = this.customertypes.find(s => s.id === this.customer.customertype.id);

    this.form.patchValue(this.customer);
    this.form.markAsPristine();

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

  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Customer Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Customer Update",
            message: "Are you sure to Save folowing updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("CustomerService.update()");
            this.customer = this.form.getRawValue();

            this.customer.id = this.oldcustomer.id;

            this.cs.update(this.customer).then((responce: [] | undefined) => {
              //console.log("Res-" + responce);
              // console.log("Un-" + responce == undefined);
              if (responce != undefined) { // @ts-ignore
                //console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
                // @ts-ignore
                updstatus = responce['errors'] == "";
                //console.log("Upd Sta-" + updstatus);
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                //console.log("undefined");
                updstatus = false;
                updmessage = "Content Not Found"
              }
            } ).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.form.reset();
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Customer Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Customer Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }

    }

  }

  delete() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Customer Delete",
        message: "Are you sure to Delete following customer? <br> <br>" + this.customer.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.cs.delete(this.customer.id).then((responce: [] | undefined) => {

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
            Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Customer Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });

      }

    });

  }

  clear():void{
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Customer Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset()
      }
    });

  }

}

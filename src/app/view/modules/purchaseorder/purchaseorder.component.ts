import {Component, ViewChild} from '@angular/core';
import {Postatus} from "../../../entity/postatus";
import {Material} from "../../../entity/material";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {Purchaseorder} from "../../../entity/purchaseorder";
import {MatTableDataSource} from "@angular/material/table";
import {Supplier} from "../../../entity/supplier";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Purchaseorderservice} from "../../../service/purchaseorderservice";
import {Supplierservice} from "../../../service/supplierservice";
import {Postatusservice} from "../../../service/postatusservice";
import {Materialservice} from "../../../service/materialservice";
import {RegexService} from "../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Employee} from "../../../entity/employee";
import {EmployeeService} from "../../../service/employeeservice";
import {Pomaterial} from "../../../entity/pomaterial";
import {Pomaterialservice} from "../../../service/pomaterialservice";

@Component({
  selector: 'app-purchaseorder',
  templateUrl: './purchaseorder.component.html',
  styleUrls: ['./purchaseorder.component.css']
})
export class PurchaseorderComponent {

  columns: string[] = ['poid','doorder','employee','supplier','description'];
  headers: string[] = ['Purchase Order ID','Date of Order','Created By','Supplier','Description'];
  binders: string[] = ['poid','doorder','employee.callingname','supplier.name','description'];

  public form!: FormGroup;
  public search!: FormGroup;

  purchaseorder!: Purchaseorder;
  oldpurchaseorder!: Purchaseorder;
  pomaterial!: Pomaterial;
  oldpomaterial!: Pomaterial;

  selectedrow: any;

  data!: MatTableDataSource<Purchaseorder>;
  imageurl: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  purchaseorders: Array<Purchaseorder> = [];
  suppliers: Array<Supplier> = [];
  employees: Array<Employee> = [];
  postatuses: Array<Postatus> = [];
  materials: Array<Material> = [];
  pomaterials: Array<Pomaterial> = [];

  regexes: any;

  uiassist: UiAssist;

  constructor(
    private pos: Purchaseorderservice,
    private sup: Supplierservice,
    private pom: Pomaterialservice,
    private emp: EmployeeService,
    private post: Postatusservice,
    private mat: Materialservice,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.form = this.fb.group({
      "poid": new FormControl('', [Validators.required]),
      "doorder": new FormControl('', [Validators.required]),
      // "createdby": new FormControl('', [Validators.required]),
      "description": new FormControl(''),
      "postatus": new FormControl('', [Validators.required]),
      "material": new FormControl(''),
      "employee": new FormControl(''),
      "supplier": new FormControl(''),
      "quantity": new FormControl(''),
      "unitprice": new FormControl(''),
      "totprice": new FormControl(''),
    }, {updateOn: 'change'});

    this.search = this.fb.group({
      "sspoid": new FormControl(),
      "sspostatus": new FormControl(),
    });

  }

  ngOnInit() {
    this.initialize();
  }

  initialize(){

    this.post.getAllList().then((posts: Postatus[]) => {
      this.postatuses = posts;
    });

    this.sup.getAllListNameId().then((sups: Supplier[]) => {
      this.suppliers = sups;
    });

    this.mat.getAllListNameId().then((mats: Material[]) => {
      this.materials = mats;
    });

    this.emp.getAllListNameId().then((emps: Employee[]) => {
      this.employees = emps;
    });

    this.rs.get('purchaseorder').then((regs: []) => {
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
    this.form.controls['poid'].setValidators([Validators.required]);
    this.form.controls['doorder'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required]);
    this.form.controls['postatus'].setValidators([Validators.required]);
    this.form.controls['supplier'].setValidators([Validators.required]);
    this.form.controls['material'].setValidators([Validators.required]);
    this.form.controls['quantity'].setValidators([Validators.required]);
    this.form.controls['unitprice'].setValidators([Validators.required]);
    this.form.controls['totprice'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "doorder")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldpurchaseorder != undefined && control.valid) {
            // @ts-ignore
            if (value === this.purchaseorder[controlName]) {
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
  }

  add(){

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Add Purchase Order ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.purchaseorder = this.form.getRawValue();

      let podata: string = "";

      podata = podata + "<br>Purchase Order Number is : " + this.purchaseorder.poid;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Add Purchase Order",
          message: "Are you sure to Add the following Purchase Order? <br> <br>" + podata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.pos.add(this.purchaseorder).then((responce: [] | undefined) => {

            if (responce != undefined) { // @ts-ignore
              // console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              // console.log("Add Sta-" + addstatus);
              if (!addstatus) { // @ts-ignore
                addmessage = responce['errors'];
              }
            } else {
              // console.log("undefined");
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
              data: {heading: "Status - Purchase Order Add", message: addmessage}
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
        data: {heading: "Errors - Purchase Order  Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Purchase Order Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });

        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.purchaseorder = this.form.getRawValue();

            this.purchaseorder.id = this.oldpurchaseorder.id;

            this.pos.update(this.purchaseorder).then((responce: [] | undefined) => {

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
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Purchase Order Add", message: updmessage}
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

  delete() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Purchase Order Delete",
        message: "Are you sure to Delete following Purchase Order? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.pos.delete(this.purchaseorder.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - Purchase Order Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });

  }

  clear() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Purchase Order Clear",
        message: "Are you sure to clear following details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset()
      }
    });

  }

  fillForm(purchaseorder: Purchaseorder, option?: string) {

    // this.enableButtons(false,true,true);

    this.selectedrow=purchaseorder;

    this.purchaseorder = JSON.parse(JSON.stringify(purchaseorder));
    // this.pomaterial = JSON.parse(JSON.stringify(pomaterial));
    this.oldpurchaseorder = JSON.parse(JSON.stringify(purchaseorder));
    // this.oldpomaterial = JSON.parse(JSON.stringify(pomaterial));
    switch (option) {
      case 'loadMaterials':
        // Implement logic to fetch and handle Pomaterials based on purchase order ID
        this.pom.getPomaterialsByPurchaseOrderId(purchaseorder.id).then((data) => {
          this.pomaterials = data;
        });
        break;
      case 'otherOption':
        // Handle any other options if needed
        console.log('Other option selected');
        break;
    }
   /*
   *  if (option === 'loadMaterials') {
      // Implement logic to fetch and handle Pomaterials based on purchase order ID
      this.pom.getPomaterialsByPurchaseOrderId(purchaseorder.id).then((data) => {
        this.pomaterials = data;
      });
    } else if (option === 'otherOption') {
      // Handle any other options if needed
      console.log('Other option selected');
    }
   * */

    // this.purchaseorders.
    //@ts-ignore
    this.purchaseorder.postatus = this.postatuses.find(s => s.id === this.purchaseorder.postatus.id);
    //@ts-ignore
    this.purchaseorder.supplier = this.suppliers.find(t => t.id === this.purchaseorder.supplier.id);
    // @ts-ignore
    this.purchaseorder.employee = this.employees.find(e => e.id === this.purchaseorder.employee.id);

    this.form.patchValue(this.purchaseorder);
    this.form.markAsPristine();

  }

  loadTable(query: string) {

    this.pos.getAll(query)
      .then((poss: Purchaseorder[]) => {
        this.purchaseorders = poss;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.purchaseorders);
        this.data.paginator = this.paginator;
      });

  }

  btnSearchMc(): void {

    const ssearchdata = this.search.getRawValue();

    let postatusid = ssearchdata.sspostatus;
    let poid = ssearchdata.sspoid;

    let query = "";

    if (poid != null && poid.trim() != "") query = query + "&poid=" + poid;
    if (postatusid != null) query = query + "&postatusid=" + postatusid;

    if (query != "") query = query.replace(/^./, "?")

    this.loadTable(query);

  }

  btnSearchClearMc(): void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to clear the search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.search.reset();
        this.loadTable("");
      }
    });

  }
}

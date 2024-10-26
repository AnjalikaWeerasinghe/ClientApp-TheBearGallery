import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Product} from "../../../entity/product";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Productstatus} from "../../../entity/productstatus";
import {Productcategory} from "../../../entity/productcategory";
import {Productservice} from "../../../service/productservice";
import {Productstatusservice} from "../../../service/productstatusservice";
import {Productcategoryservice} from "../../../service/productcategoryservice";
import {RegexService} from "../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {Employee} from "../../../entity/employee";
import {EmployeeService} from "../../../service/employeeservice";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  columns: string[] = ['productcode', 'name', 'productcost', 'quantity', 'rop', 'description'];
  headers: string[] = ['Product Code', 'Name','Price (LKR)', 'Quantity', 'ROP', 'Description'];
  binders: string[] = ['productcode', 'name', 'productcost', 'quantity', 'rop', 'description'];

  public form!: FormGroup;
  public search!: FormGroup;

  product!: Product;
  oldproduct!: Product;

  selectedrow: any;

  data!: MatTableDataSource<Product>;
  imageurl: string = '';
  imageprourl: string = 'assets/default.png'

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  products: Array<Product> = [];
  productstatuses: Array<Productstatus> = [];
  productcategories: Array<Productcategory> = [];
  employees: Array<Employee> = [];

  regexes: any;

  uiassist: UiAssist;

  constructor(
    private ps: Productservice,
    private psts: Productstatusservice,
    private pcs: Productcategoryservice,
    private em: EmployeeService,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.form = this.fb.group({
      "name": new FormControl('', [Validators.required]),
      "productcode": new FormControl('', [Validators.required]),
      "photo": new FormControl(''),
      "productcost": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "quantity": new FormControl('', [Validators.required]),
      "rop": new FormControl('', [Validators.required]),
      "productstatus": new FormControl('', [Validators.required]),
      "productcategory": new FormControl('', [Validators.required]),
      "employee": new FormControl('')
    }, {updateOn: 'change'});

    this.search = this.fb.group({
      "productcode": new FormControl(),
      "name": new FormControl(),
      "productstatus": new FormControl(),
      "productcategory": new FormControl(),
    });
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.pcs.getAllList().then((pcss: Productcategory[]) => {
      this.productcategories = pcss;
    });

    this.psts.getAllList().then((pstss: Productstatus[]) => {
      this.productstatuses = pstss;
    });

    this.em.getAllListNameId().then((ems: Employee[]) => {
      this.employees = ems;
    })

    this.rs.get('product').then((regs: []) => {
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
    this.form.controls['productcode'].setValidators([Validators.required, Validators.pattern(this.regexes['productcode']['regex'])]);
    this.form.controls['photo'].setValidators([Validators.required]);
    this.form.controls['productprice'].setValidators([Validators.required]);
    this.form.controls['quantity'].setValidators([Validators.required]);
    this.form.controls['rop'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required]);
    this.form.controls['productstatus'].setValidators([Validators.required]);
    this.form.controls['productcategory'].setValidators([Validators.required]);
    this.form.controls['employee'].clearValidators();

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {

            if (this.oldproduct != undefined && control.valid) {
              // @ts-ignore
              if (value === this.product[controlName]) {
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

  selectImage(e: any): void {
    if (e.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.imageprourl = event.target.result;
        this.form.controls['photo'].clearValidators();
      }
    }
  }

  clearImage(): void {
    this.imageprourl = 'assets/default.png';
    this.form.controls['photo'].setErrors({'required': true});
  }

  add(){

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Product Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.product = this.form.getRawValue();

      //console.log("Photo-Before"+this.employee.photo);
      this.product.photo = btoa(this.imageprourl);
      //console.log("Photo-After"+this.employee.photo);

      let prddata: string = "";

      prddata = prddata + "<br>Product name is : " + this.product.name;
      prddata = prddata + "<br>Product code is : " + this.product.productcode;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Product Add",
          message: "Are you sure to Add the following Product? <br> <br>" + prddata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          console.log("EmployeeService.add(emp)");

          this.ps.add(this.product).then((response: [] | undefined) => {
            //console.log("Res-" + response);
            //console.log("Un-" + response == undefined);
            if (response != undefined) { // @ts-ignore
              console.log("Add-" + response['id'] + "-" + response['url'] + "-" + (response['errors'] == ""));
              // @ts-ignore
              addstatus = response['errors'] == "";
              console.log("Add Sta-" + addstatus);
              if (!addstatus) { // @ts-ignore
                addmessage = response['errors'];
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
              data: {heading: "Status -Product Add", message: addmessage}
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

  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Product Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Product Update",
            message: "Are you sure to save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            console.log("ProductService.update()");
            this.product = this.form.getRawValue();
            if (this.form.controls['photo'].dirty) this.product.photo = btoa(this.imageprourl);
            else this.product.photo = this.oldproduct.photo;
            this.product.id = this.oldproduct.id;

            this.ps.update(this.product).then((responce: [] | undefined) => {
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
                this.clearImage();
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status - Product is Updated.", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Product Update", message: "Nothing Changed"}
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
        heading: "Confirmation - Product Delete",
        message: "Are you sure to Delete following Product? <br> <br>" + this.product.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.ps.delete(this.product.id).then((response: [] | undefined) => {

          if (response != undefined) { // @ts-ignore
            delstatus = response['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = response['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        }).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.form.reset();
            this.clearImage();
            Object.values(this.form.controls).forEach(control => {
              control.markAsTouched();
            });
            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Product Delete ", message: delmessage}
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

  clear() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Product Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset()
      }
    });

  }

  loadTable(query: string) {

    this.ps.getAll(query)
      .then((prs: Product[]) => {
        this.products = prs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.products);
        this.data.paginator = this.paginator;
      });

  }

  fillForm(product: Product) {

    this.selectedrow=product;

    this.product = JSON.parse(JSON.stringify(product));
    this.oldproduct = JSON.parse(JSON.stringify(product));

    if (this.product.photo != null) {
      this.imageprourl = atob(this.product.photo);
      this.form.controls['photo'].clearValidators();
    } else {
      this.clearImage();
    }
    this.product.photo = "";

    //@ts-ignore
    this.product.productstatus = this.productstatuses.find(s => s.id === this.product.productstatus.id);
    //@ts-ignore
    this.product.productcategory = this.productcategories.find(s => s.id === this.product.productcategory.id);

    this.form.patchValue(this.product);
    this.form.markAsPristine();

  }

  btnSearchMc() {

    const searchdata = this.search.getRawValue();

    let productcode = searchdata.productcode;
    let name = searchdata.name;
    let productstatusid = searchdata.productstatus;
    let productcategoryid = searchdata.productcategory;

    let query = "";

    if (productcode != null && productcode.trim() != "") query = query + "&produtcode=" + productcode;
    if (name != null && name.trim() != "") query = query + "&name=" + name;
    if (productstatusid != null) query = query + "&productstatusid=" + productstatusid;
    if (productcategoryid != null) query = query + "&productcategoryid=" + productcategoryid;

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

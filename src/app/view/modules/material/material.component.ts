import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Material} from "../../../entity/material";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Materialservice} from "../../../service/materialservice";
import {Materialstatus} from "../../../entity/materialstatus";
import {Category} from "../../../entity/category";
import {Categoryservice} from "../../../service/categoryservice";
import {Materialstatusservice} from "../../../service/materialstatusservice";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {Subcategoryservice} from "../../../service/subcategoryservice";
import {Brandservice} from "../../../service/brandservice";
import {Subcategory} from "../../../entity/subcategory";
import {Brand} from "../../../entity/brand";
import {RegexService} from "../../../service/regexservice";
import {DatePipe} from "@angular/common";
import {Materialtype} from "../../../entity/materialtype";
import {Materialtypeservice} from "../../../service/materialtypeservice";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {from, last} from "rxjs";

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent {

  columns: string[] = ['id','name','itemcode','photo','quantity','purchasedate','unitprice','rop','description','modi'];
  headers: string[] = ['ID','Name','Item Code','Photo','Quantity','Purchase Date','Unit Price ($)','ROP','Description','Modification'];
  binders: string[] = ['id','name','itemcode','photo','quantity','purchasedate','unitprice','rop','description','getModi()'];

  cscolumns: string[] = ['csid','csname','csitemcode','csphoto','csquantity','cspdate','csunitprice','csrop','csdescription','csmodi'];
  csprompts: string[] = ['Search by ID','Search by Name','Search by Item Code','Search by Photo','Search by Quantity',
    'Search  by Purchase Date', 'Search by Unit Price', 'Search by ROP','Search by Description','Search by Modification'];

  material!:Material;
  oldMaterial!:Material;

  public cssearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  materials: Array<Material> = [];
  data!: MatTableDataSource<Material>;
  imageurl: string = '';
  imagematurl:string = 'assets/material.jpeg';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  materialstatuses:Array<Materialstatus> = [];
  categories:Array<Category> = [];
  subcategories:Array<Subcategory> = [];
  brands:Array<Brand> = [];
  materialtypes:Array<Materialtype> = [];

  uiassist: UiAssist;

  regexes!:any;
  col!:{[p:string]:any};
  lastitemcode!:string;
  selectedrow:any;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  constructor(
    private fb:FormBuilder,
    private ms:Materialservice,
    private mst:Materialstatusservice,
    private cs:Categoryservice,
    private scs:Subcategoryservice,
    private bns:Brandservice,
    private rgs:RegexService,
    private mts:Materialtypeservice,
    private dg:MatDialog,
    private dp:DatePipe
  )
  {
    this.uiassist = new UiAssist(this);

    this.cssearch = this.fb.group({
      'csid':new FormControl(),
      'csname':new FormControl(),
      'csitemcode':new FormControl(),
      'csphoto':new FormControl(),
      'csquantity':new FormControl(),
      'cspdate':new FormControl(),
      'csunitprice':new FormControl(),
      'csrop':new FormControl(),
      'csdescription':new FormControl(),
      'csmodi':new FormControl(),
    });

    this.ssearch = this.fb.group({
      "ssname":new FormControl(),
      "ssitemcode":new FormControl(),
      "ssmaterialstatus":new FormControl(),
      "sscategory":new FormControl(),
    });

    this.form = this.fb.group({
      "category":new FormControl('',Validators.required),
      "subcategory":new FormControl('',Validators.required),
      "brand":new FormControl('',Validators.required),
      "warehouse":new FormControl('',Validators.required),
      "name":new FormControl('',Validators.required),
      "itemcode":new FormControl('',Validators.required),
      "photo":new FormControl('',Validators.required),
      "quantity":new FormControl('',Validators.required),
      "unitprice":new FormControl('',Validators.required),
      "rop":new FormControl('',Validators.required),
      "description":new FormControl('',Validators.required),
      "materialstatus":new FormControl('',Validators.required),
      "materialtype":new FormControl('',Validators.required),
      "purchasedate":new FormControl({Value: new Date(), disabled:true}, Validators.required),
    });

  }

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    this.createView();

    this.mst.getAllList().then((msts:Materialstatus[]) => {
      this.materialstatuses = msts;
    });

    this.cs.getAllList().then((cats:Category[]) => {
      this.categories = cats;
    });

    this.bns.getAllList().then((bnds:Brand[]) => {
      this.brands = bnds;
    });

    this.mts.getAllList().then((mts:Materialtype[]) => {
      this.materialtypes = mts;
    })

    this.rgs.get('material').then((regs:[]) => {
      this.regexes = regs;
      this.createForm();
    });

    this.filterSubcategory();
    //this.filterBrand();
    this.getMaterialName();

  }

  createView(){
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.form.controls['category'].setValidators([Validators.required]);
    this.form.controls['subcategory'].setValidators([Validators.required]);
    this.form.controls['brand'].setValidators([Validators.required]);
    this.form.controls['warehouse'].setValidators([Validators.required]);
    this.form.controls['name'].setValidators([Validators.required, Validators.pattern(this.regexes['name']['regex'])]);
    this.form.controls['itemcode'].setValidators([Validators.required, Validators.pattern(this.regexes['itemcode']['regex'])]);
    this.form.controls['photo'].setValidators([Validators.required]);
    this.form.controls['quantity'].setValidators([Validators.required]);
    this.form.controls['unitprice'].setValidators([Validators.required, Validators.pattern(this.regexes['unitprice']['regex'])]);
    this.form.controls['rop'].setValidators([Validators.required, Validators.pattern(this.regexes['rop']['regex'])]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['materialtype'].setValidators([Validators.required]);
    this.form.controls['materialstatus'].setValidators([Validators.required]);
    this.form.controls['purchasedate'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for(const controlName in this.form.controls){
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
        if (controlName == "purchasedate")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

        if (this.oldMaterial != undefined && control.valid) {
          // @ts-ignore
          if (value === this.material[controlName]) {
            control.markAsPristine();
          } else {
            control.markAsDirty();
          }
        } else {
          control.markAsPristine();
        }
      });
    }

    this.enableButtons(true, false, false);

  }

  enableButtons(add:boolean, upd:boolean, del:boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  loadTable(query: string){

    this.ms.getAll(query)
      .then((materials: Material[]) => {
        this.materials = materials;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
      console.log(error);
      this.imageurl = 'assets/rejected.png';
      })
      .finally( () => {
        this.data = new MatTableDataSource(this.materials);
        this.data.paginator = this.paginator;
      });
  }

  getModi(element: Material){
    return element.itemcode + '('+element.name+')';
  }

  filterTable():void{
    const cssearchdata = this.cssearch.getRawValue();

    this.data.filterPredicate = ((material:Material,filter:string) =>{
      return (cssearchdata.csid == null || material.id.toString().includes(cssearchdata.csid)) &&
        (cssearchdata.csname == null || material.name.includes(cssearchdata.csname)) &&
        (cssearchdata.csitemcode == null || material.itemcode.includes(cssearchdata.csitemcode)) &&
        (cssearchdata.csphoto == null || material.photo.includes(cssearchdata.csphoto)) &&
        (cssearchdata.csquantity == null || material.quantity.toString().includes(cssearchdata.csquantity)) &&
        (cssearchdata.cspdate == null || material.purchasedate.toString().includes(cssearchdata.cspdate)) &&
        (cssearchdata.csunitprice == null || material.unitprice.toString().includes(cssearchdata.csunitprice)) &&
        (cssearchdata.csrop == null || material.rop.toString().includes(cssearchdata.csrop)) &&
        (cssearchdata.csdescription == null || material.description.includes(cssearchdata.csdescription)) &&
        (cssearchdata.csmodi == null || this.getModi(material).toLowerCase().includes(cssearchdata.csmodi)) ;
    });

    this.data.filter = 'xx';
  }

  btnSearchMc():void{
    const ssearchdata = this.ssearch.getRawValue();

    let name = ssearchdata.ssname;
    let itemcode = ssearchdata.ssitemcode;
    let categoryid = ssearchdata.sscategory;
    let materialstatusid = ssearchdata.ssmaterialstatus;

    let query = "";

    if (name!=null && name.trim()!="") query = query + "&materialname" + name;
    if (itemcode!=null && itemcode.trim()!="") query = query + "&materialitemcode" + itemcode;
    if (categoryid!=null) query = query + "&categoryid" + categoryid;
    if (materialstatusid!=null) query = query + "&materialstatusid" + materialstatusid;

    if (query != "") query = query.replace(/^./, "?");

    this.loadTable(query);
  }

  btnClearMc():void{
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Clear", message: "Are you sure you want to clear the search result?"}
    });

    confirm.afterClosed().subscribe(async  result => {
      if (result) {
        this.ssearch.reset();
        this.loadTable("");
      }
    });
  }

  filterSubcategory(){
    this.form.get("category")?.valueChanges.subscribe((cat:Category) => {
      let qry = "?categoryid="+cat.id;
      this.scs.getAllList(qry).then((sct:Subcategory[]) =>
        this.subcategories = sct
      );
    });
  }

  // filterBrand() {
  //   this.form.get("category")?.valueChanges.subscribe((bnd:Brand) => {
  //     let qry = "?categoryid="+bnd.id;
  //     this.bns.getAllList(qry).then((bns:Brand[]) =>
  //       this.brands = bns
  //     );
  //   });
  // }

  getMaterialName():void{
    this.form.get("brand")?.valueChanges.subscribe((bnd:Brand) => {
      let subcategory:Subcategory = this.form.get("subcategory")?.value;
      let matname = bnd.name+" "+subcategory.name;
      this.form.get("name")?.setValue(matname);
    });
  }

  getLastItemCode(){
    let obiitems = from(this.materials);
    obiitems.pipe(last()).subscribe((material:Material) => {
       this.lastitemcode = material.itemcode;
    });
  }

  selectImage(e: any): void{
    if (e.target.files){
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.imagematurl = event.target.result;
        this.form.controls['photo'].clearValidators();
      }
    }
  }

  clearImage(): void{
    this.imagematurl = 'assets/material.jpeg';
    this.form.controls['photo'].setErrors({'required': true});
  }

  getErrors():string{

    let errors = "";

    for (const controlName in this.form.controls){
      const control = this.form.controls[controlName];

      if (control.errors){
        if (this.regexes[controlName] != undefined){
          errors = errors+ "<br>"+ this.regexes[controlName]['message'];
        } else {
          errors = errors+ "<br>Invalid!"+controlName;
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
        data: {heading: "Errors - Material Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.material = this.form.getRawValue();
      this.material.photo = btoa(this.imagematurl);
      //@ts-ignore
      this.material.purchasedate = this.dp.transform(this.material.purchasedate,"YYYY-MM-dd");

      let matdata: string = "";

      matdata = matdata + "<br>Name is : " + this.material.name;
      matdata = matdata + "<br>Itemcode is : " + this.material.itemcode;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Material Add",
          message: "Are you sure to add the following Material? <br> <br>" + matdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.ms.add(this.material).then((response: [] | undefined) => {

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
              data: {heading: "Status -Material Add", message: addmessage}
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


  fillForm(material:Material){

    this.selectedrow=material;

    this.material = JSON.parse(JSON.stringify(material));
    this.oldMaterial = JSON.parse(JSON.stringify(material));

    if (this.material.photo != null) {
      this.imagematurl = atob(this.material.photo);
      this.form.controls['photo'].clearValidators();
    } else {
      this.clearImage();
    }
    this.material.photo = "";

    this.form.get("category")?.valueChanges.subscribe((cat:Category) =>{
      let qry = "?categoryid"+cat.id;
      this.scs.getAllList(qry).then((sct:Subcategory[]) => {
        this.subcategories = sct;
        //@ts-ignore
        this.material.subcategory = this.subcategories.find(s => s.id === this.material.subcategory.id);
      });
    });
    //@ts-ignore
    this.material.subcategory.category = this.categories.find((c) => c.id === this.material.subcategory.category.id);
    this.form.controls['category'].setValue(this.material.subcategory.category);

  }


  clear():void{
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Clear Material Form",
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

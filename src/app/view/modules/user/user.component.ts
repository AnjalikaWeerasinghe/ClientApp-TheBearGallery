import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSelectionList, MatSelectionListChange} from "@angular/material/list";
import {Userstatus} from "../../../entity/userstatus";
import {EmployeeService} from "../../../service/employeeservice";
import {UserstatusService} from "../../../service/userstatusservice";
import {Roleservice} from "../../../service/roleservice";
import {Role} from "../../../entity/role";
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "../../../service/userservice";
import {User} from "../../../entity/user";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {DatePipe} from "@angular/common";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {RegexService} from "../../../service/regexservice";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Userrole} from "../../../entity/userrole";
import {AuthoritySevice} from "../../../service/authoritysevice";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {Usertype} from "../../../entity/usertype";
import {Usertypeservice} from "../../../service/usertypeservice";
import {Employee} from "../../../entity/employee";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

  public form!: FormGroup;
  public ssearch!: FormGroup;
  public csearch!: FormGroup;

  employees: Array<Employee> = [];
  userstatues: Array<Userstatus> = [];
  usertypes: Array<Usertype> = [];
  users: Array<User> = [];
  userroles: Array<Userrole> = [];

  @Input()roles: Array<Role> = [];
  oldroles:Array<Role>=[];
  @Input()selectedroles: Array<Role> =[];

  user!:User;
  olduser!:User;

  @ViewChild('availablelist') availablelist!: MatSelectionList;
  @ViewChild('selectedlist') selectedlist!: MatSelectionList;


  columns: string[] = ['employee', 'username', 'docreated', 'userstatus','role','description','toreated'];
  headers: string[] = ['Employee', 'Username', 'Date of Created', 'Status','Role','Description','To Ceated'];
  binders: string[] = ['employee.callingname', 'username', 'getDate()', 'userstatus.name','getRole()','description','tocreated'];

  cscolumns: string[] = ['csemployee', 'csusername', 'csdocreated', 'csuserstatus','csrole','csdescription','cstocreated'];
  csprompts: string[] = ['Search by Employee', 'Search by Username', 'Search by DoCreated',
    'Search by User Status','Search by Role','Search by Description','Search by To created'];

  imageurl: string = '';

  data !:MatTableDataSource<User>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedrow: any;

  authorities: string[] = [];

  uiassist: UiAssist;

  regexes:any;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
    private fb:FormBuilder,
    private es:EmployeeService,
    private ut:UserstatusService,
    private ust:Usertypeservice,
    private rs:Roleservice,
    private us:UserService,
    private dp:DatePipe,
    private dg:MatDialog,
    private rx:RegexService,
    public authService:AuthorizationManager
  ) {

    this.uiassist = new UiAssist(this);
    this.user = new User();

    this.csearch = this.fb.group({
      "csemployee": new FormControl(),
      "csusername": new FormControl(),
      "csdocreated": new FormControl(),
      "csuserstatus": new FormControl(),
      "csrole": new FormControl(),
      "csdescription": new FormControl(),
      "cstocreated": new FormControl(),

    });

    this.form = this.fb.group({
      "employee": new FormControl('',[Validators.required]),
      "username": new FormControl('',[Validators.required]),
      "password": new FormControl('',[Validators.required]),
      "confirmpassword": new FormControl(),
      "docreated": new FormControl('',[Validators.required]),
      "tocreated": new FormControl(this.dp.transform(Date.now(),"hh:mm:ss"),[Validators.required]),
      "usestatus": new FormControl('',[Validators.required]),
      "usetype": new FormControl('',[Validators.required]),
      "description": new FormControl('',Validators.required),
      "userroles": new FormControl('',[Validators.required])
    });

    this.ssearch = this.fb.group({
      "ssemployee": new FormControl(),
      "ssusername": new FormControl(),
      "ssrole": new FormControl(),
    });

  }


  async ngOnInit(): Promise<void> {
    this.initialize();
  }


  initialize(){

    this.createView();

    this.es.getAllListNameId().then((custs: Employee[]) => {
      this.employees = custs;
    });

    this.ut.getAllList().then((usts:Userstatus[]) => {
      this.userstatues = usts;
    });

    this.ust.getAllList().then((ust:Usertype[]) => {
      this.usertypes = ust;
    });

    this.rs.getAllList().then((rlse:Role[])=>{
      this.roles = rlse;
    this.oldroles = Array.from(this.roles);
    });

    this.rx.get("users").then((regs:[])=>{
      this.regexes = regs;
      this.createForm();
    });

  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query:string):void{


    this.us.getAll(query)
      .then((usrs: User[]) => {
        this.users = usrs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.users);
        this.data.paginator = this.paginator;
      });

  }

  getDate(element: User) {
    return this.dp.transform(element.docreated,'yyyy-MM-dd');
  }


  getRole(element:User){
    let roles = "";
    element.userroles.forEach((e)=>{ roles = roles+e.role.name+","+"\n"; });
    return roles;

  }


  createForm() {
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['username'].setValidators([Validators.required, Validators.pattern(this.regexes['username']['regex'])]);
    this.form.controls['password'].setValidators([Validators.required, Validators.pattern(this.regexes['password']['regex'])]);
    this.form.controls['confirmpassword'].setValidators([Validators.required, Validators.pattern(this.regexes['password']['regex'])]);
    this.form.controls['docreated'].setValidators([Validators.required]);
    this.form.controls['tocreated'].setValidators([Validators.required]);
    this.form.controls['userstatus'].clearValidators();
    this.form.controls['usertype'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['userroles'].setValidators([Validators.required]);
    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "dobirth" || controlName == "doassignment")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.olduser != undefined && control.valid) {
            // @ts-ignore
            if (value === this.user[controlName]) {
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

    this.enableButtons(true,false,false);
  }

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }

  rightSelected(): void {
    this.user.userroles = this.availablelist.selectedOptions.selected.map(option => {
      const userRole = new Userrole(option.value);
      this.roles = this.roles.filter(role => role !== option.value); //Remove Selected
      this.userroles.push(userRole); // Add selected to Right Side
      return userRole;
    });

    this.form.controls["userroles"].clearValidators();
    this.form.controls["userroles"].updateValueAndValidity(); // Update status
  }

  leftSelected(): void {
    const selectedOptions = this.selectedlist.selectedOptions.selected; // Right Side
    for (const option of selectedOptions) {
      const extUserRoles = option.value;
      this.userroles = this.userroles.filter(role =>{
        role !== extUserRoles
      }); // Remove the Selected one From Right Side
      this.roles.push(extUserRoles.role);
    }

  }


  rightAll(): void {
    this.user.userroles = this.availablelist.selectAll().map(option => {
      const userRole = new Userrole(option.value);
      this.roles = this.roles.filter(role => role !== option.value);
      this.userroles.push(userRole);
      return userRole;
    });

    this.form.controls["userroles"].clearValidators();
    this.form.controls["userroles"].updateValueAndValidity();
  }

  leftAll():void{
    for(let userrole of this.userroles) this.roles.push(userrole.role);
    this.userroles = [];
  }

  filterTable(): void {
    const csearchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (user: User, filter: string) => {
      return (csearchdata.csemployee == null || user.employee.callingname.toLowerCase().includes(csearchdata.csemployee)) &&
        (csearchdata.csusername == null || user.username.toLowerCase().includes(csearchdata.csusername)) &&
        (csearchdata.csdocreated == null || user.docreated.toLowerCase().includes(csearchdata.csdocreated)) &&
        (csearchdata.csuserstatus == null || user.userstatus.name.toLowerCase().includes(csearchdata.csuserstatus));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {
    const ssearchdata = this.ssearch.getRawValue();
    let employee = ssearchdata.ssemployee;
    let username = ssearchdata.ssusername;
    let roleid = ssearchdata.ssrole;
    let query = "";

    if (employee != null && employee.trim() !== "") query = query + "&employee=" + employee;
    if (username != null && username.trim() !== "") query = query + "&username=" + username;
    if (roleid != null) query = query + "&roleid=" + roleid;

    if (query != "") query = query.replace(/^./, "?")

    this.loadTable(query);
  }


  // btnSearchMc(): void {
  //
  //   const sserchdata = this.ssearch.getRawValue();
  //
  //   let employee = sserchdata.ssemployee;
  //   let username = sserchdata.ssusername;
  //   let roleid = sserchdata.ssrole;
  //
  //   let query = "";
  //
  //   if (employee != null && employee.trim() != "") query = query + "&employee=" + employee;
  //   if (username != null && username.trim() != "") query = query + "&username=" + username;
  //   if (roleid != null) query = query + "&roleid=" + roleid;
  //
  //   if (query != "") query = query.replace(/^./, "?")
  //
  //   this.loadTable(query);
  //
  // }

  btnSearchClearMc(): void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to clear the search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.ssearch.reset();
        this.loadTable("");
      }
    });

  }


  getErrors(): string {

    let errors: string = ""

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

    // if(this.form.controls['password'].getRawValue() != this.form.controls['confirmpassword'].getRawValue())
    //   errors = errors + "<br> Password doesn't Match";

    return errors;
  }


  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - User Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      let user:User = this.form.getRawValue();


      // @ts-ignore
      delete user.confirmpassword;
      // console.log(user);
      user.userroles = this.user.userroles;
      this.user = user;

      let userdata: string = "";

      userdata = userdata + "<br>Employee is : " + this.user.employee.callingname;
      userdata = userdata + "<br>Username is : " + this.user.username;
      userdata = userdata + "<br>Password is : " + this.user.password;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - User Add",
          message: "Are you sure to add the folowing user? <br> <br>" + userdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // console.log("Employeeservice.add(emp)");

          console.log(JSON.stringify(this.user));
          this.us.add(this.user).then((responce: [] | undefined) => {
            //console.log("Res-" + responce);
            //console.log("Un-" + responce == undefined);
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
              this.userroles = [];
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status - User Add", message: addmessage}
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


  fillForm(user: User) {

    this.enableButtons(false,true,true);

    this.roles = Array.from(this.oldroles);

    this.selectedrow=user;

    this.user = JSON.parse(JSON.stringify(user));
    this.olduser = JSON.parse(JSON.stringify(user));

    //@ts-ignore
    this.user.customer = this.customers.find(e => e.id === this.user.customer.id);

    //@ts-ignore
    this.user.userstatus = this.userstatues.find(s => s.id === this.user.userstatus.id);

    //@ts-ignore
    this.user.usertype = this.usertypes.find(s => s.id === this.user.usertype.id);

    this.userroles = this.user.userroles; // Load User Roles

    this.user.userroles.forEach((ur)=> this.roles = this.roles.filter((r)=> r.id != ur.role.id )); // Load or remove roles by comparing with user.userroles

    this.form.patchValue(this.user);
    // this.form.controls["username"].disable();
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
        data: {heading: "Errors - User Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Employee Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("Employeeservice.update()");
            this.user = this.form.getRawValue();

            this.us.update(this.user).then((responce: [] | undefined) => {
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
                this.leftAll();
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Employee Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Employee Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }
  }


  delete() : void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - User Delete",
        message: "Are you sure to Delete following User? <br> <br>" + this.user.username
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.us.delete(this.user.username).then((responce: [] | undefined) => {

          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        }).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.form.reset();
            this.leftAll();
            Object.values(this.form.controls).forEach(control => {
              control.markAsTouched();
            });
            this.loadTable("");
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - User Delete ", message: delmessage}
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

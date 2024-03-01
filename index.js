const db = require('./connection.js'); //mysql server connection
const inquirer = require('inquirer');
const { nav, addEmp, upEmpRole, upEmpManager, addRole, addDepart, deleteOption } = require('./inquiries.js'); //import questions for prompts
const { viewEmployee, viewRole, viewDepartment,
    employees, roles, departments,
    getEmpID, getManagerID, getRoleID, getDepartID,
    addNewEmployee, addNewRole, addNewDepart,
    updateEmpRole, updateEmpManager } = require('./query.js'); //import query info


//view table in cli
function viewTable(viewQuery) {
    db.query(viewQuery)
        .then(([rows, fields]) => console.table(rows))
        .then(() => init())
}

//add new employee
function addEmployee() {
    inquirer.prompt(addEmp)
        .then(async (res) => {
            const managerName = res.addEmployeeManager.split(" ");
            const managerID = await getManagerID(managerName);
            const roleID = await getRoleID(res.addEmployeeRole);
            await addNewEmployee(res.addEmployeeFirstName, res.addEmployeeLastName, roleID, managerID);
        })
        .then(() => init());
}

//add new roles
function addRoles() {
    inquirer.prompt(addRole)
        .then(async (res) => {
            const departID = await getDepartID(res.addRoleDepartment);
            await addNewRole(res.addRole, res.addRoleSalary, departID);
        })
        .then(() => init());
}

//add new department
function addDepartment() {
    inquirer.prompt(addDepart)
        .then((res) => {
            addNewDepart(res.addDepartment);
        })
        .then(() => init());
}

//update employee's role
function updateEmployeeRole() {
    inquirer.prompt(upEmpRole)
        .then(async (res) => {
            const employee = res.updateEmployee.split(" ");
            const empID = await getEmpID(employee);
            const roleID = await getRoleID(res.updateEmployeeRole);
            await updateEmpRole(roleID, empID);
        })
        .then(() => init());
}

//update employee's manager
function updateEmployeeManager() {
    inquirer.prompt(upEmpManager)
        .then(async (res) => {
            const employee = res.updateEmployee.split(" ");
            const manager = res.updateEmployeeManager.split(" ");
            const empID = await getEmpID(employee);
            const managerID = await getManagerID(manager);
            await updateEmpManager(managerID, empID);
        })
        .then(() => init());
}

//delete entry from database
function deleteEntry() {
    //prompt which table to delete from
    inquirer.prompt(deleteOption)
        .then(async (choice) => {
            let arr;
            switch (choice.table) {
                case 'employees':
                    arr = Array.from(await employees());
                    arr.push('employee');
                    break;
                case 'roles':
                    arr = Array.from(await roles());
                    arr.push('role');
                    break;
                case 'departments':
                    arr = Array.from(await departments());
                    arr.push('department');
                    break;
            }
            return arr; //push queried info transformed from functions into an array
        })
        .then((choices) => {
            let arr = choices.pop();
            //prompt the choices from the table
            return inquirer.prompt({
                type: 'list',
                name: 'name',
                message: `Choose one from ${arr}`,
                choices: choices})
                //split into array if containing full name and include in array with table name
                .then((res) => new Array(arr, res.name.split(" ")))
                .catch((err) => console.log(err));
        })
        .then(async (res) => {
            //array split into names and table for switch-case
            const names = res.pop();
            const [table] = res;
            const id = async () => {
                //retrieve respective id from the table use names
                switch (table) {
                    case 'employee': return await getEmpID(names);
                    case 'role': return await getRoleID(names);
                    case 'department': return await getDepartID(names);
                }
            };
            //had to template literal table because got error sending string of table name into query
            await db.query(`DELETE FROM ${table} WHERE id = ?`, await id());
            console.log(`Deleted ${names} from ${table}s`);
        })
        .then(() => init());
}

function init() {
    //main prompt navigation
    inquirer.prompt(nav)
        .then(res => {
            switch (res.userAction) {
                case 'View All Employees':
                    viewTable(viewEmployee);
                    break;
                case 'Add employee':
                    addEmployee();
                    break;
                case 'Update Employee\'s Role':
                    updateEmployeeRole();
                    break;
                case 'Update Employee\'s Manager':
                    updateEmployeeManager();
                    break;
                case 'View All Roles':
                    viewTable(viewRole);
                    break;
                case 'Add Role':
                    addRoles();
                    break;
                case 'View All Departments':
                    viewTable(viewDepartment);
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Delete Entry':
                    deleteEntry();
                    break;
                case 'Quit':
                    db.end();
                    break;
                default:
                    break;
            }
        }).then(console.log(''))
        .catch(err => console.log(err));
}
init();
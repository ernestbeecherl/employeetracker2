const { employees, managers, roles, departments } = require('./query.js');

//inquirer main prompts
const nav = {
    type: 'list',
    name: 'userAction',
    message: 'What would you like to do?',
    choices: [
        'View All Employees',
        'Add employee',
        'Update Employee\'s Role',
        'Update Employee\'s Manager',
        'View All Roles',
        'Add Role',
        'View All Departments',
        'Add Department',
        'Delete Entry',
        'Quit'],
};

//add new employee
const addEmp = [{
    type: 'input',
    name: 'addEmployeeFirstName',
    message: 'What\'s the first name of the employee?',
},
{
    type: 'input',
    name: 'addEmployeeLastName',
    message: 'What\'s the last name of the employee?',
},
{
    type: 'list',
    name: 'addEmployeeRole',
    message: 'What\'s the employee\'s role?',
    choices: roles
},
{
    type: 'list',
    name: 'addEmployeeManager',
    message: 'Who\'s the employee\'s manager?',
    choices: managers
}];

//update employee's role
const upEmpRole = [{
    type: 'list',
    name: 'updateEmployee',
    message: 'Which employee\'s role do you want to update?',
    choices: employees
},
{
    type: 'list',
    name: 'updateEmployeeRole',
    message: 'Which role do you want to assign the employee?',
    choices: roles
}];

//update employee's manager
const upEmpManager = [{
    type: 'list',
    name: 'updateEmployee',
    message: 'Which employee\'s manager do you want to update?',
    choices: employees
},
{
    type: 'list',
    name: 'updateEmployeeManager',
    message: 'Which manager do you want to assign the employee?',
    choices: managers
}];

//add new role
const addRole = [{
    type: 'input',
    name: 'addRole',
    message: 'What\'s the name of the role?',
},
{
    type: 'input',
    name: 'addRoleSalary',
    message: 'What\'s the salary of the role?',
},
{
    type: 'list',
    name: 'addRoleDepartment',
    message: 'Which department does the role belong to?',
    choices: departments
}];

//add new department
const addDepart = {
    type: 'input',
    name: 'addDepartment',
    message: 'What\'s the name of the department?',
};

const deleteOption = {
    type: 'list',
    name: 'table',
    message: 'Choose table to delete entry from',
    choices: ['employees', 'roles', 'departments']
}

module.exports = { nav, addEmp, upEmpRole, upEmpManager, addRole, addDepart, deleteOption } 
const db = require('./connection.js');

//read queries for console.table
const viewEmployee =
    `SELECT emp.id, emp.first_name, emp.last_name, dep.name AS department, role.title,  role.salary,
        IF(emp.manager_id = m.id, CONCAT(m.first_name," ", m.last_name), NULL) as manager
    FROM employee emp
    LEFT JOIN role
        ON emp.role_id = role.id
    LEFT JOIN department dep
        ON role.department_id = dep.id
    LEFT JOIN employee m
        ON emp.manager_id = m.id
`;
const viewRole =
    `SELECT role.id, role.title, dep.name AS department, role.salary
    FROM role
    LEFT JOIN department dep
        ON role.department_id = dep.id 
`;

const viewDepartment =
    `SELECT * FROM department`;

//read queries for inquirer's choices

const employees = async function() {
    [rows, fields] = await db.query(`SELECT CONCAT(first_name," ",last_name) AS name FROM employee`);
    return rows.map(obj=>obj.name);
};

const managers = async function () {
    [rows, field] = await db.query(`
    SELECT CONCAT(first_name," ",last_name) as managers
        FROM employee
        WHERE manager_id IS NULL`); 
    return rows.map(obj => obj.managers);
};

const roles = async function() {
    [rows, fields] = await db.query(`SELECT title FROM role`);
    return rows.map(obj => obj.title);
}

const departments = async function() {
    [rows, fields] = await db.query(`SELECT name FROM department`);
    return rows.map(obj=>obj.name);
};

//read queries return associated ID's

const getEmpID = async function(employee) {
    [rows, fields] = await db.query(`
    SELECT id FROM employee WHERE first_name = ? AND last_name = ?`,
    employee);
    return rows[0].id;
}

const getManagerID = async function(manager) {
    [rows, fields] = await db.query(`
    SELECT id FROM employee WHERE first_name = ? AND last_name = ?`, manager);
    return rows[0].id;
};

const getRoleID = async function(role) {
    [rows,fields] = await db.query(`
    SELECT id FROM role WHERE title = ?`, role);
    return rows[0].id;
}

const getDepartID = async function (name) {
    [rows, fields] = await db.query(`
    SELECT id FROM department WHERE name = ?`, name);
    return rows[0].id;
}

//create queries for associated tables
const addNewEmployee = async function(first, last, roleID, managerID) {
    try {
       await db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id)
                VALUE(?,?,?,?)`, [first, last, roleID, managerID]);
    return console.log("Added new Employee");
    } catch (err) {
        console.log("Error Adding Employee : " + err.message);
    }
}

const addNewRole = async function(title, salary, departID) {
    try {
        await db.query(`INSERT INTO role(title, salary, department_id)
                VALUE (?,?,?)`, [title, salary, departID]);
    return console.log("Added New Role");
    } catch (err) {
        console.log("Error Adding Role : " + err.message);
    }
}

const addNewDepart = async function(name) {
    try {
        await db.query(`INSERT INTO department(name) VALUE (?)`, name);
    return console.log("Add New Department");
    } catch (err) {
        console.log("Error Adding Department : " + err.message);
    }
}

//update queries for employees

const updateEmpRole = async function(roleID, empID) {
    db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [roleID, empID]);
    return console.log("Updated Employee's role");
}

const updateEmpManager = async function(managerID, empID) {
    db.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, [managerID, empID]);
    return console.log("Updated Employee's manager");
}

module.exports = {
    viewEmployee, viewRole, viewDepartment,
    employees, managers, roles, departments,
    getEmpID, getManagerID, getRoleID, getDepartID,
    addNewEmployee, addNewRole, addNewDepart,
    updateEmpRole, updateEmpManager };
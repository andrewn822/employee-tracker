const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

const db = mysql.createConnection (
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employees_db'
    },

    console.log('Connected to the employees_db database')
);

const initPrompt = [{
    type: 'list',
    name: 'initAction',
    message: 'What would you like to do?'
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee']
}]

const departmentPrompt = [{
    type: 'input',
    name: 'depName',
    message: 'What is the name of the department',
}]

const deptQuery = async() => {
    const res = await inquirer.prompt(departmentPrompt)
    db.query(`INSERT INTO department (name) VALUES ("${res.depName}")`)
    init();
}

const roleQuery = async(data) => {
    const res = await inquirer.prompt([{
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the role?'
    },{
        type: 'number'
        name: 'salary',
        message: 'What is the salary for this role?'
    }, {
        type: 'list',
        name: 'depRole',
        choices: data
    }])
    
    var roleID = data.find(element => {
        return element.name === res.depRole
    })
    db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${res.roleName}', '${res.salary}', ${roleID.id})`,
    function (err, res) {
        init()
    })

}

const empQuery = async(data, data2) => {
    const res = await inquirer.prompt([{
        type: 'input',
        name: 'empfName',
        message: "What is the employee's first name?"
    }, {
        type: 'input',
        name: 'emplName',
        message: "What is the employee's last name"
    }, {
        type: 'list',
        name: 'empRole',
        message: "What is the employee's role",
        choices: data2
    }, {
        type: 'list',
        name: 'empMan'
        message: "Who is the employee's manager?",
        choices: data
    }])
    var hasManager = data.find(element => {
        return element.name === res.empMan
    })
    var hasRole = data.find(el => {
        return el.name === res.empRole
    })
    db.query(`INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id) VALUES ("${res.empfName}"), "${res.emplName}", "${hasRole.id}", '${hasManager.id}) `)
}
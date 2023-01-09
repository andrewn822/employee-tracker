const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
const { exit } = require('process');

const db = mysql.createConnection (
    {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'employees_db'
    },

    console.log('Connected to the employees_db database')
);

const initPrompt = [{
    type: 'list',
    name: 'initAction',
    message: 'What would you like to do?',
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
        type: 'number',
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
        name: 'empMan',
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


const updateQuery = async (data, data2) => {
    const res = await inquirer.prompt([{
        type: 'list',
        name: 'updateEmp',
        message: 'Which employee would you like to update?',
        choices: data
    }, {
        type: 'list',
        name: 'updateEmpRole',
        message: "What is the employee's new role?",
        choices: data2
    }])

    const empEl = data.find( el => {
        return el.name === res.updateEmp
    })

    const empElID = empEl.id

    const roleEl = data2.find(el => {
        return el.name === res.updateEmpRole
    })

    const roleElID = roleEl.id

    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`
    const params = [roleElID, empElID]
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error(err)
        } else {
            init();
        }
    })
}


const init = async () => {
    const res = await inquirer.prompt(initPrompt)

    if (res.initAction === 'view all departments') {
        db.query('SELECT * FROM department', function (err, results){

            console.table(restuls)
            init();
        })
    }

    if (res.initAction === 'view all roles'){
        db.query('SELECT role.id, role.title, role.salary FROM role LEFT JOIN department ON role.department_id = department.id ', function (err, results){
            console.table(results)
            init();
        })
    }


    if (res.initAction === 'view all employees'){
        db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(Manager.first_name, " ", Manager.last_name) as manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id LEFT JOIN employee as Manager ON employee.manager_id = Manager.id', function (err, results){
            console.table(results)
            init();
        })
    }

    if (res.initAction === 'add a department'){
        console.log('running department prompt...')
        deptQuery();
    }

    if (res.initAction === 'add a role'){
        console.log('running role prompt...')
        db.query('SELECT * FROM department', function (err, res) {
            roleQuery(res);
        })
        
    }

    if (res.initAction === 'add an employee'){
        console.log('running employee prompt...')
        db.query('SELECT CONCAT (employee.first_name, " ", employee.last_name) as name, employee.id FROM employee WHERE manager_id IS NULL' , function (err, res) {
            db.query('SELECT title as name, id FROM role', function(err, res2){
                empQuery(res, res2)
            })
            
        })
        
    }

    if (res.initAction === 'update an employee role'){
        console.log('running update prompt...')
        db.query('SELECT CONCAT(employee.first_name, " ", employee.last_name) as name, manager_id, role_id, id FROM employee', function (err, empRes) {
            db.query('SELECT title as name, id FROM role', function(err, roleRes) {
                if (err)  {
                    console.error(err)
                }
                updateQuery(empRes, roleRes)
            })
            
        })
    }
    if (res.initAction === 'exit application'){
        return exit()
    }
    return






}

init();


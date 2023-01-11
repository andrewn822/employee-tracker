INSERT INTO department (name)
VALUES ("Service"),
       ("Sales"),
       ("Engineering"),
       ("Legal"),
       ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Customer Service Manager", 50000, 1),
       ("Customer Service", 40000, 1),
       ("Sales Manager", 60000, 2),
       ("Salesperson", 55000, 2),
       ("Engineering Manager", 80000, 3),
       ("Software Engineer", 72000, 3),
       ("Legal Team Manager", 110000, 4),
       ("Lawyer", 90000, 4),
       ("Finance Manager", 70000, 5),
       ("Accountant", 62000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jane", "Doe", 1, NULL),
       ("John", "Smith", 2, 1),
       ("Aaron", "Landon", 3, NULL), 
       ("James", "Ketchum", 4, 3),
       ("Andrew", "Nguyen", 5, NULL),
       ("Esme", "Nguyen", 6, 5),
       ("Kristen", "Morris", 7, NULL),
       ("Jason", "Drever", 8, 7),
       ("Kate", "Nguyen", 9, NULL),
       ("Toby", "Nguyen", 10, 9);
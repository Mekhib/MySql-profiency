var inquirer = require('inquirer');
var sql = require('mysql');
var connection = sql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "brightlight",
    database: "amazon_db"
});
connection.connect(function(err, connection) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
});

const display = () => {
    connection.query('SELECT * FROM inventory', function(err, res) {
        if (err) throw err
        console.log(res);
    })
}
display();
inquirer.prompt([{
        type: 'prompt',
        name: 'select',
        message: 'Welcome to Bamazon! Pick the ID for the product you want to buy!'
    },
    {
        type: 'prompt',
        name: 'Quanity',
        message: 'how much would you like to buy?'
    }
]).then(function(results) {
    console.log("Searching our inventory!")
    var choice = results.select;
    var Quanity = results.Quanity;
    connection.query("SELECT * FROM inventory WHERE id=?", [choice], function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            var check = res[i].stock;
            var price = res[i].PRICE
        }
        if (Quanity < check) {
            console.log('We have enough avalible!')
        } else if (Quanity = check) {
            console.log("We have exactly enough")
        } else {
            console.log('We do not have enough in stock. You must buy at a lower stock price!')
        }
        console.log("your final price is:" + Quanity * price);
    })
    const update = () => {
        connection.query(
            "SELECT * FROM inventory WHERE ?", [{
                id: choice
            }],
            function(error, results) {
                if (error) throw error;
                console.log(results);
                var currentStock = results[0].stock;
                connection.query(
                    "UPDATE inventory SET ? WHERE ?", [{
                            stock: currentStock - Quanity
                        },
                        {
                            id: choice
                        }
                    ],
                    function(error) {
                        if (error) throw error;
                        console.log("Stock gone");
                    }
                );
            });
    }
    update();
});
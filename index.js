const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./database");
const globalStatController = require("./controller/global-stat.controller");

async function launchServer(){
    const app = express();
    
    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.json({message: "hello CoronaBoard"});
        // res.send(`
        // <form method='get' action='/global-stats'>
        //     <input name='get' type='text' value='1'>
        //     <input type='submit' value='버튼'>
        // </form>      
        // <form method='post' action='/global-stats'>
        //     <input name='post' type='text' value='2'>
        //     <input type='submit' value='버튼'>
        // </form> 
        // <form method='delete' action='/global-stats'>
        //     <input name='delete' type='text' value='3'>
        //     <input type='submit' value='버튼'>
        // </form>     
        // `);
        // console.log(typeof res.status(200));
        // console.log(res.status(200));
    });

    app.get('/global-stats', globalStatController.getAll);
    app.post('/global-stats', globalStatController.insertOrUpdate);
    app.delete('/global-stats',globalStatController.remove);

    try{
        await sequelize.sync();
        console.log("Database is ready!");
    } catch(error) {
        console.log("Unable to connect to the database");
        console.log(error);
        process.exit(1);
    }

    const port = process.env.PORT || 8080;
    app.listen(port, ()=> {
        console.log(`Server is running on port ${port}.`);
    });
}


launchServer();


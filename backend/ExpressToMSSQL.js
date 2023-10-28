var myssql=require('mysql');//loading the driver
var exp=require('express');
 
//cross origin resource sharing
var cors=require('cors'); //enabling communication between two server.
var bpasrser=require('body-parser');
bodyParserInit=bpasrser.urlencoded({extended:false});
var app=exp();
app.use(cors());
app.use(exp.json());
//connect to the database
myssqlconnection=myssql.createConnection({
    host:'localhost',
    port:3306,
    database:'world',
    user:'root',
    password:'root'
});
 
function testconnection(error){
    if(error==undefined){
        console.log("Connected to the database...");
    }
    else{
        console.log("Error code:"+error.errorno);
        console.log(error.message);
    }
}
function feedback(error){
    if (error==undefined){
    console.log("Server started on port 4000");
    console.log("Open the browser and visit http://localhost:4000/getall");
    }
    else{
        console.log(error.errorno);
        console.log(error.message);
    }
}
 
app.listen(4000,feedback);
 
// myssqlconnection.connect(testconnection);
// app.post('/Authenticate', bodyParserInit, authenticateUser);

// function authenticateUser(request, response) {
//     var userid = request.body.uid; // Assuming the user sends the userid and password in the request body
//     var password = request.body.password;

//     // Check the database for the provided userid and password
//     myssqlconnection.query('SELECT * FROM users WHERE userid = ? AND password = ?', [userid, password], function (error, results) {
//         if (error) {
//             console.error("Error authenticating user: " + error);
//             response.status(500).json({ success: false, message: "Authentication failed" });
//         } else {
//             if (results.length > 0) {
//                 // User is authenticated
//                 response.json({ success: true, message: "Authentication successful" });
//             } else {
//                 // User not found or authentication failed
//                 response.json({ success: false, message: "Authentication failed" });
//             }
//         }
//     });
// }

function loginUser(request, response) {
    const { userid, password } = request.body;
 
    const trimmedUserid = userid.trim();
const trimmedPassword = password.trim();
    if (!trimmedUserid || !trimmedPassword) {
        console.log("Missing userid or password in the request.");
        return response.status(400).send("User ID and password are required");
    }
 
    myssqlconnection.query('SELECT * FROM users WHERE userid = ? AND password = ?', [trimmedUserid, trimmedPassword], function(error, results) {
        if (error) {
            console.error("Database query error:", error);
            return response.status(500).send("Internal Server Error");
        }
 
        if (results.length > 0) {
            return response.json({ message: "Login successful" });
        } else {
            return response.status(401).json({ message: "Invalid credentials" });
        }
       
    });
}


function displayAllUsers(request,response){
    myssqlconnection.connect(testconnection);
    myssqlconnection.query('select * from users',processResults);
    response.send(queryresults);
}
 
var queryresults=undefined;
function processResults(error,results){
    queryresults=results;
    console.log(results);
}
 
function getuserbyId(request,response){
    var userid=request.query.uid;
    //Paramaterized SQL
    myssqlconnection.query('select * from users where userid=?',[userid],processResults);
    response.send(queryresults)
}
 
function getuserbyName(request,response){
    var useremail=request.query.email;
    //Paramaterized SQL
    myssqlconnection.query('select * from users where email=?',[useremail],processResults);
    response.send(queryresults)
}
 
var statusMessage=" ";
 
function checkInsertStatus(error){
        statusMessage=((error==undefined)?"<b>Insert successful</b>":
        "<b>Insert failure"+error.message+"</b>");
}
 
function createUser(request,response){
    var userid=request.body.uid;
    var pwd=request.body.password;
    var email=request.body.email;
    console.log(userid+"\t\t"+pwd+"\t\t"+email);
    myssqlconnection.connect(testconnection);
    myssqlconnection.query('insert into users values(?,?,?)',[userid,pwd,email],checkInsertStatus);
    response.send(JSON.stringify(statusMessage));//convert from json to string
}
 
// // This is the callback to check the delete status
// function checkDeleteStatus(error, results) {
//     if (error) {
//         console.error("Error deleting the user: " + error);
//         deleteStatusMessage = "Error deleting the user!";
//     } else {
//         console.log("User deleted successfully!");
//         deleteStatusMessage = "User deleted successfully!";
//     }
// }
 
function deleteUser(request, response) {
    var userid = request.params.userid;
    console.log("Deleting user with ID: " + userid);
 
    // Assuming you're using a connection pool, otherwise, set up the connection as you need
    myssqlconnection.query('DELETE FROM users WHERE userid = ?', [userid], (error, results) => {
        if (error) {
            console.error("Error deleting the user: ", error);
            response.status(500).send("Error deleting the user!");
        }else {
            if (results.affectedRows === 0) { // No user was updated (probably the userid does not exist)
                response.status(404).send("User not found");
            }else {
            console.log("User deleted successfully!");
            response.send("User deleted successfully!");
        }}
});
}
 
function updateUser(request, response) {
    // Extracting data from the request body
    const userid = request.params.userid;
    const { password, email } = request.body;
 
    // Check if the necessary data is provided
    if (!userid || !password || !email) {
        return response.status(400).send("Required data missing");
    }
 
    // SQL query to update user data
    const updateQuery = 'UPDATE users SET password = ?, email = ? WHERE userid = ?';
 
    myssqlconnection.query(updateQuery, [password, email, userid], (error, results) => {
        if (error) {
            console.error("Error updating the user: ", error);
            response.status(500).send("Error updating the user");
        } else {
            if (results.affectedRows === 0) { // No user was updated (probably the userid does not exist)
                response.status(404).send("User not found");
            } else {    
                response.send("User updated successfully!");
            }
        }
    });
}
 
 
 
app.get('/getall',displayAllUsers);
app.get('/getbyId',getuserbyId);
app.get('/getbyName',getuserbyName);
app.post('/insert',bodyParserInit,createUser);
app.post('/login',bodyParserInit,loginUser);

app.delete('/delete/:userid', bodyParserInit, deleteUser);
app.post('/update/:userid', bodyParserInit, updateUser);
 
 
 
// for every function there is callback in--reactjs,expressjs
 
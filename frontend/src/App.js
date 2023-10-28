import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

//Axios is used for client to server communication
function App() {
  const[userId,setuserId]=useState('');
  const[email,setemail]=useState('');
  const[password,setPassword]=useState('');
  const[data,setdata]=useState([]);
  const[displayusers,setdisplayusers]=useState(false);

//   useEffect(() =>{

//     fetch("http://localhost:4000/getall")
//     .then(response => response.json())
//     .then(data =>{
//       console.log(data);
//       setdata(data);
//       //setdisplayusers(true);
//     })

// },[]);

const fetchData=()=>{
  fetch("http://localhost:4000/getall")
    .then(response => response.json())
    .then(data =>{//to store we use .then
      console.log(data);
      setdata(data);
      setdisplayusers(true);
    })
    .catch(error=>console.log('There was a problem,',error.message));
}

// useEffect(() => {
//   fetch("http://localhost:4000/getall")
//     .then(response => response.json())
//     .then(data => {
//       console.log(data);
//       setdata(data);
//     })
//     .catch(error => {
//       console.error("Error fetching data:", error);
//     });
// }, []);


// const Displayusers = () => {
//   setdisplayusers(true);
// };

// const deleteUser = (event) => {
//   event.preventDefault();
//   axios.post('http://localhost:4000/delete', {uid: userId})
//     .then(res => {
//       console.log(res);
//       console.log(userId);
//       if (res.data === "User deleted successfully") {
//         alert('User deleted successfully!');
//         setuserId("");  // Clear the deleteUserId input
//       } else if(res.data === "Error deleting the user"){
//         alert('Error deleting the user.');
//       }
//     })
//     .catch(error => {
//       console.error("Error during the deletion: ", error);
//       alert('Error deleting the user. Check the console for more details.');
//     });
// };

const deleteUser = (event) => {
  event.preventDefault();
  axios.delete(`http://localhost:4000/delete/${userId}`)
    .then(res => {
      console.log(res);
      if (res.data === "User deleted successfully!") {
        alert('User deleted successfully!');
        setuserId("");  // Assuming you have a state function named setuserId to clear the input
      } else if(res.data === "Error deleting the user!"){
        alert('Error deleting the user.');
      } else if (res.data === "User not found") {
        alert('User not found.');
      } else {
        alert('Unexpected response from the server.');
      }
    })
    .catch(error => {
      console.error("Error during the deletion: ", error);
      // Check if error has a response attached to it
      if (error.response) {
        // Based on the status code, provide a clearer error message
        switch(error.response.status) {
          case 404:
            alert('User not found.');
            break;
          case 500:
            alert('Server error. Please try again later.');
            break;
          default:
            alert('Error deleting the user. Check the console for more details.');
        }
      } else {
        // If there's no response, it could be a network issue or other problem
        alert('Network error. Please check your connection and try again.');
      }
    });
};

// const updateUser = (event) => {
//   event.preventDefault();
//   axios.put('http://localhost:4000/update', {uid: userId, newPassword: password, newEmail: email})
//       .then(res => {
//           alert(res.data);
//           console.log(data);
//           setuserId("");  // Optionally, clear fields after update
//           setPassword("");
//           setemail("");
//       })
//       .catch(error => {
//           console.error("Error during the update: ", error);
//           alert('Error updating the user. Check the console for more details.');
//       });
// };

const updateUser = (event) => {
  event.preventDefault();
  axios.put('http://localhost:4000/update', { uid: userId, password: password, email: email })
    .then(res => {
      alert(res.data);  // Displaying the message received from the server
      console.log(res.data);
      // Optionally, clear the fields after a successful update
      setuserId("");
      setPassword("");
      setemail("");
    })
    .catch(error => {
      console.error("Error during the update: ", error);
      // Checking if the error has a response attached to it
      if (error.response) {
        switch(error.response.status) {
          case 400:
            alert('Required data missing. Ensure all fields are filled.');
            break;
          case 404:
            alert('User not found.');
            break;
          case 500:
            alert('Internal server error. Please try again later.');
            break;
          default:
            alert('Unexpected error updating the user. Check the console for more details.');
        }
      } else {
        // For cases where there's no response (e.g., network issues)
        alert('Network error. Please check your connection and try again.');
      }
    });
};
const resetForm = () => {
  setuserId(''); // Reset firstname to an empty string
  setPassword('');   // Reset address to an empty string
  setemail('');   // Reset address to an empty string
};
const updateUserId=(event)=>{
  setuserId(event.target.value);
}
const updatepassword=(event)=>{
  setPassword(event.target.value);
}
const updateemail=(event)=>{
  setemail(event.target.value);
}
const insertUser=(event)=>{
  event.preventDefault();
  axios.post('http://localhost:4000/insert',
  {uid:userId,password:password,email:email}) //url,data ;uid is the body we given in expressjs
  .then(res => console.log(res));
}

  return (
    <div className="App">
      <center>
      <form onSubmit={insertUser}>
        <b>UserId</b><input type="text" value={userId} onChange={updateUserId} /><br />
        <b>Password</b><input type="password" value={password} onChange={updatepassword} /><br />
        <b>Email</b><input type="email" value={email} onChange={updateemail} /><br />
        <input type="submit" value="Add" />&nbsp;&nbsp;
        <input type="reset" value="Reset" onClick={resetForm} />
      </form>
      <input type="button" value="Display list" onClick={fetchData}/>
      <input type="button" value="Update user" onClick={updateUser}/>
      <input type="button" value="Delete user" onClick={deleteUser}/>

      {/* {displayusers ? (
        <>
          <b>Retrieved Data:</b>
          <ul>
            {data.map((user, index) => (
              <li key={index}>
                UserId: {user.userid}, Password: {user.password}, Email: {user.email}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Some text to display when displayusers is false.</p>
      )} */}
      {displayusers && (
        <>
          <b>Retrieved Data:</b>
          <ul>
            {data.map((user, index) => (
              <li key={index}>
                UserId: {user.userid}, Password: {user.password}, Email: {user.email}
              </li>
            ))}
          </ul>
        </>
      )}
      </center>
    </div>
  );
}

export default App;



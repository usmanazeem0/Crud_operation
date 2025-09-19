let submit = document.getElementById("submitbtn");
let formid = document.getElementById("formId");
// get the inputs and check if the data has been entered or not
let fname = document.getElementById("fname");
let lname = document.getElementById("lname");
let email = document.getElementById("email");
let tableBody = document.querySelector("#userTable tbody");

// now target and get values the error messages for each input
let fNameError = document.getElementById("firstNameError");
let lNameError = document.getElementById("lastNameError");
let emailError = document.getElementById("emailError");

// Load data on page load
window.onload = createUser;
// create user function
function createUser() {
  // get the existing user from localstorage if not then empty array
  let users = JSON.parse(localStorage.getItem("users")) || [];
  tableBody.innerHTML = "";
  users.forEach(function (user, index) {
    let row = `<tr>
    <td>${user.firstName} ${user.lastName}</td>
    <td>${user.email}</td>
    <td>${user.gender}</td>
    <td>
     <button class="tbl-btn edit-btn" data-index="${index}">Edit</button>
    <button class ="tbl-btn delete-btn" data-index="${index}">Delete</button></td>
     </tr>`;
    tableBody.innerHTML += row;
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      let index = this.getAttribute("data-index");
      deleteRow(index);
    });
  });

  // add eventListener for edit
  let editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      let index = this.getAttribute("data-index");
      editRow(index);
    });
  });
}

// write function for setUser
function setUser(newUser) {
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
}

// now write the function for deleting items from table
function deleteRow(index) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(users));
  createUser();
}

// function for editRow
let editIndex = null;
function editRow(index) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users[index];
  fname.value = user.firstName;
  lname.value = user.lastName;
  email.value = user.email;
  if (user.gender === "male") {
    document.getElementById("male").checked = true;
  } else if (user.gender === "female")
    document.getElementById("female").checked = true;
  else document.getElementById("other").checked = true;
  editIndex = index;
}

// Name regex (only letters allowed)
let nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
// Email regex
let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// create function for inputs validation
function checkValidations() {
  // add eventListener to the inputs
  fname.addEventListener("input", function () {
    if (fname.value === "") {
      fNameError.textContent = "First name is required";
    } else if (!nameRegex.test(fname.value)) {
      fNameError.textContent = "Enter valid name";
    } else if (fname.value.length < 3) {
      fNameError.textContent = "length of name must be three";
    } else if (fname.value.length >= 3) {
      fNameError.textContent = "";
    }
  });

  // now add for lastName
  lname.addEventListener("input", function () {
    if (lname.value === "") {
      lNameError.textContent = "last name is required";
    } else if (!nameRegex.test(lname.value)) {
      lNameError.textContent = "Enter valid name";
    } else if (lname.value.length < 3) {
      lNameError.textContent = "length of name must be three";
    } else if (lname.value.length >= 3) {
      lNameError.textContent = "";
    }
  });

  //add for email
  email.addEventListener("input", function () {
    if (email.value === "") {
      emailError.textContent = "email is required";
    } else if (!emailPattern.test(email.value)) {
      emailError.textContent = "invalid email format";
    } else {
      emailError.textContent = "";
    }
  });
}
// call and check the validation before submit the form
checkValidations();

// create function for submit
submit.addEventListener("click", function (event) {
  event.preventDefault();

  let valid = true;

  // check empty fields
  if (fname.value === "") {
    fNameError.textContent = "First name is required";
    valid = false;
  }
  if (lname.value === "") {
    lNameError.textContent = "Last name is required";
    valid = false;
  }
  if (email.value === "") {
    emailError.textContent = "Email is required";
    valid = false;
  }
  let gender = "";
  if (document.getElementById("male").checked) {
    gender = document.getElementById("male").value;
  } else if (document.getElementById("female").checked) {
    gender = document.getElementById("female").value;
  } else if (document.getElementById("other").checked) {
    gender = document.getElementById("other").value;
  } else {
    genderError.textContent = "select gender";
  }

  // Check for duplicate email
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some((user, i) => user.email === email.value && i != editIndex)) {
    emailError.textContent = "Email already exists";
    valid = false;
  }
  if (valid) {
    // create user object
    let newUser = {
      firstName: fname.value,
      lastName: lname.value,
      email: email.value,
      gender: gender,
    };
    if (editIndex !== null) {
      users[editIndex] = newUser;
      editIndex = null;
      localStorage.setItem("users", JSON.stringify(users));
    } else {
      setUser(newUser);
    }

    createUser();
  }

  // clear the form after it has been submitted
  formid.reset();
});

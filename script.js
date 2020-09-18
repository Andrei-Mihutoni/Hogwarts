"use strict";

console.log("ready");

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
const expelledStudents = [];

const Student = {
  fullName: "",
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "unknown",
  imageFileName: "",
  house: "",
};

function start() {
  console.log("ready");
  loadJSON();
  modal();
  sort();
  getFilterOption();
}

function loadJSON() {
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);

  // console.table(allStudents);
  displayList(allStudents);
}

function prepareObject(jsonObject) {
  // jsonData.forEach((jsonObject) => {
  // create prototype from JSON
  const student = Object.create(Student);

  const fullNameArray = jsonObject.fullname.trim().split(" ");
  // First Name
  const [firstName] = jsonObject.fullname.trim().split(" ");
  student.firstName = firstName.charAt(0).toUpperCase() + firstName.substring(1).toLowerCase();

  function middleName() {
    if (fullNameArray.length === 3) {
      let middleName = fullNameArray[1];
      middleName = middleName.replace(/"/g, "");
      middleName = middleName.charAt(0).toUpperCase() + middleName.substr(1).toLowerCase();
      // console.log(middleName);
      student.middleName = middleName;
      // console.log(student.middleName);
    }
  }
  middleName();

  // Last name:
  const fullName = jsonObject.fullname.trim().split(" ").toString();
  const lastComma = fullName.lastIndexOf(",");
  const lastNameRaw = fullName.substring(lastComma + 1);

  student.lastName = lastNameRaw.charAt(0).toUpperCase() + lastNameRaw.substring(1).toLowerCase();

  //Gender:
  student.gender = jsonObject.gender;
  student.house = jsonObject.house.trim().charAt(0).toUpperCase() + jsonObject.house.trim().substr(1).toLowerCase();

  // Image
  student.imageFileName = getStudentImg(student.firstName, student.lastName);

  // allStudents.push(student);
  // });
  return student;
}

function displayList(students) {
  // clear the display
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // TODO: Show star ⭐ or ☆
  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=middleName]").textContent = student.middleName;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;
  // console.log(clone);

  const modal = document.getElementById("studentModal");
  clone.querySelector("#studentRow").addEventListener("click", function () {
    modal.style.display = "block";
    showModal(student);
  });

  // append clone to list
  document.querySelector("tbody").appendChild(clone);
}

function modal() {
  console.log("modal starts");
  // const openModalBtn = document.getElementById("studentRow");
  const closeModalBtn = document.getElementsByClassName("closeModal")[0];
  const modal = document.getElementById("studentModal");

  // openModalBtn.addEventListener("click", function () {
  //   modal.style.display = "block";
  // });
  closeModalBtn.onclick = function () {
    modal.style.display = "none";
    removeBtnEvents(modal);
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      removeBtnEvents(modal);
    }
  };
}

function removeBtnEvents(modal) {
  const modalContent = modal.querySelector("#modalTextBox");

  const expellBtn = modalContent.querySelector("#expellBtn"),
    expellBtnClone = expellBtn.cloneNode(true);
  expellBtn.parentNode.replaceChild(expellBtnClone, expellBtn);

  const makePrefectBtn = modalContent.querySelector("#makePrefectBtn"),
    prefectBtnClone = makePrefectBtn.cloneNode(true);
  makePrefectBtn.parentNode.replaceChild(prefectBtnClone, makePrefectBtn);

  const makeInquisitorBtn = modalContent.querySelector("#makeInquisitorBtn"),
    makeInquisitorClone = makeInquisitorBtn.cloneNode(true);
  makeInquisitorBtn.parentNode.replaceChild(makeInquisitorClone, makeInquisitorBtn);
}

function getStudentImg(firstName, lastName) {
  return lastName.toLowerCase() + "_" + firstName.toLowerCase().charAt(0);
}

function showModal(student) {
  const studentModal = document.getElementById("studentModal");
  studentModal.querySelector("[data-field=fullName]").textContent = student.firstName + " " + student.middleName + " " + student.lastName;
  studentModal.querySelector("[data-field=house]").textContent = student.house;
  studentModal.querySelector("#modalStudentImage").src = "/images/" + student.imageFileName + ".png";

  const expellBtn = studentModal.querySelector("#expellBtn");
  const makePrefectBtn = document.querySelector("#makePrefectBtn");
  const makeInquisitorBtn = document.querySelector("#makeInquisitorBtn");

  expellBtn.addEventListener("click", function () {
    const studentIndex = allStudents.findIndex((searchedStudent) => searchedStudent == student);
    if (studentIndex > -1) {
      allStudents.splice(studentIndex, 1);
      console.log(allStudents);
      console.log(studentIndex);
      expelledStudents.push(student);
      console.log(expelledStudents);
      displayList(allStudents);
    }
  });
}

function sort() {
  const sortBtns = document.querySelectorAll("[data-action=sort]");
  for (let i = 0; i < sortBtns.length; i++) {
    sortBtns[i].addEventListener("click", function () {
      sortStudents(this.dataset.sort);
    });
  }
}

function sortStudents(value) {
  if (value == "firstName") {
    allStudents.sort(sortByFirstName);
  } else if (value == "lastName") {
    allStudents.sort(sortByLastName);
  } else if (value == "middleName") {
    allStudents.sort(sortByMiddleName);
  } else if (value == "gender") {
    allStudents.sort(sortByGender);
  } else if (value == "house") {
    allStudents.sort(sortByHouse);
  }
  displayList(allStudents);
}

function sortByFirstName(a, b) {
  if (a.firstName < b.firstName) {
    return -1;
  } else {
    return 1;
  }
}

function sortByLastName(a, b) {
  if (a.lastName < b.lastName) {
    return -1;
  } else {
    return 1;
  }
}

function sortByMiddleName(a, b) {
  if (a.middleName < b.middleName) {
    return -1;
  } else {
    return 1;
  }
}

function sortByGender(a, b) {
  if (a.gender < b.gender) {
    return -1;
  } else {
    return 1;
  }
}

function sortByHouse(a, b) {
  if (a.house < b.house) {
    return -1;
  } else {
    return 1;
  }
}

function getFilterOption() {
  document.querySelector("#houseDropdown").addEventListener("input", function () {
    filterStudents(this.value);
    console.log("input works");
  });
  document.querySelector("[data-action=filter]").addEventListener("click", function () {
    displayList(allStudents);
  });
}

function filterStudents(value) {
  if (value == "expelled") {
    displayList(expelledStudents);
  } else if (value == "enrolled") {
    displayList(allStudents);
  } else if (value == "slytherin") {
    const slytherinArray = allStudents.filter(isSlytherin);
    displayList(slytherinArray);
    // allStudents.filter(isSlytherin);
  } else if (value == "gryffindor") {
    const gryffindorArray = allStudents.filter(isGryffindor);
    displayList(gryffindorArray);
  } else if (value == "ravenclaw") {
    const ravenclawArray = allStudents.filter(isRavenclaw);
    displayList(ravenclawArray);
  } else if (value == "hufflepuff") {
    const hufflepuffArray = allStudents.filter(isHufflepuff);
    displayList(hufflepuffArray);
  } else {
    displayList(allStudents);
  }
  // console.log(value);
}

function isSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}

function isGryffindor(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}

function isRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}

function isHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}

function all(student) {
  return true;
}

// const dogArray2 = animals.filter((animal) => animal.type === "dog");
// // function isDog(animal) {
// //   return animal.type === "dog";
// }

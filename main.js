const localUrl = "http://localhost:3000/users";
const remoteUrl = "https://my-json-server.typicode.com/PeterHenter/CRUD-demo";
const remoteUrl2 = "https://json.extendsclass.com/bin/57df05e23082";

const userKeys = ["id", "name", "email"];

//Get the user data from the server
function getServerData(url) {
    let fetchOptions = {
        method: "GET",
        mode: "cors",
        //cache: "no-cache"
    };

    return fetch(url, fetchOptions).then(
        response => response.json(),
        err => console.error(err)
    );
}

function createAnyElement(element, attributes) {
    let newElement = document.createElement(element);
    for (attribute in attributes) {
        newElement.setAttribute(`${attribute}`, `${attributes[attribute]}`);
        //newElement.attribute.name = newElement.attribute.value;
    }

    return newElement;
}

function populateRowWithUserData(tableRow, dataObject) {
    for (key of userKeys) {
        let newCell = document.createElement("td");
        newCell.innerHTML = dataObject[key];
        tableRow.appendChild(newCell);
    }
}

function saveChanges(callingButton) {
    //Find the row in the table, that has edited values.
    let row = callingButton.parentElement.parentElement.parentElement;

    //Creating a JSON array from the values in the row.
    let userData = {};
    let index = parseInt(row.firstElementChild.innerHTML);
    //userData.id = index;
    userData.name = row.children[1].firstElementChild.value;
    userData.email = row.children[2].firstElementChild.value;
    userData = JSON.stringify(userData);

    //Update the data on the server
    let fetchOptions = {
        method: "PUT",
        mode: "cors",
        //cache: "no-cache",
        headers: { 'Content-Type': 'application/json' },
        body: userData
    }
    fetch(remoteUrl2 + `/${index}`, fetchOptions).then(response => response.json);

    console.log(userData);

    return false;
}

function makeRowEditable(button) {
    //Find the row in the table, that the user wants to edit.
    let row = button.parentElement.parentElement.parentElement;

    //Replace the plain text in the Name and Email columns with input fields.
    for (i = 2; i < 4; i++) {
        let cellToEdit = row.querySelector(`:nth-child(${i})`);
        let cellValue = cellToEdit.innerHTML;

        let newCell = createAnyElement("input", { type: "text", class: "form-control", value: cellValue });

        cellToEdit.innerHTML = "";
        cellToEdit.appendChild(newCell);
    }

    //Change the clicked on Edit button to a Save button.
    let saveButton = createAnyElement("button", { type: "button", class: "btn btn-success", onclick: "saveChanges(this)" });
    let saveButtonIcon = createAnyElement("i", { class: "fas fa-check" });
    saveButton.appendChild(saveButtonIcon);
    button.replaceWith(saveButton);

    //Disable all the other buttons in the table.
    let otherButtons = document.querySelectorAll(`#userTable tbody button:not([class*="btn-success"])`);
    otherButtons.forEach((currentValue) => currentValue.setAttribute("disabled", "true"));
}

function addButtonsToTheRow(tableRow) {
    let newCell = document.createElement("td");
    let buttonGroup = createAnyElement("div", { class: "btn-group" });
    let editButton = createAnyElement("button", { type: "button", class: "btn btn-secondary", onclick: "makeRowEditable(this)" });
    let editButtonIcon = createAnyElement("i", { class: "far fa-edit" });
    editButton.appendChild(editButtonIcon);
    buttonGroup.appendChild(editButton);
    newCell.appendChild(buttonGroup);
    tableRow.appendChild(newCell);
}

function populateTableBody(table, dataObjectArray) {
    let tableBody = table.querySelector("tbody");

    if (tableBody.childElementCount > 0) {
        tableBody.remove();
        let blankTableBody = document.createElement("tbody");
        table.appendChild(blankTableBody);
        tableBody = table.querySelector("tbody");
        //tableBody = table.appendChild(blankTableBody);
    }

    for (let dataObject of dataObjectArray) {
        let newRow = document.createElement("tr");
        populateRowWithUserData(newRow, dataObject);
        addButtonsToTheRow(newRow);
        tableBody.appendChild(newRow);
    }
}

async function populateUserTable() {
    let userTable = document.querySelector("#userTable");

    /*getServerData(localUrl).then(
        data => populateTableBody(userTable, data)
    );*/
    let data = await getServerData(remoteUrl2);
    populateUserTableBody(userTable, data);
}

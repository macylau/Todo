
let container = document.getElementById('container');

let title = document.createElement('h1');
title.textContent = 'Todo List';

let inputFieldDiv = document.createElement('div');
inputFieldDiv.classList.add('inputField');

let inputElement = document.createElement('input');
inputElement.type = 'text';
inputElement.id = 'newTask';
inputElement.placeholder = 'Enter new task';

let buttonElement = document.createElement('button');

let addIcon = document.createElement('i');
addIcon.classList.add('fas', 'fa-plus');

buttonElement.appendChild(addIcon);

inputFieldDiv.appendChild(inputElement);
inputFieldDiv.appendChild(buttonElement);




container.appendChild(title);
container.appendChild(inputFieldDiv);
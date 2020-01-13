const electron = require('electron');
const {ipcRenderer} = electron;

const ul = document.querySelector('ul');
const dragWindow = document.getElementById('dragWindow');
const closeApp = document.getElementById('close');
const itemInput = document.getElementById('item');

const form = document.querySelector('input');
form.addEventListener('keypress', submitForm);

var oldX = window.screenX,
    oldY = window.screenY;

setInterval(function(){
  if(oldX != window.screenX || oldY !=window.screenY){
    const position = {
        x: window.screenX,
        y: window.screenY
    };

    // saving window position
    ipcRenderer.send('window:position', position);
  } 
}, 500);


// function to submit form
function submitForm(e){
    if (e.key === 'Enter') {
        if((itemInput.value).length === 0){
            e.preventDefault();
        }
        else{
            const item = document.querySelector('#item').value;
            ipcRenderer.send('item:add', item);
            itemInput.value = "";
            e.preventDefault();
        }
      }
}

// handle close app
closeApp.addEventListener('click', () => {
    ipcRenderer.send('app:close')
});


// catch add item
ipcRenderer.on('item:add', function(e, todo){
    const li = document.createElement('li');
    const checked = todo.isCompleted ? "checked" : "";
    const lineThrough = todo.isCompleted ? "line-through" : "";
    li.setAttribute("id", todo.id)
    li.innerHTML ='<div class="form-check '+lineThrough+'"> <label class="form-check-label show-todo"> <input class="checkbox" id="'+todo.id+'" type="checkbox" '+checked+'></input> '+todo.item+' <i class="input-helper"></i></label> </div> <i class="remove mdi mdi-close-circle-outline"></i>';
    ul.appendChild(li);
});

// catch get todos
ipcRenderer.on('todos:show', function(e, todos){
    
    ul.innerHTML=""
    todos.forEach(function(todo) {
        const li = document.createElement('li');
        const checked = todo.isCompleted ? "checked" : "";
        const lineThrough = todo.isCompleted ? "line-through" : "";
        li.setAttribute("id", todo.id)
        li.innerHTML ='<div class="form-check '+lineThrough+'"> <label class="form-check-label show-todo"> <input class="checkbox" id="'+todo.id+'" type="checkbox" '+checked+'></input> '+todo.item+' <i class="input-helper"></i></label> </div> <i class="remove mdi mdi-close-circle-outline"></i>';
        ul.appendChild(li);
    });
});

// =add a click listener to list items
ul.addEventListener("click", function(e) {
	// e.target is the clicked element!
	// If it was a list item
	if(e.target && e.target.nodeName == "I") {
        const className = e.target.className;
        // if the targeted item is clicked then remove it
        if(className.includes("remove")){
            removeItem(e.target.parentElement.id);
        }
		
    }

    // update status 
    if(e.target && e.target.nodeName == "INPUT") {
        const id = e.target.id;
        ipcRenderer.send('todos:updateStatus', id)
	}
});


// removing single item
function removeItem(id){
   ipcRenderer.send('todos:delete', id)
}
const UNCOMPLETED_LIST_TODO_ID = "todos";
const COMPLETED_LIST_TODO_ID = "completed-todos";
const TODO_ITEMID = "itemId";

function addTodo(){
    const uncompletedToDo = document.getElementById(UNCOMPLETED_LIST_TODO_ID);

    const textTodo = document.getElementById("title").value;
    const timeStamp = document.getElementById('date').value;
   
    const todo = makeToDo(textTodo, timeStamp, false);
    const todoObject = composeTodoObject(textTodo, timeStamp, false);
    todo[TODO_ITEMID] = todoObject.id;
    todos.push(todoObject);

    uncompletedToDo.append(todo);
    updateDataToStorage();
}

function makeToDo(data, timestamp, isCompleted){
    const textTitle = document.createElement("h2");
    textTitle.innerText = data;

    const textTimestamp = document.createElement("p");
    textTimestamp.innerText = timestamp;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(textTitle, textTimestamp);

    const container = document.createElement("div");
    container.classList.add("shadow", "item");
    container.append(textContainer);

    if (isCompleted) {
        container.append(createUndoButton());
        container.append(createTrashButton());
    }
    else container.append(createCheckButton());
    return container;
}

function createButton(buttonType, eventListener){
    const button = document.createElement("button");
    button.classList.add(buttonType);
    button.addEventListener("click", function(event){
        eventListener(event);
    });
    return button;
}

function createCheckButton(){
    return createButton("check-button", function(event){
        addTaskToCompleted(event.target.parentElement);
    });
}

function createTrashButton(){
    return createButton("trash-button", function(event){
        removeTaskFromCompleted(event.target.parentElement);
    });
}

function createUndoButton(){
    return createButton("undo-button", function(event){
        undoTaskFromCompleted(event.target.parentElement);
    });
}

function addTaskToCompleted(task){
    const taskTitle = task.querySelector(".inner > h2").innerText;
    const taskTimestamp = task.querySelector(".inner > p").innerText;

    const newTodo = makeToDo(taskTitle, taskTimestamp, true);
    const listCompleted = document.getElementById(COMPLETED_LIST_TODO_ID);
    listCompleted.append(newTodo);

    const todo = findTodo(task[TODO_ITEMID]);
    todo.isCompleted = true;
    newTodo[TODO_ITEMID] = todo.id;

    task.remove();
    updateDataToStorage();
}

function removeTaskFromCompleted(task){
    const todoPosition = findTodoIndex(task[TODO_ITEMID]);
    todos.splice(todoPosition, 1);

    task.remove();
    updateDataToStorage();
}

function undoTaskFromCompleted(task){
    const listCompleted = document.getElementById(COMPLETED_LIST_TODO_ID);
    const taskTitle = task.querySelector(".inner > h2").innerText;
    const taskTimestamp = task.querySelector(".inner > p").innerText;

    const newTodo = makeToDo(taskTitle, taskTimestamp, false);
    
    const todo = findTodo(task[TODO_ITEMID]);
    todo.isCompleted = false;
    newTodo[TODO_ITEMID] = todo.id;

    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_TODO_ID);
    listUncompleted.append(newTodo);

    task.remove();
    updateDataToStorage();
}


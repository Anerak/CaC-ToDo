var tasks = [];
window.addEventListener('load', function (e) {
    if (localStorage) {
        var retrievedTasks = localStorage.getItem('tasks');
        if (retrievedTasks) {
            for (var _i = 0, _a = JSON.parse(retrievedTasks); _i < _a.length; _i++) {
                var task = _a[_i];
                tasks.push(task);
            }
            addTaskToPage(tasks);
        }
    }
});
function saveTasks(taskList) {
    localStorage.setItem('tasks', JSON.stringify(taskList));
}
function generateID() {
    var newID = Math.random().toString(16).substring(2);
    if (tasks.filter(function (t) { return t.id === newID; }).length)
        generateID();
    return newID;
}
/**
 * Receives an event, adds a task to the tasks array.
 * @param {Event} e
 */
function addTask(e) {
    e.preventDefault();
    var form = e.target;
    var taskContentElement = form.children.namedItem('taskContent');
    if (taskContentElement.value.length < 4 ||
        taskContentElement.value.length > 50)
        return;
    var taskID = generateID();
    tasks.push({
        active: true,
        content: taskContentElement.value,
        id: taskID
    });
    saveOrEmptyTasks(tasks);
    taskContentElement.value = '';
    addTaskToPage(tasks);
}
function deleteTask(e) {
    var parentDiv = e.parentNode;
    tasks[tasks.findIndex(function (t) { return t.id === parentDiv.getAttribute('data-id'); })].active = false;
    saveOrEmptyTasks(tasks);
    addTaskToPage(tasks);
}
function addTaskToPage(taskList, activeOnly) {
    if (activeOnly === void 0) { activeOnly = true; }
    var tasksEl = document.querySelector('.tasks');
    var newHtml = '';
    for (var _i = 0, taskList_1 = taskList; _i < taskList_1.length; _i++) {
        var task = taskList_1[_i];
        if (!task.active && activeOnly)
            continue;
        newHtml += "\n\t\t<div class=\"task\" data-id=\"" + task.id + "\">\n\t\t\t<button class=\"btn btn-delete\" onclick=\"deleteTask(this)\">X</button>\n\t\t\t<span class=\"task-text\">" + task.content + "</span>\n\t\t</div>\n\t\t";
    }
    if (newHtml.length === 0)
        newHtml = '<h2>No tasks to display :(</h2>';
    tasksEl.innerHTML = newHtml;
}
function saveOrEmptyTasks(taskList) {
    if (taskList.filter(function (t) { return t.active; }).length === 0) {
        saveTasks([]);
        tasks.length = 0;
    }
    else {
        saveTasks(taskList);
    }
}
document.querySelector('form.task-form').addEventListener('submit', addTask);

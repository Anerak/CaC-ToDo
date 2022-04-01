const tasks: any[] = [];

window.addEventListener('load', (e) => {
	if (localStorage) {
		let retrievedTasks = localStorage.getItem('tasks');
		if (retrievedTasks) {
			for (let task of JSON.parse(retrievedTasks)) {
				tasks.push(task);
			}
			addTaskToPage(tasks);
		}
	}
});

function saveTasks(taskList: any[]) {
	localStorage.setItem('tasks', JSON.stringify(taskList));
}

function generateID() {
	let newID = Math.random().toString(16).substring(2);
	if (tasks.filter((t) => t.id === newID).length) generateID();
	return newID;
}

/**
 * Receives an event, adds a task to the tasks array.
 * @param {Event} e
 */
function addTask(e: Event) {
	e.preventDefault();
	let form = e.target as HTMLFormElement;

	let taskContentElement = form.children.namedItem(
		'taskContent'
	) as HTMLInputElement;
	if (
		taskContentElement.value.length < 4 ||
		taskContentElement.value.length > 50
	)
		return;

	let taskID: string = generateID();

	tasks.push({
		active: true,
		content: taskContentElement.value,
		id: taskID,
	});

	saveOrEmptyTasks(tasks);

	taskContentElement.value = '';

	addTaskToPage(tasks);
}

function deleteTask(e: HTMLButtonElement) {
	let parentDiv: HTMLDivElement = e.parentNode as HTMLDivElement;
	tasks[
		tasks.findIndex((t) => t.id === parentDiv.getAttribute('data-id'))
	].active = false;
	saveOrEmptyTasks(tasks);
	addTaskToPage(tasks);
}

function addTaskToPage(taskList: any[], activeOnly: boolean = true): void {
	let tasksEl: HTMLDivElement = document.querySelector('.tasks');

	let newHtml = '';

	for (let task of taskList) {
		if (!task.active && activeOnly) continue;
		newHtml += `
		<div class="task" data-id="${task.id}">
			<button class="btn btn-delete" onclick="deleteTask(this)">X</button>
			<span class="task-text">${task.content}</span>
		</div>
		`;
	}
	if (newHtml.length === 0) newHtml = '<h2>No tasks to display :(</h2>';

	tasksEl.innerHTML = newHtml;
}

function saveOrEmptyTasks(taskList: any[]): void {
	if (taskList.filter((t) => t.active).length === 0) {
		saveTasks([]);
		tasks.length = 0;
	} else {
		saveTasks(taskList);
	}
}

document.querySelector('form.task-form').addEventListener('submit', addTask);

let InputPanel;
let exapndMoreIcon;
let titleInput;
let weekInput;
let btnAddOrSave;
let actionIcons;
let card;
let title;
let weekInfo;
let dragged = null;
let states;
let toolTip;

const main = () => {
	prepareDOMElements();
	prepareDOMEvents();
};

const prepareDOMElements = () => {
	exapndMoreIcon = document.querySelector('.expand-more-icon');
	InputPanel = document.querySelector('.inputPanel');

	titleInput = InputPanel.querySelector("input[type='text']");
	weekInput = InputPanel.querySelector("input[type='week']");
	btnAddOrSave = InputPanel.querySelector('.btn-add');

	states = document.querySelectorAll('[data-place]');
	actionIcons = document.querySelectorAll('.action-icon div');
};

const prepareDOMEvents = () => {
	exapndMoreIcon.addEventListener('click', showInputPanel);
	btnAddOrSave.addEventListener('click', saveChangesOrAddNewTask);
	InputPanel.addEventListener('keydown', enterKey);
	actionIcons.forEach((actionIcon) => {
		actionIcon.addEventListener('click', checkClickMenu);
	});

	document.addEventListener('dragstart', changeStateStart);
	states.forEach((state) => {
		state.addEventListener('dragover', changeStateTarget);
		state.addEventListener('drop', chageStateStop);
	});
};

const showInputPanel = (e) => {
	InputPanel.classList.toggle('hide');

	if (toolTip) {
		removeToolTip();
	}

	if (InputPanel.classList.contains('hide')) {
		exapndMoreIcon.style.transform = 'rotate(0deg)';
	} else {
		exapndMoreIcon.style.transform = 'rotate(-180deg)';

		if (e.target.matches('.edit')) {
			title = card.querySelector('.dscrpt');
			weekInfo = card.querySelector('.week');
			titleInput.value = title.textContent;
			weekInput.value =
				weekInfo !== null
					? '2023-W' + weekInfo.textContent.match(/[0-9][0-9]$/)
					: '';
			btnAddOrSave.textContent = 'Zapisz';
		} else {
			btnAddOrSave.textContent = 'Dodaj';
			titleInput.value = '';
			weekInput.value = '';
		}
	}
};

const saveChangesOrAddNewTask = () => {
	if (titleInput.value === '') {
		createToolTip();
		return;
	}

	if (btnAddOrSave.textContent === 'Zapisz') {
		saveChanges();
	} else {
		addNewTask();
	}

	showInputPanel();
};

const createToolTip = () => {
	toolTip = document.createElement('div');
	toolTip.classList.add('toolTip');
	toolTip.textContent = 'Wpisz tytuł zadania!';
	toolTip.style.opacity = '1';
	InputPanel.appendChild(toolTip);
	console.log('aaa');
};
const removeToolTip = () => {
	toolTip.remove();
};

const checkCurrentWeekNumber = () => {
	const currentDay = new Date();
	const currentYear = currentDay.getFullYear();
	const firstJanuary = new Date(`${currentYear}-01-01`);

	dayOfYear = Math.round(
		(currentDay.getTime() - firstJanuary.getTime()) / (3600 * 24 * 1000)
	);
	console.log(dayOfYear);

	let currentWeekNumber = Math.floor(dayOfYear / 7);
	console.log(currentWeekNumber);

	if (firstJanuary.getDay() < 5) {
		currentWeekNumber += 1;
	}
	console.log(currentWeekNumber);
	return currentWeekNumber;
};

const addNewTask = () => {
	/*  <div class="card">
                    <div class="line bgc-blue"></div>
                    <div class="info">
                        <div class="dscrpt">Przygotowanie dokumentacji projektu X</div>
                        <div class="week">
                            <p>Tydzień 35</p>
                        </div>
                    </div>
                    <div class="action-icon">
                        <div>
                            <span class="edit material-symbols-outlined">edit</span>
                            <span class="delete material-symbols-outlined">delete</span>
                        </div>
                    </div>
                </div>
    */

	const cardClass = document.createElement('div');
	cardClass.classList.add('card');
	cardClass.setAttribute('draggable', true);

	states[0].appendChild(cardClass);

	const lineClass = document.createElement('div');
	lineClass.classList.add('line');
	lineClass.classList.add('bgc-blue');

	const infoClass = document.createElement('div');
	infoClass.classList.add('info');

	cardClass.append(lineClass, infoClass);

	const titleClass = document.createElement('div');
	titleClass.classList.add('dscrpt');

	titleClass.textContent = titleInput.value;
	titleClass.setAttribute('title', titleClass.textContent);
	infoClass.appendChild(titleClass);

	const weekClass = document.createElement('div');
	weekClass.classList.add('week');

	weekClass.textContent =
		weekInput.value !== ''
			? 'Tydzień ' + weekInput.value.match(/[0-9][0-9]$/)
			: '';
	infoClass.append(weekClass);

	const actionIconClass = document.createElement('div');
	actionIconClass.classList.add('action-icon');

	cardClass.appendChild(actionIconClass);

	const divWithBtn = document.createElement('div');
	actionIconClass.appendChild(divWithBtn);

	const btnEdit = document.createElement('span');
	btnEdit.classList.add('edit');
	btnEdit.classList.add('material-symbols-outlined');
	btnEdit.textContent = 'edit';

	const btnDelete = document.createElement('span');
	btnDelete.classList.add('delete');
	btnDelete.classList.add('material-symbols-outlined');
	btnDelete.textContent = 'delete';

	divWithBtn.append(btnEdit, btnDelete);

	if (weekInput.value !== '') {
		checkWeekNumber(cardClass);
	}
	main();

	titleInput.value = '';
	weekInput.value = '';
};

const enterKey = (e) => {
	if (e.key === 'Enter') {
		saveChangesOrAddNewTask();
	}
};

const checkClickMenu = (e) => {
	card = e.target.closest('.card');
	if (e.target.matches('.edit')) {
		showInputPanel(e);
	} else if (e.target.matches('.delete')) {
		card.remove();
	}
};

const saveChanges = () => {
	title.textContent = titleInput.value;
	title.setAttribute('title', title.textContent);
	titleInput.value = '';
	if (weekInput.value !== null) {
		weekInfo.textContent = 'Tydzień ' + weekInput.value.match(/[0-9][0-9]$/);
		checkWeekNumber(card);
	} else {
		weekInfo.textContent = '';
	}
	btnAddOrSave.textContent = 'Dodaj';
};

const checkWeekNumber = (card) => {
	const currentWeekNumber = checkCurrentWeekNumber();
	const additionalInfoIcon = card.querySelector('.action-icon');
	let warningIcon = additionalInfoIcon.querySelector('.red');

	let week = card.querySelector('.week');

	week = week.textContent.match(/[0-9][0-9]$/);

	if (currentWeekNumber >= week[0]) {
		if (!warningIcon) {
			warningIcon = document.createElement('span');
			warningIcon.classList.add('material-symbols-outlined');
			warningIcon.classList.add('red');
			warningIcon.textContent = 'priority_high';

			additionalInfoIcon.appendChild(warningIcon);
		}

		// <span class="material-symbols-outlined red">priority_high</span>
	} else {
		if (warningIcon) {
			warningIcon.remove();
		}
	}
};

const changeStateStart = (e) => {
	card = e.target.closest('.card');
	const startDragAndDrop = e.target.closest('[data-place]');
	if (card) {
		dragged = e.target;
	}
};
const changeStateTarget = (e) => {
	e.preventDefault();
};
const chageStateStop = (e) => {
	e.preventDefault();
	const targetDragAndDrop = e.target.closest('[data-place]');

	if (targetDragAndDrop) {
		dragged.parentNode.removeChild(dragged);
		targetDragAndDrop.appendChild(dragged);
		changeCardColor(targetDragAndDrop);
	}
};

const changeCardColor = (targetDragAndDrop) => {
	const dataPlaceTarget = targetDragAndDrop.getAttribute('data-place');
	const lineColor = dragged.querySelector('.line');

	switch (dataPlaceTarget) {
		case '1':
			lineColor.classList.replace(lineColor.classList[1], 'bgc-blue');
			break;
		case '2':
			lineColor.classList.replace(lineColor.classList[1], 'bgc-purple');
			break;
		case '3':
			lineColor.classList.replace(lineColor.classList[1], 'bgc-turquoise');
			break;
	}
};

document.addEventListener('DOMContentLoaded', main);

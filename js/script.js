let InputPanel;
let exapndMoreIcon;
let actionIcons;
let card;
let titleInput;
let weekInput;
let toolTip;
let dragged = null;
let states;
let arrowIcons;

const main = () => {
	prepareDOMElements();
	prepareDOMEvents();
};

const prepareDOMElements = () => {
	exapndMoreIcon = document.querySelector('.expand-more-icon');
	InputPanel = document.querySelector('.inputPanel');

	titleInput = InputPanel.children.title; //InputPanel.querySelector("input[type='text']");
	weekInput = InputPanel.children.week; //InputPanel.querySelector("input[type='week']");

	states = document.querySelectorAll('[data-place]');
	actionIcons = document.querySelectorAll('.action-icon div');

	arrowIcons = document.querySelectorAll('.arrow');
};

const prepareDOMEvents = () => {
	exapndMoreIcon.addEventListener('click', showInputPanel);

	InputPanel.addEventListener('keydown', enterKey);
	actionIcons.forEach((actionIcon) => {
		actionIcon.addEventListener('click', additionalCardActions);
	});

	arrowIcons.forEach((arrowIcon) => {
		arrowIcon.addEventListener('click', clickArrowIcon);
	});

	document.addEventListener('dragstart', changeStateStart);
	states.forEach((state) => {
		state.addEventListener('dragover', changeStateTarget);
		state.addEventListener('drop', changeStateStop);
	});
};

const createInputPanel = (e) => {
	if (toolTip) {
		removeToolTip();
	}

	const btnSave = InputPanel.querySelector('.btn-add');
	exapndMoreIcon.style.transform = 'rotate(-180deg)';
	InputPanel.classList.remove('hide');

	if (e.target.matches('.edit')) {
		const title = card.querySelector('.dscrpt');
		const week = card.querySelector('.week');
		titleInput.value = title.textContent;
		weekInput.value =
			week !== null ? '2023-W' + week.textContent.match(/[0-9][0-9]$/) : '';
		btnSave.textContent = 'Zapisz';
	} else {
		btnSave.textContent = 'Dodaj';
		titleInput.value = '';
		InputPanel.children.week.value = '';
	}
	btnSave.addEventListener('click', saveChanges);
};

const hideInputPanel = () => {
	exapndMoreIcon.style.transform = 'rotate(0deg)';
	InputPanel.classList.add('hide');
};

const showInputPanel = (e) => {
	if (InputPanel.classList.contains('hide')) {
		createInputPanel(e);
	} else {
		hideInputPanel();
	}
};

const saveChanges = (btnSave) => {
	if (titleInput.value === '') {
		createToolTip();
		return;
	}

	if (btnSave.target.textContent === 'Dodaj') {
		addTask();
	} else if (btnSave.target.textContent === 'Zapisz') {
		editTask();
		btnSave.target.textContent = 'Dodaj';
	}

	hideInputPanel();
};

const createToolTip = () => {
	toolTip = document.createElement('div');
	toolTip.classList.add('toolTip');
	toolTip.textContent = 'Wpisz tytuł zadania!';
	toolTip.style.opacity = '1';
	InputPanel.appendChild(toolTip);
};
const removeToolTip = () => {
	toolTip.remove();
};

const checkCurrentWeekNumber = () => {
	let currentWeekNumber;

	const currentDay = new Date();
	const currentYear = currentDay.getFullYear();
	const firstJanuary = new Date(`${currentYear}-01-01`);

	dayOfYear = Math.round(
		(currentDay.getTime() - firstJanuary.getTime()) / (3600 * 24 * 1000)
	);
	console.log(dayOfYear);

	console.log(`modulo: ` + (dayOfYear % 7));

	if (dayOfYear % 7 === 0) {
		currentWeekNumber = dayOfYear / 7 - 1;
	} else {
		currentWeekNumber = Math.floor(dayOfYear / 7);
	}
	if (firstJanuary.getDay() < 5) {
		currentWeekNumber += 1;
	}

	console.log(currentWeekNumber);
	return currentWeekNumber;
};

const addTask = () => {
	const card = document.createElement('div');
	card.classList.add('card');
	card.setAttribute('draggable', true);

	states[0].appendChild(card);

	const line = document.createElement('div');
	line.classList.add('line');
	line.classList.add('bgc-blue');

	const info = document.createElement('div');
	info.classList.add('info');

	card.append(line, info);

	const title = document.createElement('div');
	title.classList.add('dscrpt');

	title.textContent = titleInput.value;
	title.setAttribute('title', title.textContent);
	info.appendChild(title);

	const week = document.createElement('div');
	week.classList.add('week');

	week.textContent =
		weekInput.value !== ''
			? 'Tydzień ' + InputPanel.children.week.value.match(/[0-9][0-9]$/)
			: '';
	info.append(week);

	const actionIcon = document.createElement('div');
	actionIcon.classList.add('action-icon');

	card.appendChild(actionIcon);

	const divWithBtn = document.createElement('div');
	actionIcon.appendChild(divWithBtn);

	const btnEdit = document.createElement('span');
	btnEdit.classList.add('edit');
	btnEdit.classList.add('material-symbols-outlined');
	btnEdit.textContent = 'edit';
	btnEdit.title = 'Edytuj';

	const btnDelete = document.createElement('span');
	btnDelete.classList.add('delete');
	btnDelete.classList.add('material-symbols-outlined');
	btnDelete.textContent = 'delete';
	btnDelete.title = 'Usuń';

	divWithBtn.append(btnEdit, btnDelete);

	const divWithArrowBtn = document.createElement('div');
	divWithArrowBtn.classList.add('arrow');
	actionIcon.appendChild(divWithArrowBtn);

	btnArrow = createArrows().forward;

	divWithArrowBtn.appendChild(btnArrow);

	if (weekInput.value !== '') {
		addWarningColorToWeekNumber(week);
	}
	main();

	titleInput.value = '';
	InputPanel.children.week.value = '';
};

const enterKey = (e) => {
	if (e.key === 'Enter') {
		saveChanges();
	}
};

const additionalCardActions = (e) => {
	card = e.target.closest('.card');
	if (e.target.matches('.edit')) {
		createInputPanel(e);
	} else if (e.target.matches('.delete')) {
		card.remove();
	}
};

const editTask = () => {
	const title = card.querySelector('.dscrpt');
	const week = card.querySelector('.week');

	title.textContent = titleInput.value;
	title.setAttribute('title', title.textContent);
	titleInput.value = '';
	if (weekInput.value !== null) {
		week.textContent =
			'Tydzień ' + InputPanel.children.week.value.match(/[0-9][0-9]$/);
		addWarningColorToWeekNumber(week);
	} else {
		weekInput.textContent = '';
	}
};

const addWarningColorToWeekNumber = (week) => {
	const currentWeekNumber = checkCurrentWeekNumber();

	const warningColor = week.classList.contains('warning-color');
	const weekNumber = week.textContent.match(/[0-9][0-9]$/);

	if (!warningColor && currentWeekNumber >= weekNumber[0]) {
		week.classList.add('warning-color');
	} else {
		week.classList.remove('warning-color');
	}
};

const changeStateStart = (e) => {
	card = e.target.closest('.card');
	if (card) {
		dragged = e.target;
	}
};
const changeStateTarget = (e) => {
	e.preventDefault();
};
const changeStateStop = (e) => {
	e.preventDefault();
	const targetDragAndDrop = e.target.closest('[data-place]');

	if (targetDragAndDrop) {
		dragged.parentNode.removeChild(dragged);
		targetDragAndDrop.appendChild(dragged);

		changeState(targetDragAndDrop.getAttribute('data-place'), dragged);
	}
};

function createArrows() {
	const back = document.createElement('span');
	back.classList.add('material-symbols-outlined');
	back.textContent = 'arrow_back';
	back.title = 'Przesuń w lewo';

	const forward = document.createElement('span');
	forward.classList.add('material-symbols-outlined');
	forward.textContent = 'arrow_forward';
	forward.title = 'Przesuń w prawo';

	return { back: back, forward: forward };
}

const changeState = (state, card) => {
	const lineColor = card.querySelector('.line');
	const arrowIcon = card.querySelector('.arrow');

	arrows = createArrows();

	while (arrowIcon.children[0]) {
		arrowIcon.removeChild(arrowIcon.children[0]);
	}

	switch (parseInt(state)) {
		case 1:
			lineColor.classList.replace(lineColor.classList[1], 'bgc-blue');
			arrowIcon.appendChild(arrows.forward);
			break;

		case 2:
			lineColor.classList.replace(lineColor.classList[1], 'bgc-purple');
			arrowIcon.append(arrows.back, arrows.forward);
			break;

		case 3:
			lineColor.classList.replace(lineColor.classList[1], 'bgc-turquoise');
			arrowIcon.appendChild(arrows.back);
			break;
	}
};

const clickArrowIcon = (e) => {
	let target;
	const dataPlace = e.target
		.closest('.bcg-card-board')
		.getAttribute('data-place');

	const arrowIconType = e.target.textContent;

	if (arrowIconType === 'arrow_forward') {
		target = parseInt(dataPlace) + 1;
	} else if (arrowIconType === 'arrow_back') {
		target = dataPlace - 1;
	}

	if (target) {
		const targetPlace = document.querySelector(`[data-place="` + target + `"]`);
		card.parentNode.removeChild(card);
		targetPlace.appendChild(card);
	}
	changeState(target, card);
};

document.addEventListener('DOMContentLoaded', main);

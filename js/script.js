import { createElementAndAddClassList } from './additionalFunctions.js';

let InputPanel;
let exapndMoreIcon;
let addNewTaskBtn;
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
	exapndMoreIcon = document.querySelector('.card__expand-more-panel--button');
	addNewTaskBtn = document.querySelector('.board_button--add');
	InputPanel = document.querySelector('.form-panel');

	titleInput = InputPanel.children.title; //InputPanel.querySelector("input[type='text']");
	weekInput = InputPanel.children.week; //InputPanel.querySelector("input[type='week']");

	states = document.querySelectorAll('[data-place]');
	actionIcons = document.querySelectorAll('.action__buttons');

	arrowIcons = document.querySelectorAll('.arrow');
};

const prepareDOMEvents = () => {
	exapndMoreIcon.addEventListener('click', showInputPanel);
	addNewTaskBtn.addEventListener('click', showInputPanel);

	InputPanel.addEventListener('keydown', enterKey);
	actionIcons.forEach((actionIcon) => {
		actionIcon.addEventListener('click', additionalCardActions);
	});

	arrowIcons.forEach((arrowIcon) => {
		arrowIcon.addEventListener('click', clickArrowIcon);
	});

	InputPanel.addEventListener(
		'submit',
		function (evt) {
			evt.preventDefault();
			saveChanges();
		},
		{ capture: true }
	);

	document.addEventListener('dragstart', changeStateStart);
	states.forEach((state) => {
		state.addEventListener('dragover', changeStateTarget);
		state.addEventListener('drop', changeStateStop);
	});
};

const createToolTip = () => {
	toolTip = createElementAndAddClassList('div', ['input__toolTip']);
	toolTip.textContent = 'Wpisz tytuł zadania!';
	//toolTip.style.opacity = '1';
	InputPanel.appendChild(toolTip);
};

const createInputPanel = (e) => {
	if (toolTip) {
		toolTip.remove();
	}

	const btnSave = InputPanel.querySelector('.form-panel__button');
	exapndMoreIcon.style.transform = 'rotate(-180deg)';
	InputPanel.classList.remove('hide');

	if (e.target.matches('.action__buttons--edit')) {
		const title = card.querySelector('.info__dscrpt');
		const week = card.querySelector('.info__week');
		titleInput.value = title.textContent;
		weekInput.value =
			week.textContent !== ''
				? '2023-W' + week.textContent.match(/[0-9][0-9]$/)
				: '';

		btnSave.textContent = 'Zapisz';
	} else {
		btnSave.textContent = 'Dodaj';
		titleInput.value = '';
		weekInput.value = '';
	}
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

function saveChanges() {
	const btnSave = InputPanel.querySelector('.form-panel__button');
	if (titleInput.value === '') {
		createToolTip();
		return;
	}

	if (btnSave.textContent === 'Dodaj') {
		addTask();
	} else if (btnSave.textContent === 'Zapisz') {
		editTask();
		btnSave.textContent = 'Dodaj';
	}

	hideInputPanel();
}

const addTask = () => {
	const ulList = states[0].querySelector('ul');
	const card = createElementAndAddClassList('li', ['card']);
	card.setAttribute('draggable', true);
	ulList.appendChild(card);

	const line = createElementAndAddClassList('div', [
		'card__line',
		'card__line--blue',
	]);
	const info = createElementAndAddClassList('div', ['card__info']);
	card.append(line, info);

	const title = createElementAndAddClassList('p', ['info__dscrpt']);
	title.textContent = titleInput.value;
	title.setAttribute('title', title.textContent);
	info.appendChild(title);

	const week = createElementAndAddClassList('time', ['info__week']);
	week.textContent =
		weekInput.value !== ''
			? 'Tydzień ' + InputPanel.children.week.value.match(/[0-9][0-9]$/)
			: '';
	info.append(week);

	const actionIcon = createElementAndAddClassList('div', ['card__action']);
	card.appendChild(actionIcon);

	const divWithBtn = createElementAndAddClassList('div', ['action__buttons']);
	actionIcon.appendChild(divWithBtn);

	const btnEdit = createElementAndAddClassList('button', [
		'action__button',
		'action__buttons--edit',
		'material-symbols-outlined',
	]);
	btnEdit.textContent = 'edit';
	btnEdit.title = 'Edytuj';

	const btnDelete = createElementAndAddClassList('button', [
		'action__button',
		'action__buttons--delete',
		'material-symbols-outlined',
	]);
	btnDelete.textContent = 'delete';
	btnDelete.title = 'Usuń';

	divWithBtn.append(btnEdit, btnDelete);

	const divWithArrowBtn = createElementAndAddClassList('div', ['arrow']);
	actionIcon.appendChild(divWithArrowBtn);

	const btnArrow = createArrows().forward;

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
	if (e.target.matches('.action__buttons--edit')) {
		createInputPanel(e);
	} else if (e.target.matches('.action__buttons--delete')) {
		card.remove();
	}
};

const editTask = () => {
	const title = card.querySelector('.info__dscrpt');
	const week = card.querySelector('.info__week');

	title.textContent = titleInput.value;
	title.setAttribute('title', title.textContent);
	titleInput.value = '';

	if (weekInput.value !== '') {
		week.textContent =
			'Tydzień ' + InputPanel.children.week.value.match(/[0-9][0-9]$/);
		addWarningColorToWeekNumber(week);
	} else {
		weekInput.value = '';
	}
};

const addWarningColorToWeekNumber = (week) => {
	const currentWeekNumber = checkCurrentWeekNumber();

	const warningColor = week.classList.contains('info__week--warning');
	const weekNumber = week.textContent.match(/[0-9][0-9]$/);

	if (!warningColor && currentWeekNumber >= weekNumber[0]) {
		week.classList.add('info__week--warning');
	} else {
		week.classList.remove('info__week--warning');
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
	const dataPlace = e.target.closest('[data-place]');
	const targetDragAndDrop = dataPlace.querySelector('ul');

	if (targetDragAndDrop) {
		dragged.parentNode.removeChild(dragged);
		targetDragAndDrop.appendChild(dragged);

		changeState(dataPlace.getAttribute('data-place'), dragged);
	}
};

function createArrows() {
	const back = document.createElement('button');
	back.classList.add('action__button', 'material-symbols-outlined');
	back.textContent = 'arrow_back';
	back.title = 'Przesuń w lewo';

	const forward = document.createElement('button');
	forward.classList.add('action__button', 'material-symbols-outlined');
	forward.textContent = 'arrow_forward';
	forward.title = 'Przesuń w prawo';

	return { back: back, forward: forward };
}

const changeState = (state, card) => {
	const lineColor = card.querySelector('.card__line');
	const arrowIcon = card.querySelector('.arrow');

	const arrows = createArrows();

	while (arrowIcon.children[0]) {
		arrowIcon.removeChild(arrowIcon.children[0]);
	}

	switch (parseInt(state)) {
		case 1:
			lineColor.classList.replace(lineColor.classList[1], 'card__line--blue');
			arrowIcon.appendChild(arrows.forward);
			break;

		case 2:
			lineColor.classList.replace(lineColor.classList[1], 'card__line--purple');
			arrowIcon.append(arrows.back, arrows.forward);
			break;

		case 3:
			lineColor.classList.replace(
				lineColor.classList[1],
				'card__line--turquoise'
			);
			arrowIcon.appendChild(arrows.back);
			break;
	}
};

const clickArrowIcon = (e) => {
	let target;

	card = e.target.closest('.card');
	const dataPlace = e.target
		.closest('.cards__board')
		.getAttribute('data-place');

	const arrowIconType = e.target.textContent;

	if (arrowIconType === 'arrow_forward') {
		target = parseInt(dataPlace) + 1;
	} else if (arrowIconType === 'arrow_back') {
		target = dataPlace - 1;
	}

	if (target) {
		const dataPlace = document.querySelector(`[data-place="` + target + `"]`);
		const targetPlace = dataPlace.querySelector('ul');
		card.parentNode.removeChild(card);
		targetPlace.appendChild(card);
	}
	changeState(target, card);
};

document.addEventListener('DOMContentLoaded', main);

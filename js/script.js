let InputPanel;
let exapndMoreIcon;
let titleNewCard;
let weekNewCard;
let btnNewCard;
let firstColumn;
let menuIcons;

const main = () => {
	prepareDOMElements();
	prepareDOMEvents();
};

const prepareDOMElements = () => {
	exapndMoreIcon = document.querySelector('.expand-more-icon');
	InputPanel = document.querySelector('.inputPanel');

	titleNewCard = InputPanel.querySelector("input[type='text']");
	weekNewCard = InputPanel.querySelector("input[type='week']");
	btnNewCard = InputPanel.querySelector('.btn-add');

	firstColumn = document.querySelector("[data-place='1']");

	menuIcons = document.querySelectorAll('.action-icon div');
};

const prepareDOMEvents = () => {
	exapndMoreIcon.addEventListener('click', showInputPanel);
	btnNewCard.addEventListener('click', addNewTask);
	InputPanel.addEventListener('keydown', enterKey);
	menuIcons.forEach((menuIcon) => {
		menuIcon.addEventListener('click', checkClickMenu);
	});
};

const showInputPanel = (e) => {
	InputPanel.classList.toggle('hide');

	if (InputPanel.classList.contains('hide')) {
		exapndMoreIcon.style.transform = 'rotate(0deg)';
	} else {
		exapndMoreIcon.style.transform = 'rotate(-180deg)';
	}

	if (e.target.matches('.edit')) {
		const parent = e.target.parentElement.parentElement.parentElement;
		const dscrpt = parent.querySelector('.dscrpt');
		const week = parent.querySelector('.week');
		titleNewCard.value = dscrpt.textContent;
		console.log(week);

		btnNewCard.textContent = 'Zapisz';
	}
};

const addNewTask = () => {
	const toolTip = document.querySelector('.toolTip');
	if (titleNewCard.value === '') {
		toolTip.style.opacity = '1';
		return;
	}

	/* <div class="card">
<div class="card-line bgc-blue"></div>
<div class="card-info">
    <div class="card-dscrpt">
    */
	toolTip.style.opacity = '0';

	const cardClass = document.createElement('div');
	cardClass.classList.add('card');

	firstColumn.appendChild(cardClass);

	const cardLineClass = document.createElement('div');
	cardLineClass.classList.add('card-line');
	cardLineClass.classList.add('bgc-blue');

	const cardInfoClass = document.createElement('div');
	cardInfoClass.classList.add('card-info');

	cardClass.append(cardLineClass, cardInfoClass);

	const cardDscrptClass = document.createElement('div');
	cardDscrptClass.classList.add('card-dscrpt');

	cardDscrptClass.textContent = titleNewCard.value;
	cardInfoClass.appendChild(cardDscrptClass);

	if (weekNewCard.value !== '') {
		const cardWeekClass = document.createElement('div');
		cardWeekClass.classList.add('card-week');

		cardWeekClass.textContent = weekNewCard.value;
		cardInfoClass.append(cardWeekClass);
	}

	titleNewCard.value = '';
	weekNewCard.value = '';
};
const enterKey = (e) => {
	if (e.key === 'Enter') {
		addNewTask();
	}
};

const checkClickMenu = (e) => {
	if (e.target.matches('.edit')) {
		showInputPanel(e);
		//editDscrptIcon = e.target.closest('span');
		console.log(e);
	}
};

document.addEventListener('DOMContentLoaded', main);

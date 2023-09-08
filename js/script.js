let InputPanel;
let exapndMoreIcon;
let titleNewCard;
let weekNewCard;
let btnNewCard;
let firstColumn;
let menuIcons;
let card;
let title;
let weekInfo;

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
	btnNewCard.addEventListener('click', saveChangesOrAddNewTask);
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

		if (e.target.matches('.edit')) {
			title = card.querySelector('.dscrpt');
			weekInfo = card.querySelector('.week');
			titleNewCard.value = title.textContent;
			weekNewCard.value =
			weekInfo !== null
					? '2023-W' + weekInfo.textContent.match(/[0-9][0-9]$/)
					: '';
			btnNewCard.textContent = 'Zapisz';
		} else {
			btnNewCard.textContent = 'Dodaj';
			titleNewCard.value = '';
			weekNewCard.value = '';
		}
	}
};

const saveChangesOrAddNewTask = () => {
	if (btnNewCard.textContent === 'Zapisz') {
		saveChanges();
	} else {
		if (!addNewTask()) {
			return;
		}
	}
	showInputPanel();
};

const checkCurrentWeekNumber = () => {
	const currentDay = new Date();
	const currentYear = currentDay.getFullYear();
	const firstJanuary = new Date(`${currentYear}-01-01`);

	dayOfYear = Math.round(
		(currentDay.getTime() - firstJanuary.getTime()) / (3600 * 24 * 1000)
	);

	CurrentWeekNumber = Math.floor(dayOfYear / 7);

	if (firstJanuary.getDay() < 5) {
		CurrentWeekNumber += 1;
	}
	return CurrentWeekNumber;
};

const addNewTask = () => {
	const toolTip = document.querySelector('.toolTip');
	if (titleNewCard.value === '') {
		toolTip.style.opacity = '1';
		return false;
	}

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
	toolTip.style.opacity = '0';

	const cardClass = document.createElement('div');
	cardClass.classList.add('card');

	firstColumn.appendChild(cardClass);

	const lineClass = document.createElement('div');
	lineClass.classList.add('line');
	lineClass.classList.add('bgc-blue');

	const infoClass = document.createElement('div');
	infoClass.classList.add('info');

	cardClass.append(lineClass, infoClass);

	const titleClass = document.createElement('div');
	titleClass.classList.add('dscrpt');

	titleClass.textContent = titleNewCard.value;
	infoClass.appendChild(titleClass);

	const weekClass = document.createElement('div');
	weekClass.classList.add('week');

	weekClass.textContent =
		weekNewCard.value !== ''
			? 'Tydzień ' + weekNewCard.value.match(/[0-9][0-9]$/)
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

	if (weekNewCard.value !== '') {
		checkWeekNumber(cardClass);
	}
	main();

	titleNewCard.value = '';
	weekNewCard.value = '';
	return true;
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
	title.textContent = titleNewCard.value;
	titleNewCard.value = '';
	if (weekNewCard.value !== null) {
		weekInfo.textContent = 'Tydzień ' + weekNewCard.value.match(/[0-9][0-9]$/);
		checkWeekNumber(card);
	} else {
		weekInfo.textContent = '';
	}
	btnNewCard.textContent = 'Dodaj';
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

document.addEventListener('DOMContentLoaded', main);

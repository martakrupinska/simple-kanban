let InputPanel;
let exapndMoreIcon;
let titleNewCard;
let weekNewCard;
let btnNewCard;
let firstColumn;
let menuIcons;
let card;
let cardDscrpt;
let cardWeek;

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
	btnNewCard.addEventListener('click', saveOrAddNewTask);
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
			cardDscrpt = card.querySelector('.dscrpt');
			cardWeek = card.querySelector('.week');
			titleNewCard.value = cardDscrpt.textContent;
			btnNewCard.textContent = 'Zapisz';
		}
	}
};

const saveOrAddNewTask = () => {
	if (btnNewCard.textContent === 'Zapisz') {
		saveNewDscrpt();
	} else {
		addNewTask();
	}
	showInputPanel();
};

const addNewTask = () => {
	const toolTip = document.querySelector('.toolTip');
	if (titleNewCard.value === '') {
		toolTip.style.opacity = '1';
		return;
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

	const dscrptClass = document.createElement('div');
	dscrptClass.classList.add('dscrpt');

	dscrptClass.textContent = titleNewCard.value;
	infoClass.appendChild(dscrptClass);

	if (weekNewCard.value !== '') {
		const weekClass = document.createElement('div');
		weekClass.classList.add('week');

		weekClass.textContent = weekNewCard.value;
		infoClass.append(weekClass);
	}

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

	titleNewCard.value = '';
	weekNewCard.value = '';
};
const enterKey = (e) => {
	if (e.key === 'Enter') {
		saveOrAddNewTask();
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

const saveNewDscrpt = () => {
	cardDscrpt.textContent = titleNewCard.value;
	titleNewCard.value = '';
	btnNewCard.textContent = 'Dodaj';
};

document.addEventListener('DOMContentLoaded', main);

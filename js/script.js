const exapndMoreIcon = document.querySelector('.expand-more-icon');
const InputPanel = document.querySelector('.inputPanel');

const titleNewCard = InputPanel.querySelector("input[type='text']");
const weekNewCard = InputPanel.querySelector("input[type='week']");
const btnNewCard = InputPanel.querySelector('.btn-add');

const firstColumn = document.querySelector("[data-place='1']");

const showInputPanel = () => {
	InputPanel.classList.toggle('hide');

	if (InputPanel.classList.contains('hide')) {
		exapndMoreIcon.style.transform = 'rotate(0deg)';
	} else {
		exapndMoreIcon.style.transform = 'rotate(-180deg)';
	}
};

const addNewTask = () => {
	if (titleNewCard.value === '' || weekNewCard.value === '') {
		return;
	}

	/* <div class="card">
<div class="card-line bgc-blue"></div>
<div class="card-info">
    <div class="card-dscrpt">
    */

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

	const cardWeekClass = document.createElement('div');
	cardWeekClass.classList.add('card-week');

	cardWeekClass.textContent = weekNewCard.value;
	cardInfoClass.append(cardDscrptClass, cardWeekClass);
};
exapndMoreIcon.addEventListener('click', showInputPanel);
btnNewCard.addEventListener('click', addNewTask);

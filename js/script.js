const exapndMoreIcon = document.querySelector('.expand-more-icon');
const InputPanel = document.querySelector('.inputPanel');

const showInputPanel = () => {
	InputPanel.classList.toggle('hide');

	if (InputPanel.classList.contains('hide')) {
		exapndMoreIcon.style.transform = 'rotate(0deg)';
	} else {
		exapndMoreIcon.style.transform = 'rotate(-180deg)';
	}
};

exapndMoreIcon.addEventListener('click', showInputPanel);

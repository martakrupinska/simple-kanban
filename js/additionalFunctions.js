function createElementAndAddClassList(element, classList) {
	const createdElement = document.createElement(element);
	createdElement.classList.add(...classList);

	return createdElement;
}

export { createElementAndAddClassList };

const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
const closeButtons = document.querySelectorAll("[data-role='close']");
const cardToggler = document.querySelector("#card_toggler");
const guideCards = document.querySelectorAll(
	".step-guide-cards [role='menuitem']"
);
const cardCheck = document.querySelectorAll(
	".step-guide-cards input[type='checkbox']"
);

function closeAllDropdown() {
	dropdownToggles.forEach((toggle) => {
		toggle.ariaExpanded = false;
		toggle.parentElement.classList.remove("open");
	});
}

function handleArrowMovement(event, menuItems, menuIndex) {
	let keyPressed = event.key;
	let menuItemsLength = menuItems.length;
	let lastMenuItemIndex = menuItemsLength - 1;
	let firstMenuItemIndex = 0;

	let nextItem = menuItems.item(menuIndex + 1);
	let prevItem = menuItems.item(menuIndex - 1);
	let isLastItem = menuIndex == lastMenuItemIndex;
	let isFirstItem = menuIndex == firstMenuItemIndex;
	let firstItem = menuItems.item(firstMenuItemIndex);
	let lastItem = menuItems.item(lastMenuItemIndex);

	if (keyPressed == "ArrowRight" || keyPressed == "ArrowDown") {
		if (isLastItem) {
			firstItem.focus();
			return;
		}

		nextItem.focus();
	}

	if (keyPressed == "ArrowLeft" || keyPressed == "ArrowUp") {
		if (isFirstItem) {
			lastItem.focus();
			return;
		}

		prevItem.focus();
	}
}

function handleDropdownToggling() {
	let toggleButton = this;
	let parent = toggleButton.parentElement;
	let target = toggleButton.dataset.target;

	dropdownToggles.forEach((toggle) => {
		if (toggle != toggleButton) {
			toggle.ariaExpanded = false;
			toggle.parentElement.classList.remove("open");
		}
	});
	let isExpanded = toggleButton.ariaExpanded == "true";

	let menu = parent.querySelector(`#${target}`);
	let menuItems = menu.querySelectorAll(`[role='menuitem']`);

	let firstMenuItemIndex = 0;

	function openMenu() {
		menuItems.item(firstMenuItemIndex).focus();

		menu.addEventListener("keyup", function (e) {
			let keyPressed = e.key;
			isExpanded = true;

			if (keyPressed == "Escape") {
				openToggle();
				return;
			}
		});

		menuItems.forEach(function (menuItem, menuIndex) {
			menuItem.addEventListener("keyup", (event) =>
				handleArrowMovement(event, menuItems, menuIndex)
			);
		});
	}

	function openToggle() {
		toggleButton.parentElement.classList.toggle("open", !isExpanded);
		toggleButton.ariaExpanded = !isExpanded;

		if (isExpanded) {
			toggleButton.focus();
		} else {
			openMenu();
		}
	}

	openToggle();
}

dropdownToggles.forEach((toggle) => {
	toggle.addEventListener("click", handleDropdownToggling);
});

dropdownToggles.forEach((toggle) => {
	toggle.parentElement.addEventListener("click", (e) => e.stopPropagation());
});

closeButtons.forEach((button) => {
	button.addEventListener("click", (e) => {
		let targetId = button.dataset.target;
		let target = document.querySelector(`${targetId}`);
		target.remove();
		console.log(target);
	});
});

cardToggler.addEventListener("click", function () {
	let toggler = this;
	let target = toggler.dataset.target;

	let isExpanded = toggler.ariaExpanded == "true";

	let menu = document.querySelector(`#${target}`);
	let menuItems = menu.querySelectorAll(`[role='menuitem']`);

	let firstMenuItemIndex = 0;

	function openMenu() {
		menuItems.item(firstMenuItemIndex).focus();

		menu.addEventListener("keyup", function (e) {
			let keyPressed = e.key;
			isExpanded = true;

			if (keyPressed == "Escape") {
				openToggle();
				return;
			}
		});

		menuItems.forEach(function (menuItem, menuIndex) {
			menuItem.addEventListener("keyup", (event) =>
				handleArrowMovement(event, menuItems, menuIndex)
			);
		});
	}

	function openToggle() {
		menu.classList.toggle("open", !isExpanded);
		toggler.ariaExpanded = !isExpanded;

		if (isExpanded) {
			toggler.focus();
		} else {
			openMenu();
		}
	}

	openToggle();
});

function openCard(card) {
	let isExpanded = card.ariaExpanded == "true";
	let height = card.offsetHeight;
	if (card.classList.contains("open")) return;
	guideCards.forEach((card) => {
		card.ariaExpanded = false;
		card.classList.remove("open");
		card.style.setProperty("--height", "0");
	});
	card.classList.add("open");
	card.style.setProperty("--height", `${height}px`);
	card.ariaExpanded = !isExpanded;
}

guideCards.forEach((card) => {
	card.addEventListener("click", () => openCard(card));
});

function setStepper() {
	let stepper = document.querySelector("#step");
	let stepperBar = document.querySelector("#stepper_progress");
	let checkboxes = [...cardCheck];
	let checkedboxes = checkboxes.filter((checkbox) => checkbox.checked).length;
	let percentage = (checkedboxes / 5) * 100;

	stepper.textContent = checkedboxes;
	stepperBar.value = percentage;
	stepperBar.textContent = `${percentage}%`;
}

function handleBoxChecking(check, index) {
	let ariaPolite = check.closest("li").querySelector("[aria-live='polite']");

	check.classList.add("spinning");

	ariaPolite.ariaLabel = "Loading Please Wait ....";

	setTimeout(() => {
		check.classList.remove("spinning");
		setStepper();
		let lastIndex = [...guideCards].length - 1;

		if (!check.checked) {
			ariaPolite.ariaLabel = "Guide Unchecked";
			check.ariaLabel = check.ariaLabel.replace("Checked", "Not Checked");
			return;
		}

		let allUnCheckedBoxesAfterTheCheckedBox = [...cardCheck]
			.slice(index + 1)
			.filter((checkbox) => !checkbox.checked);

		let allUnCheckedBoxes = [...cardCheck].filter(
			(checkbox) => !checkbox.checked
		);

		ariaPolite.ariaLabel = "Guide Checked";
		check.ariaLabel = check.ariaLabel.replace("Not Checked", "Checked");

		if (
			allUnCheckedBoxesAfterTheCheckedBox.length <= 0 &&
			allUnCheckedBoxes.length <= 0
		) {
			return;
		}

		let nextUnCheckedBoxes =
			index == lastIndex
				? allUnCheckedBoxes[0]
				: allUnCheckedBoxesAfterTheCheckedBox[0];

		if (nextUnCheckedBoxes == undefined && allUnCheckedBoxes.length > 0) {
			nextIndex = [...cardCheck].findIndex(
				(card) => card == allUnCheckedBoxes[0]
			);
			nextUnCheckedBoxes = cardCheck[nextIndex];
		}
		let itemCard = nextUnCheckedBoxes.closest("[role='menuitem']");

		setTimeout(() => {
			openCard(itemCard);
			nextUnCheckedBoxes.focus();
		}, 500);
	}, 1000);
}
cardCheck.forEach((check, index) => {
	check.addEventListener("change", () => {
		handleBoxChecking(check, index);
	});
	check.addEventListener("keydown", (event) => {
		let keyPressed = event.key;
		if (keyPressed === "Enter") {
			check.checked = !check.checked;
			handleBoxChecking(check, index);
		}
	});
});

window.addEventListener("load", () => {
	setStepper();
});

window.addEventListener("click", () => {
	closeAllDropdown();
});

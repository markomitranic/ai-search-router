// DOM elements
const settingsButton = document.getElementById(
	"settings-button",
) as HTMLButtonElement;

/**
 * Open settings page
 */
function openSettings(): void {
	chrome.runtime.openOptionsPage();
}

// Event listener
settingsButton.addEventListener("click", openSettings);

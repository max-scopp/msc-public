export function setupFocusOutline() {
  const { body } = document;
  // Let the document know when the mouse is being used
  body.addEventListener('mousedown', () => {
    body.classList.add('use-mouse');
  });

  // Re-enable focus styling when Tab is pressed
  body.addEventListener('keydown', (event) => {
    if (event.keyCode === 9) {
      body.classList.remove('use-mouse');
    }
  });
}

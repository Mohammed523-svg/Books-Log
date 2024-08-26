const truncateText = document.querySelectorAll('#bookInfo');

window.addEventListener('load', () => {
  if (window.matchMedia('(max-width: 425px)').matches) {
    truncateText.forEach((element) => {
      element.classList.add('truncate-text');
    });
  } else {
    truncateText.forEach((element) => {
      element.classList.remove('truncate-text');
    });
  }
});

window.addEventListener('resize', () => {
  if (window.matchMedia('(max-width: 425px)').matches) {
    truncateText.forEach((element) => {
      element.classList.add('truncate-text');
    });
  } else {
    truncateText.forEach((element) => {
      element.classList.remove('truncate-text');
    });
  }
});

// Pop auth form js

let popup = document.getElementById("auth");

function openAuth() {
   popup.classList.add("open_auth");
}

function closeAuth() {
    popup.classList.remove("open_auth");
}

// Function to auto-resize the textarea
function autoResizeTextarea() {
    const textarea = document.getElementById('reviewText');
    
    // Reset the height first so it can shrink on delete
    textarea.style.height = 'auto';

    // Set the height to the scroll height (which is the height needed to display the full content)
    textarea.style.height = textarea.scrollHeight + 'px';
}

// Add event listener to handle input
document.getElementById('reviewText').addEventListener('input', autoResizeTextarea);

// Trigger the function on page load in case there is pre-filled content
window.addEventListener('load', autoResizeTextarea);



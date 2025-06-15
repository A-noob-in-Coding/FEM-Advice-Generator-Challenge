let advice_id_span = document.getElementById("advice-id");
let isLoading = false;

async function fetchRandomAdvice() {
  // Prevent multiple clicks
  if (isLoading) return;

  const button = document.getElementById("generate-advice");

  // Set loading state and disable button
  isLoading = true;
  button.disabled = true;
  button.style.opacity = '0.5';
  button.style.cursor = 'not-allowed';

  // Remove the animation class if it exists
  button.classList.remove("button-animate");
  setTimeout(() => {
    button.classList.add("button-animate");
  }, 10);

  try {
    const response = await fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const advice = data.slip.advice;
    const adviceElement = document.getElementById("advice");
    advice_id_span.innerText = data.slip.id;

    // Display jumbled text
    displayJumbledText(adviceElement, advice);

    // Animate text reforming
    await animateTextReforming(adviceElement, advice);

  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    // Show error message to user
    const adviceElement = document.getElementById("advice");
    adviceElement.innerText = "Failed to load advice. Please try again.";
    advice_id_span.innerText = "Error";
  } finally {
    // Re-enable button
    isLoading = false;
    button.disabled = false;
    button.style.opacity = '1';
    button.style.cursor = 'pointer';
  }
}

function displayJumbledText(element, text) {
  const jumbledText = text.split('').map(() => String.fromCharCode(33 + Math.floor(Math.random() * 94))).join('');
  element.innerText = jumbledText;
}

function animateTextReforming(element, text) {
  return new Promise((resolve) => {
    let currentText = element.innerText.split('');
    const originalText = text.split('');
    let index = 0;

    const interval = setInterval(() => {
      if (index < originalText.length) {
        currentText[index] = originalText[index];
        element.innerText = currentText.join('');
        index++;
      } else {
        clearInterval(interval);
        resolve(); // Resolve the promise when animation is complete
      }
    }, 30);
  });
}

// Call the function to fetch and display advice
fetchRandomAdvice();

// Add event listener to the button to fetch new advice on click
document.getElementById("generate-advice").addEventListener("click", fetchRandomAdvice);

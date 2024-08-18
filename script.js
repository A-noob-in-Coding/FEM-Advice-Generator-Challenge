async function fetchRandomAdvice() {
  
  const button = document.getElementById("generate-advice");
  
  // Remove the animation class if it exists
  button.classList.remove("button-animate");
  setTimeout(() => {
    button.classList.add("button-animate");
  }, 10);


  try {
    const response = await fetch("https://api.adviceslip.com/advice");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const advice = data.slip.advice;
    const adviceElement = document.getElementById("advice");
    
    // Display jumbled text
    displayJumbledText(adviceElement, advice);
    
    // Animate text reforming
    animateTextReforming(adviceElement, advice);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
  
}

function displayJumbledText(element, text) {
  const jumbledText = text.split('').map(() => String.fromCharCode(33 + Math.floor(Math.random() * 94))).join('');
  element.innerText = jumbledText;
}

function animateTextReforming(element, text) {
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
    }
  }, 30); // Adjust the speed of the animation here
}

// Call the function to fetch and display advice
fetchRandomAdvice();

// Add event listener to the button to fetch new advice on click
document.getElementById("generate-advice").addEventListener("click", fetchRandomAdvice);
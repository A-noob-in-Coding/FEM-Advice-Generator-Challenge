let advice_text = document.getElementById("advice");
let advice_id = document.getElementById("advice-id");
// Function to fetch and display random advice

async function fetchRandomAdvice() {
  try {
    const response = await fetch("https://api.adviceslip.com/advice");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data)
    advice_text.innerText = data.slip.advice;
    advice_id.innerText = data.slip.id;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Call the function to fetch and display advice
fetchRandomAdvice();

let btn = document.getElementById("generate-advice")

btn.addEventListener("click",()=>{

    fetchRandomAdvice();
})

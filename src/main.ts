// Selecting necessary elements from the DOM
const container: HTMLElement = document.querySelector(".container")!;
const searchInput: HTMLInputElement = container.querySelector("input")!;
const volume: HTMLElement = container.querySelector(".word i")!;
const infoText: HTMLElement = container.querySelector(".info-text")!;
const synonyms: HTMLElement = container.querySelector(".synonyms .list")!;
const removeIcon: HTMLElement = container.querySelector(".search span")!;
// const pronunciation: HTMLElement = container.querySelector(".pronunciation");

// Declaring a variable to store audio
let audio: HTMLAudioElement;

// Function to handle fetched data and display it
function data(result: any, word: string): void {
  // Check if the API returned an error
  if (result.title) {
    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
  } else {
    // Display data
    container.classList.add("active");
    const definitions = result[0].meanings[0].definitions[0];
    const phonetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;
    document.querySelector(".word p")!.innerText = result[0].word;
    document.querySelector(".word span")!.innerText = phonetics;
    document.querySelector(".meaning span")!.innerText = definitions.definition;
    document.querySelector(".example span")!.innerText = definitions.example;
    audio = new Audio("https:" + result[0].phonetics[0].audio);

    // Display synonyms if available
    if (definitions.synonyms[0] === undefined) {
      synonyms.parentElement!.style.display = "none";
    } else {
      synonyms.parentElement!.style.display = "block";
      synonyms.innerHTML = "";
      for (let i = 0; i < 5; i++) {
        let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
        tag =
          i === 4
            ? `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>`
            : tag;
        synonyms.insertAdjacentHTML("beforeend", tag);
      }
    }
  }
}
// Function to fetch data from API
function fetchApi(word: string): void {
  container.classList.remove("active");
  infoText.style.color = "#000";
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => data(result, word))
    .catch(() => {
      infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    });
}

// Event listeners
searchInput.addEventListener("keyup", (e: KeyboardEvent) => {
  let word: string = (e.target as HTMLInputElement).value.trim();
  if (e.key === "Enter" && word) {
    fetchApi(word);
  }
});
volume.addEventListener("click", () => {
  (volume as HTMLElement).style.color = "#4D59FB";
  audio.play();
  setTimeout(() => {
    (volume as HTMLElement).style.color = "#999";
  }, 800);
});

removeIcon.addEventListener("click", () => {
  (searchInput as HTMLInputElement).value = "";
  searchInput.focus();
  container.classList.remove("active");
  (infoText as HTMLElement).style.color = "#9A9A9A";
  infoText.innerHTML =
    "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});

// Define a function named pronunciation using arrow function syntax
const pronunciation = () => {
  // Retrieve the value of the input element with the id "input"
  let text = (document.getElementById("input") as HTMLInputElement).value;

  // Create a new SpeechSynthesisUtterance object with the retrieved text
  let speech = new SpeechSynthesisUtterance(text);

  // Use the speech synthesis API to speak the utterance
  speechSynthesis.speak(speech);
};

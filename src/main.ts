// Selecting necessary elements from the DOM
const container: HTMLElement = document.querySelector(".container")!;
const searchInput: HTMLInputElement = container.querySelector("input")!;
const volume: HTMLElement = container.querySelector(".word i")!;
const infoText: HTMLElement = container.querySelector(".info-text")!;
const synonyms: HTMLElement = container.querySelector(".synonyms .list")!;
const removeIcon: HTMLElement = container.querySelector(".search span")!;

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

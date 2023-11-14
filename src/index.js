import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

// Business Logic

function getGif(endpoint, limit, query, rating) {
  let request = new XMLHttpRequest();
  let url;

  if (endpoint !== "random") {
    url = `https://api.giphy.com/v1/gifs/${endpoint}?api_key=${process.env.API_KEY}&q=${query}&limit=${limit}&offset=0&rating=${rating}&lang=en&bundle=messaging_non_clips`;
  } else {
    url = `https://api.giphy.com/v1/gifs/random?api_key=${process.env.API_KEY}&tag=&rating=${rating}`;
  }


  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      try {

        if (request.status !== 200) {
          throw new Error(`Error ${request.status}: ${request.statusText}`);
        }
        const response = JSON.parse(request.responseText);
        console.log(response);
        printElements(response, endpoint, limit, query, rating);
      } catch (error) {
        printError(error, endpoint, limit, query, rating);
      }
    }
  };

  request.open("GET", url, true);
  request.send();
}

// UI Logic

function printElements(response, endpoint, limit, query, rating) {

  let showResponseDiv = document.querySelector('#showResponse');
  showResponseDiv.innerText = '';

  if (endpoint === 'random') {
    let gifUrl = response.data.images.original.url;
    let gifLink = response.data.url;

    let imgTag = document.createElement("img");
    imgTag.setAttribute("src", gifUrl);
    imgTag.setAttribute("alt", "GIF");

    let aTag = document.createElement("a");
    aTag.setAttribute("href", gifLink);
    aTag.appendChild(imgTag);

    showResponseDiv.appendChild(aTag);
  } else {
    if (response.data.length > 0) {
      for (let i = 0; i < response.data.length && i < limit; i++) {
        let gifUrl = response.data[i].images.original.url;
        let gifLink = response.data[i].url;

        let imgTag = document.createElement("img");
        imgTag.setAttribute("src", gifUrl);
        imgTag.setAttribute("alt", "GIF");

        let aTag = document.createElement("a");
        aTag.setAttribute("href", gifLink);
        aTag.appendChild(imgTag);

        showResponseDiv.appendChild(aTag);
      }
    } else {
      let pTag = document.createElement('p');
      pTag.innerText = `No GIFs found`;
      showResponseDiv.appendChild(pTag);
    }
  }



  let infoTag = document.createElement('p');
  infoTag.innerText = `Endpoint is: ${endpoint}, limit is: ${limit}, query is: ${query}. The rating is: ${rating}`;
  showResponseDiv.appendChild(infoTag);
}



function printError(error, endpoint, limit, query, rating) {
  document.querySelector('#showResponse').innerText = `There was an error accessing the giphy data for ${endpoint}, ${limit}, ${query}, ${rating}: ${error.message}`;
}

function handleFormSubmission(event) {
  event.preventDefault();
  const endpoint = document.getElementById("endpoint").value;
  const limit = document.getElementById("limit").value;
  const query = document.getElementById("query").value;
  const rating = document.getElementById("rating").value;

  document.querySelector('#query').value = null;

  console.log(`endpoint: ${endpoint}, limit: ${limit}, query: ${query}, rating: ${rating}`);
  getGif(endpoint, limit, query, rating);
}

window.addEventListener("load", function () {
  document.querySelector('form').addEventListener("submit", handleFormSubmission);
});
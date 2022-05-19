const urlInput = document.getElementById("urlInput");
const btnSaveInput = document.getElementById("button-addon2");
const urlList = document.getElementById("URLlist");

let urlMap = new Map();
let protocolArray = [];
let domain;
const del = "/";
const fav = "/favicon.ico";

const urlsFromLocalStorage = new Map(JSON.parse(localStorage.getItem("URL")));

if (urlsFromLocalStorage) {
  urlMap = urlsFromLocalStorage;
  printURLs(urlMap);
}

btnSaveInput.addEventListener("click", function () {
  if (!urlInput.value.length) {
    alert("Please fill required field");
    urlInput.focus();
    return false;
  } else if (!isValidURL(urlInput.value)) {
    alert("Invalid URL");
    urlInput.value = "";
    return false;
  }

  urlMap.set(urlInput.value, urlInput.value);
  urlInput.value = "";
  localStorage.setItem("URL", JSON.stringify([...urlMap]));
  printURLs(urlMap);
});

document.getElementById("saveTab").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    urlMap.set(tabs[0].url, tabs[0].title);
    localStorage.setItem("URL", JSON.stringify([...urlMap]));
    printURLs(urlMap);
  });
});

function isValidURL(string) {
  var result = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return result !== null;
}

function printURLs(map) {
  let items = "";
  map.forEach((value, key) => {
    domain = new URL(key).hostname;
    protocolArray = key.split(del);
    items += `
      	    <li>
                <img height="16px" width="16px" src='${protocolArray[0]}//${domain + fav}'>

                <a class="d-inline-block text-truncate" style="max-width: 288px" 
                target='_blank' href='${key}'> ${value}</a>

                <a class="deleteBtn" dataset-id="${key}" style="margin-left: auto;" href="#">
                  <i class="bi bi-bookmark-x text-danger" style="-webkit-text-stroke: 0.4px;"></i>
                </a>
            </li>`;
  });
  urlList.innerHTML = items;
  protocolArray.length = 0;
}

window.addEventListener('DOMContentLoaded', (event) => {
  [...document.querySelectorAll(".deleteBtn")]
    .forEach(el => el.addEventListener('click', function (e) {  
        let key = this.getAttribute("dataset-id");
        if (confirm(`Are you sure you want to delete this item?`)) { 
          onClickDelete(key);
      }
    }))
});

function onClickDelete(key) {
  urlMap.delete(key);
  localStorage.setItem("URL", JSON.stringify([...urlMap]));
  location.reload();
}


const dropList = document.querySelectorAll("form select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getButton = document.querySelector("form button");

// Tüm döviz birimlerini seçenek olarak eklemek için döngü
for (let i = 0; i < dropList.length; i++) {
  for (let currency_code in country_list) {
    let selected =
      (i == 0 && currency_code == "TRY") || (i == 1 && currency_code == "USD")
        ? "selected"
        : "";
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target);
    getExchangeRate();
  });
}

function loadFlag(element) {
  for (let code in country_list) {
    if (code == element.value) {
      let imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://flagcdn.com/48x36/${country_list[
        code
      ].toLowerCase()}.png`;
    }
  }
}

window.addEventListener("load", () => {
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

getButton.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector("form input");
  const exchangeRateTxt = document.querySelector("form .exchange-rate");
  let amountVal = amount.value;
  if (amountVal === "" || parseFloat(amountVal) <= 0) {
    exchangeRateTxt.innerText = "Please enter a valid amount.";
    return;
  }
  exchangeRateTxt.innerText = "Getting exchange rate...";
  let url = `https://v6.exchangerate-api.com/v6/e679c96bdb4c24b98b282be3/latest/${fromCurrency.value}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExRate = (amountVal * exchangeRate).toFixed(2);
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    })
    .catch((error) => {
      exchangeRateTxt.innerText = "Something went wrong: " + error.message;
    });
}

const wrapper = document.getElementById("wrapper");
const blurCircle = document.getElementById("blur-circle");
const blurGradient = document.querySelector(".blur-gradient");

wrapper.addEventListener("mousemove", function (e) {
  blurCircle.style.display = "block"; // Blur circle'ı göster
  blurCircle.style.left = e.pageX - 5 + "px"; // Fare imleci pozisyonunu ayarla
  blurCircle.style.top = e.pageY - 5 + "px";
  blurCircle.style.width = "10px"; // Başlangıç genişliği
  blurCircle.style.height = "10px"; // Başlangıç yüksekliği
  blurCircle.style.transform = "scale(1)"; // Ölçekleme sıfırla
  blurGradient.style.background = `radial-gradient(circle at ${e.pageX}px ${e.pageY}px, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 30%)`;

  const distanceFromCenter = Math.sqrt(
    Math.pow(e.pageX - wrapper.offsetWidth / 2, 2) +
      Math.pow(e.pageY - wrapper.offsetHeight / 2, 2)
  );
  const maxDistanceFromCenter = Math.sqrt(
    Math.pow(wrapper.offsetWidth / 2, 2) + Math.pow(wrapper.offsetHeight / 2, 2)
  );
  const scaleFactor = 1 - (distanceFromCenter / maxDistanceFromCenter) * 0.5; // Küçültme faktörü

  blurCircle.style.width = 10 * scaleFactor + "px"; // Genişliği küçült
  blurCircle.style.height = 10 * scaleFactor + "px"; // Yüksekliği küçült
  blurCircle.style.transform = `scale(${scaleFactor})`; // Ölçekleme uygula
});

wrapper.addEventListener("mouseleave", function () {
  blurCircle.style.display = "none"; // Fare ayrıldığında blur circle'ı gizle
  blurGradient.style.background = "none"; // Fare ayrıldığında gradient'i sıfırla
});

// Favorileri ve geçmiş döviz kurlarını depolamak için boş diziler oluştur
let favorites = [];
let history = [];

// Favori ekleme ve geçmiş döviz kurlarını takip etme fonksiyonları
function addToFavorites() {
  if (!favorites.includes(`${fromCurrency.value}-${toCurrency.value}`)) {
    favorites.push(`${fromCurrency.value}-${toCurrency.value}`);
    updateFavoritesList();
  }
}

function addToHistory(rate) {
  if (history.length >= 5) {
    history.pop(); // Dizideki en eski öğeyi kaldır
  }
  history.unshift(rate);
  updateHistoryList();
}
function updateFavoritesList() {
  favoritesList.innerHTML = "";
  favorites.forEach((favorite) => {
    const listItem = document.createElement("li");
    listItem.textContent = favorite;
    favoritesList.appendChild(listItem);
  });
}

function updateHistoryList() {
  historyList.innerHTML = "";
  history.forEach((rate) => {
    const listItem = document.createElement("li");
    listItem.textContent = rate;
    historyList.appendChild(listItem);
  });
}

getButton.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector("form input");
  const exchangeRateTxt = document.querySelector("form .exchange-rate");
  let amountVal = amount.value;
  if (amountVal === "" || parseFloat(amountVal) <= 0) {
    exchangeRateTxt.innerText = "Please enter a valid amount.";
    return;
  }
  exchangeRateTxt.innerText = "Getting exchange rate...";
  let url = `https://v6.exchangerate-api.com/v6/e679c96bdb4c24b98b282be3/latest/${fromCurrency.value}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExRate = (amountVal * exchangeRate).toFixed(2);
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
      addToHistory(
        `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`
      );
      addToFavorites();
    })
    .catch((error) => {
      exchangeRateTxt.innerText = "Something went wrong: " + error.message;
    });
}


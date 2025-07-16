const input = document.getElementById("countryInput");
const resultDiv = document.getElementById("result");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", handleSearch);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});

function handleSearch() {
  const countryName = input.value.trim().toLowerCase();
  resultDiv.innerHTML = "";

  if (!isValidInput(countryName)) {
    displayError("Please enter at least 3 letters.");
    return;
  }

  fetchCountryData(countryName);
}

function isValidInput(name) {
  return name.length >= 3;
}

function displayError(message) {
  resultDiv.innerHTML = `<p style="color:red;">${message}</p>`;
}

async function fetchCountryData(name) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${name}`);
    if (!response.ok) throw new Error("Country not found");

    const data = await response.json();
    const matches = filterMatchingCountries(data, name);

    if (matches.length === 0) throw new Error("No matching countries found.");

    matches.forEach(renderCountryCard);
  } catch (error) {
    displayError(error.message);
  }
}

function filterMatchingCountries(data, name) {
  return data.filter(country =>
    country.name.common.toLowerCase().includes(name)
  );
}

function renderCountryCard(country) {
  const languages = Object.values(country.languages || {}).join(", ");
  const currencies = country.currencies
    ? Object.values(country.currencies).map(cur => `${cur.name} (${cur.symbol})`).join(", ")
    : "N/A";

  const card = document.createElement("div");
  card.className = "country-info";
  card.innerHTML = `
    <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
    <h2>${country.name.common}</h2>
    <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Languages:</strong> ${languages}</p>
    <p><strong>Currencies:</strong> ${currencies}</p>
    <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>
  `;
  resultDiv.appendChild(card);
}
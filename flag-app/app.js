//* =======================================================================
//*                          FLAG-APP
//* =======================================================================

fetchAllCountries();

//? Tum ulke bilgilerini getir
function fetchAllCountries() {
  fetch(`https://restcountries.com/v3.1/all`)
    .then((res) => {
      if (!res.ok) {
        renderError(`Something went wrong:${res.status}`);
        throw new Error();
      }
      return res.json();
    })
    .then((data) => getCountryNames(data))
    .catch((err) => console.log(err));
}

//? Tum ulkelerin isimlerini elde edip bunlari dropmenu'ye yaz
const getCountryNames = (data) => {
  data.forEach((country) => {
    const {
      name: { common },
    } = country;
    const select = document.querySelector(".form-select");
    select.innerHTML += `<option value='${common}'>${common}</option> `;
  });
};

//? Dropdown menudeki secilen ulke degistiginde secilen ulkenin bilgilerini
//? Card olarak DOM'a bas
document.querySelector(".form-select").addEventListener("change", () => {
  const countryName = document.querySelector(".form-select").value;

  //?Eger countryName varsa (true) fetchCountry metotunu çağır.
  //? drop menüden select country secilirse option'in value "" olacagindan
  //? fetchCountry() fonksiyonun cagirlamamasi gerekir
  countryName && fetchCountry(countryName);
});

//!  Drop-menuden secilen ulkeyi getirerek DOM'a bilgileri bas
//! -----------------------------------------------------------------
//? ulke ismine gore fetch yap
const fetchCountry = async (name) => {
  const url = `https://restcountries.com/v3.1/name/${name}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      renderError(`Something went wrong:${res.status}`);
      throw new Error();
    }
    const data = await res.json();
    renderCountry(data[0]);
  } catch (error) {
    console.log(error);
  }
};

//? hata olmasi durumunda DOM'a mesaji bas
const renderError = (err) => {
  const countries = document.querySelector(".countries");
  countries.innerHTML = `
    <h3 class="text-danger">${err}</h3>
    <img src='./404.png' alt="" />
  `;
};

//? Ulke bilgilerini card olarak basan fonksiyon
const renderCountry = (country) => {
  console.log(country);
  const {
    name: { common },
    capital,
    region,
    flags: { svg },
    languages,
    currencies,
  } = country;

  //! Bir nesnedeki tum degerleri (values) bir dizi olarak alabilmek icin Object.values()fonksiyonyu kullanilabilir.
  // console.log(Object.values(languages));
  // console.log(Object.values(currencies)[0].name);

  const countries = document.querySelector(".countries");

  countries.innerHTML = `
    <div class="card shadow-lg" style="width: 18rem;">
      <img src=${svg} class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${common}</h5>
        <p class="card-text">${region}</p>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item"> <i class="fas fa-lg fa-landmark"></i> ${capital}</li>
        <li class="list-group-item"> <i class="fas fa-lg fa-comments"></i> ${Object.values(
          languages
        )}</li>
         <li class="list-group-item"> <i class="fas fa-lg fa-money-bill-wave"></i> ${
           Object.values(currencies)[0].name
         }, ${Object.values(currencies)[0].symbol}</li>
       </ul>
     </div>
  `;
};

// fetchCountry("turkey");
// fetchCountry("Belgium");

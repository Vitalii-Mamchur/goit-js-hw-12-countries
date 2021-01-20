import countryService from './services/country-info.js';
import countriesListTemplate from '../templates/countries-list.hbs';
import countryInfoTemplate from '../templates/country-info.hbs';
import '@pnotify/core/dist/BrightTheme.css';

const {error} = require('@pnotify/core');
const debounce = require('lodash.debounce');

const refs = {
    form: document.querySelector('#search-form'),
    section: document.querySelector('#country-section'),
  };

  // console.log(refs.form);
  
  const nameValid = {
    MAXVIEWCOUNTRY: 10,
    MINVIEWCOUNTRY: 1,
  };
  
  refs.form.addEventListener('input', debounce(countryNameHandler, 500));
  
  function countryNameHandler(event) {
    const searchQuery = event.target.value;
  
    if (!searchQuery) {
      clearList();
      return;
    }
    
    countryService.fethSearchCountry(searchQuery).then(data => {
      if (data.length > nameValid.MAXVIEWCOUNTRY) {
        clearList();
        error({
          text: 'Too many matches found. Please enter a more specific query!',
          delay: 2000,
        });
      } else if (data.length === nameValid.MINVIEWCOUNTRY) {
        generateMarkup(data[0], countryInfoTemplate);
      } else {
        generateMarkup(data, countriesListTemplate);
      }
    });
  }
  
  function generateMarkup(obj, template) {
    clearList();
    const markup = template(obj);
    refs.section.insertAdjacentHTML('beforeend', markup);
  }
  
  function clearList() {
    refs.section.innerHTML = '';
  }
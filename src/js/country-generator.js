import countryService from './services/country-info.js';
import countriesListTemplate from '../templates/countries-list.hbs';
import countryInfoTemplate from '../templates/country-info.hbs';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import debounce from 'lodash.debounce';
import {error} from '@pnotify/core';

const refs = {
    form: document.querySelector('#search-form'),
    section: document.querySelector('#country-section'),
  };
  
  const nameValid = {
    MAXVIEWCOUNTRY: 10,
    MINVIEWCOUNTRY: 1,
  };
  
  refs.form.addEventListener('input', debounce(countryNameHandler, 500));
  
  function countryNameHandler(event) {
    const searchQuery = event.target.value;

    clearList();
  
    if (!searchQuery) {
      return;
    }
    
    countryService.fethSearchCountry(searchQuery).then(data => {
      if (data.length > nameValid.MAXVIEWCOUNTRY) {
        error({
          text: 'Too many matches found. Please enter a more specific query!',
          delay: 3000,
        });
      } else if (data.status === 404) {
        error({
          text: 'Country not found! Please specify your request!',
          delay: 3000,
        });
      } else if (data.length === nameValid.MINVIEWCOUNTRY) {
        generateMarkup(data[0], countryInfoTemplate);
      } else {
        generateMarkup(data, countriesListTemplate);
      }
    });
  }
  
  function generateMarkup(obj, template) {
    const markup = template(obj);
    refs.section.insertAdjacentHTML('beforeend', markup);
  }
  
  function clearList() {
    refs.section.innerHTML = '';
  }
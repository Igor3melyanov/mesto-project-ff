// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

import '../pages/index.css';
import { initialCards } from '../scripts/cards.js';
import {addCard, deleteCard, createNewCard} from '../components/card.js';
import {openPopup, closePopup} from '../components/modal.js';
const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const cardsContainer = document.querySelector('.places__list');
const formElement = document.querySelector('.popup__form');
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const formNewCard = document.forms['new-place'];
nameInput.value = profileTitle.textContent;
jobInput.value = profileDescription.textContent;
export {cardsContainer, formNewCard, imagePopup};
document.querySelectorAll('.popup').forEach(popup => {
  popup.classList.add('popup_is-animated')
});

initialCards.forEach(function (cardContent) {
  cardsContainer.append(addCard(cardContent, deleteCard));
});

document.addEventListener('click', function(evt) {
  if (evt.target.matches('.profile__edit-button')) {
    openPopup(editPopup);
  };
  if (evt.target.matches('.profile__add-button')) {
    openPopup(addPopup);
  };
  if (evt.target.matches('.popup__close') || evt.target.matches('.popup')) {
    closePopup();
  }
});

document.addEventListener('keydown', function(evt) {
  if (evt.key === 'Escape' && document.querySelector('.popup_is-opened')) {
    closePopup();
  }
})

function handleFormSubmit(evt) {
  evt.preventDefault();
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;
  profileTitle.textContent = nameValue;
  profileDescription.textContent = jobValue;
  closePopup();
};

formElement.addEventListener('submit', handleFormSubmit); 

formNewCard.addEventListener('submit', createNewCard);


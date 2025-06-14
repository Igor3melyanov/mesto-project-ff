// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

import '../pages/index.css';
import { initialCards } from '../scripts/cards.js';
import {openPopup, closePopup} from '../components/modal.js';
import {addCard, deleteCard} from '../components/card.js';
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
const newCardName = formNewCard.querySelector('.popup__input_type_card-name');
const newCardLink = formNewCard.querySelector('.popup__input_type_url');
const popupImage = imagePopup.querySelector('.popup__image'); 
const popupCaption = imagePopup.querySelector('.popup__caption'); 
nameInput.value = profileTitle.textContent;
jobInput.value = profileDescription.textContent;

//добавление анимации на открытие попапов
document.querySelectorAll('.popup').forEach(popup => {
  popup.classList.add('popup_is-animated')
});

initialCards.forEach(function (cardContent) {
  cardsContainer.append(addCard(cardContent, deleteCard, openImagePopup));
});

document.addEventListener('click', function(evt) {
  if (evt.target.matches('.profile__edit-button')) {
    openPopup(editPopup);
  };
  if (evt.target.matches('.profile__add-button')) {
    openPopup(addPopup);
  };
  if (evt.target.matches('.popup__close')) {
    const popup = evt.target.closest('.popup');
    closePopup(popup);
  };
  if (evt.target.matches('.popup')) {
  closePopup(evt.target);
  }
});

function handleFormEdit(evt) {
  evt.preventDefault();
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;
  profileTitle.textContent = nameValue;
  profileDescription.textContent = jobValue;
  closePopup(editPopup);
};

formElement.addEventListener('submit', handleFormEdit);

function openImagePopup (cardContent) {
  popupImage.src = cardContent.link;
  popupImage.alt = cardContent.name;
  popupCaption.textContent = cardContent.name;
  openPopup(imagePopup);
};

function createNewCard(evt) {
  evt.preventDefault();
  const newCard = {name: newCardName.value, link: newCardLink.value};
  cardsContainer.prepend(addCard(newCard, deleteCard, openImagePopup));
  closePopup(addPopup);
  formNewCard.reset();
};

formNewCard.addEventListener('submit', createNewCard);
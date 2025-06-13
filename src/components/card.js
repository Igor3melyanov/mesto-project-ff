import {formNewCard, cardsContainer, imagePopup} from "../scripts";
import {initialCards} from "../scripts/cards";
import {closePopup, openPopup} from "./modal";

function addCard(cardContent, deleteCard) {
  const card = document.querySelector('#card-template').content.querySelector('.card').cloneNode(true);
  const cardImage = card.querySelector('.card__image');
  const cardTitle = card.querySelector('.card__title');
  cardImage.src = cardContent.link;
  cardImage.alt = cardContent.name;
  cardTitle.textContent = cardContent.name;
  card.querySelector('.card__delete-button').addEventListener('click', function() {
    deleteCard(card);
  });
  card.querySelector('.card__like-button').addEventListener('click', function(evt) {
    evt.target.classList.toggle('card__like-button_is-active');
  });
  card.querySelector('.card__image').addEventListener('click', function(evt) {
    openPopup(imagePopup);
    const popupImage = imagePopup.querySelector('.popup__image');
    const popupCaption = imagePopup.querySelector('.popup__caption');
    popupImage.src = evt.target.src;
    popupImage.alt = evt.target.alt;
    popupCaption.textContent = evt.target.alt;
  })
  return card;
};

function deleteCard(card) {
  card.remove();
};

function createNewCard(evt) {
  evt.preventDefault();
  const newCardName = formNewCard.querySelector('.popup__input_type_card-name');
  const newCardLink = formNewCard.querySelector('.popup__input_type_url');
  const newCard = {name: newCardName.value, link: newCardLink.value};
  initialCards.unshift(newCard);
  cardsContainer.prepend(addCard(newCard, deleteCard));
  closePopup();
  formNewCard.reset();
};

export{addCard, deleteCard, createNewCard};
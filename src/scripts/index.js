import '../pages/index.css';
import {openPopup, closePopup} from '../components/modal.js';
import {addCard, deleteCard, handleLikeClick, openDeleteConfirmationPopup} from '../components/card.js';
import {enableValidation, clearValidation} from './validation.js';
import {getInitialCards, getUserInfo, updateProfileInfo, patchUserInfo, postNewCard, patchUserAvatar} from './api.js';
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
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};
const formEdit = document.forms['edit-profile'];
let currentUserId = null;
const avatarPopup = document.querySelector('.popup_type_new-avatar');
const errorPopup = document.querySelector('.popup_type_error');
const avatarForm = document.forms['new-avatar'];
const profileImage = document.querySelector('.profile__image');
const linkInAvatarForm = avatarForm.elements.link;
const popupMessage = document.querySelector('.popup__message');

//добавление анимации на открытие попапов
document.querySelectorAll('.popup').forEach(popup => {
  popup.classList.add('popup_is-animated')
});

function openImagePopup (cardContent) {
  popupImage.src = cardContent.link;
  popupImage.alt = cardContent.name;
  popupCaption.textContent = cardContent.name;
  openPopup(imagePopup);
};

function loadAppData() {
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    renderCards(cards, currentUserId);
  })
  .catch(err => {
    console.error('Ошибка:', err);
  });
}

function renderCards(cards, userId) {
  cards.forEach(card => {
    cardsContainer.append(
      addCard(
        card, 
        userId,
        openImagePopup,
        handleLikeClick
      )
    );
  });
}


document.addEventListener('click', function(evt) {
  if (evt.target.matches('.profile__edit-button')) {
    clearValidation(formEdit, validationConfig);
    openPopup(editPopup);
  };
  if (evt.target.matches('.profile__add-button')) {
    clearValidation(formNewCard, validationConfig)
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
  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
    submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;
  const newData = {
    name: nameInput.value, 
    about: jobInput.value
  };
  patchUserInfo(newData)
    .then(userData => {
      setUserInfo(userData.name, userData.about);
      closePopup(editPopup);
    })
    .catch(err => {
      console.error('Ошибка:', err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
};

formElement.addEventListener('submit', handleFormEdit);

function createNewCard(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Создание...';
  submitButton.disabled = true;
  const newCard = {
    name: newCardName.value.trim(),
    link: newCardLink.value.trim()
  };
  postNewCard(newCard)
    .then(cardContent => {
      const cardElement = addCard(
        cardContent, 
        currentUserId, 
        openImagePopup, 
        (cardId, likeButton) => {
          const likeCounter = likeButton.closest('.card').querySelector('.card__likes-count');
          return handleLikeClick(cardId, likeButton, likeCounter);
        }
      );
      cardsContainer.prepend(cardElement);
      closePopup(addPopup);
      formNewCard.reset();
    })
    .catch(err => {
      console.error('Ошибка:', err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
};

formNewCard.addEventListener('submit', createNewCard);

enableValidation(validationConfig);
getInitialCards();
getUserInfo()
  .then(userData => {
    updateProfileInfo(userData);
    document.querySelector('.popup__input_type_name').value = userData.name;
    document.querySelector('.popup__input_type_description').value = userData.about;
  })
  .catch(err => {
    console.log('Что-то пошло не так', err)
  });

loadAppData();

const setUserInfo = (name, description, avatar) => {
  profileTitle.textContent = name;
  profileDescription.textContent = description;
  if(avatar)
    profileImage.style.backgroundImage = `url(${avatar})`;
};

profileImage.addEventListener('click', () => openPopup(avatarPopup));
avatarPopup.addEventListener('submit', (evt) => avatarPopupSubmit(evt));

const avatarPopupSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;
  patchUserAvatar(linkInAvatarForm.value)
    .then(user => {
      profileImage.style.backgroundImage = `url(${user.avatar})`;
      closePopup(avatarPopup);
    })
    .catch(err => {
      showError(err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      avatarForm.reset();
      clearValidation(avatarForm, validationConfig);
    });
}
import '../pages/index.css';
import {openPopup, closePopup} from '../components/modal.js';
import {addCard, deleteCard, handleLikeClick} from '../components/card.js';
import {enableValidation, clearValidation} from './validation.js';
import {getInitialCards, getUserInfo, patchUserInfo, postNewCard, patchUserAvatar, deleteCardFromServer} from './api.js';
const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const cardsContainer = document.querySelector('.places__list');
const popupEditProfile = document.forms['edit-profile'];
const nameInput = popupEditProfile.querySelector('.popup__input_type_name');
const jobInput = popupEditProfile.querySelector('.popup__input_type_description');
const formNewCard = document.forms['new-place'];
const newCardName = formNewCard.querySelector('.popup__input_type_card-name');
const newCardLink = formNewCard.querySelector('.popup__input_type_url');
const popupImage = imagePopup.querySelector('.popup__image'); 
const popupImageCaption = imagePopup.querySelector('.popup__caption'); 
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
const linkInAvatarForm = avatarForm.elements.link;
const popupMessage = document.querySelector('.popup__message');
let currentCardToDelete = null;
let currentCardIdToDelete = null;
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');
const editProfileButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const popupCloseButtons = document.querySelectorAll('.popup__close');
const popups = document.querySelectorAll('.popup');

//добавление анимации на открытие попапов
document.querySelectorAll('.popup').forEach(popup => {
  popup.classList.add('popup_is-animated')
});

function openImagePopup (cardContent) {
  popupImage.src = cardContent.link;
  popupImage.alt = cardContent.name;
  popupImageCaption.textContent = cardContent.name;
  openPopup(imagePopup);
};

function loadAppData() {
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    updateProfileInfo(userData);
    setUserInfo(userData.name, userData.about, userData.avatar);
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

editProfileButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(formEdit, validationConfig);
  openPopup(editPopup);
});

addCardButton.addEventListener('click', () => {
  openPopup(addPopup);
});

popupCloseButtons.forEach(button => {
  button.addEventListener('click', () => {
    const popup = button.closest('.popup');
    closePopup(popup);
  });
});

popups.forEach(popup => {
  popup.addEventListener('click', (evt) => {
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
});

function handleSubmitButton(evt, isLoading, options = {}) {
  const button = evt.submitter;
  if (!button) return null;
  if (isLoading && !button.dataset.originalText) {
    button.dataset.originalText = button.textContent;
  }
  const originalText = button.dataset.originalText || options.defaultText || 'Сохранить';
  button.textContent = isLoading 
    ? (options.loadingText || 'Сохранение...') 
    : originalText;
  button.disabled = isLoading;
  return originalText;
};

function handleProfileEditSubmit(evt) {
  evt.preventDefault();
  handleSubmitButton(evt, true);
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
    .finally(() => handleSubmitButton(evt, false));
};

popupEditProfile.addEventListener('submit', handleProfileEditSubmit);

function createNewCard(evt) {
  evt.preventDefault();
  handleSubmitButton(evt, true, { loadingText: 'Создание...' });  
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
      clearValidation(formNewCard, validationConfig);
    })
    .catch(err => {
      console.error('Ошибка:', err);
    })
    .finally(() => handleSubmitButton(evt, false));
};

formNewCard.addEventListener('submit', createNewCard);

enableValidation(validationConfig);
getInitialCards();
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
  handleSubmitButton(evt, true);
    patchUserAvatar(linkInAvatarForm.value)
    .then(user => {
      profileImage.style.backgroundImage = `url(${user.avatar})`;
      closePopup(avatarPopup);
    })
    .catch(err => {
      showError(err);
    })
    .finally(() => {
      handleSubmitButton(evt, false);
      avatarForm.reset();
      clearValidation(avatarForm, validationConfig);
    });
};

export function openDeleteConfirmationPopup(cardElement, cardId) {
  currentCardToDelete = cardElement;
  currentCardIdToDelete = cardId;
  openPopup(deletePopup);
};
function closeDeleteConfirmationPopup() {
  currentCardToDelete = null;
  currentCardIdToDelete = null;
  closePopup(deletePopup);
}
function handleDeleteConfirm() {
  if (!currentCardToDelete || !currentCardIdToDelete) return;
  const deleteConfirmButton = document.querySelector('.popup_type_delete-card .popup__button');
  deleteConfirmButton.textContent = 'Удаление...';
  deleteConfirmButton.disabled = true;

  deleteCardFromServer(currentCardIdToDelete)
    .then(() => {
      currentCardToDelete.remove();
      closePopup(deletePopup);
    })
    .catch(err => {
      console.error('Ошибка удаления:', err);
      alert('Не удалось удалить карточку');
    })
    .finally(() => {
      deleteConfirmButton.textContent = 'Да';
      deleteConfirmButton.disabled = false;
    });
}

const deletePopup = document.querySelector('.popup_type_delete-card');
  if (deletePopup) {
    deletePopup.querySelector('.popup__button').addEventListener('click', handleDeleteConfirm);
    deletePopup.querySelector('.popup__close').addEventListener('click', () => {
      closePopup(deletePopup);
    });
    deletePopup.addEventListener('click', (evt) => {
      if (evt.target === deletePopup) {
        closeDeleteConfirmationPopup();
      }
    });
  };

const updateProfileInfo = (userData) => {
  profileTitle.textContent = userData.name;
  profileDescription.textContent = userData.about;
  profileImage.style.backgroundImage = `url(${userData.avatar})`;
};
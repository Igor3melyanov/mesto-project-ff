import { config, deleteCardFromServer } from "../scripts/api";
import { openPopup, closePopup } from "./modal";

function addCard(cardContent, currentUserId, openImagePopup, handleLikeClick) {
  const card = document.querySelector('#card-template').content.querySelector('.card').cloneNode(true);
  const cardImage = card.querySelector('.card__image');
  const cardTitle = card.querySelector('.card__title');
  const deleteButton = card.querySelector('.card__delete-button');
  const likeButton = card.querySelector('.card__like-button');
  const likeCounter = card.querySelector('.card__likes-count');
  if (!likeButton) {
    console.error('Кнопка лайка не найдена!');
    return card;
  }
  cardImage.src = cardContent.link;
  cardImage.alt = cardContent.name;
  cardTitle.textContent = cardContent.name;
  if (likeCounter) {
    likeCounter.textContent = cardContent.likes?.length || '0';
  }
  const isLiked = cardContent.likes?.some(like => like._id === currentUserId) || false;
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }
  if (cardContent.owner._id === currentUserId) {
    deleteButton.addEventListener('click', () => {
      openDeleteConfirmationPopup(card, cardContent._id);
    });
  } else {
    deleteButton.style.display = 'none';
  }
  cardImage.addEventListener('click', () => {
    openImagePopup(cardContent);
  });
  likeButton.addEventListener('click', () => {
    handleLikeClick(cardContent._id, likeButton, likeCounter)
      .catch(console.error);
  });
  return card;
}

function deleteCard(cardId, cardElement = null) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Ошибка: ${res.status}`);
      }
      return res.json();
    })
    .then(() => {
      if (cardElement) {
        cardElement.remove();
      }
      return true;
    })
    .catch(error => {
      console.error('Ошибка при удалении:', error);
      if (cardElement) {
        const deleteButton = cardElement.querySelector('.card__delete-button');
        if (deleteButton) {
          deleteButton.disabled = false;
          deleteButton.textContent = 'Удалить';
        }
      }
      
      throw error;
    });
}

const likeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers
  })
  .then(res => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  });
};

const unlikeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
  .then(res => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  });
};

function handleLikeClick(cardId, likeButton, likeCounter) {
  if (!likeButton || !likeButton.classList) {
    console.error('Некорректная кнопка лайка:', likeButton);
    return Promise.reject('Invalid like button');
  }
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  const likeMethod = isLiked ? unlikeCard : likeCard;
  return likeMethod(cardId)
    .then(updatedCard => {
      likeButton.classList.toggle('card__like-button_is-active');
      if (likeCounter) {
        likeCounter.textContent = updatedCard.likes.length || '0';
      }
      return updatedCard;
    })
    .catch(error => {
      console.error('Ошибка при обновлении лайка:', error);
      throw error;
    });
}

let currentCardToDelete = null;
let currentCardIdToDelete = null;

function openDeleteConfirmationPopup(cardElement, cardId) {
  currentCardToDelete = cardElement;
  currentCardIdToDelete = cardId;
  openPopup(deletePopup);
}
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
      closePopup(deletePopup); // Используем closePopup напрямую
    });
    deletePopup.addEventListener('click', (evt) => {
      if (evt.target === deletePopup) {
        closeDeleteConfirmationPopup();
      }
    });
  };

export{addCard, deleteCard, handleLikeClick, likeCard, unlikeCard, openDeleteConfirmationPopup, closeDeleteConfirmationPopup, handleDeleteConfirm};
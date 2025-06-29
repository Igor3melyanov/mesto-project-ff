import { likeCard, unlikeCard, deleteCardFromServer } from "../scripts/api";

function addCard(cardContent, currentUserId, openImagePopup, handleLikeClick, openDeleteConfirmationPopup) {
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
  likeCounter.textContent = cardContent.likes?.length || '0';
  if (cardContent.likes?.some(like => like._id === currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }
  if (cardContent.owner._id === currentUserId) {
    deleteButton.style.display = 'block';
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
  deleteCardFromServer(cardId)
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

export{addCard, deleteCard, handleLikeClick};
// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const cardsContainer = document.querySelector('.places__list');

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
  return card;
};

function deleteCard(card) {
  card.remove();
};

initialCards.forEach(function (cardContent) {
  cardsContainer.append(addCard(cardContent, deleteCard));
});
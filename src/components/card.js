function addCard(cardContent, deleteCard, openImagePopup) {
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
  card.querySelector('.card__image').addEventListener('click', function () {
    openImagePopup(cardContent);
  })
  return card;
};

function deleteCard(card) {
  card.remove();
};

export{addCard, deleteCard};
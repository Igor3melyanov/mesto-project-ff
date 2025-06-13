function openPopup(popup) {
  popup.classList.add('popup_is-opened');
};

function closePopup() {
  document.querySelector('.popup_is-opened').classList.remove('popup_is-opened')
};

export {openPopup, closePopup};
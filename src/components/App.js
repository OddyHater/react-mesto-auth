import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Switch from "react-switch";
import Header from './Header/Header';
import Main from './Main/Main';
import Footer from './Footer/Footer';
import PopupWithForm from './PopupWithForm/PopupWithForm';
import EditProfilePopup from './EditProfilePopup/EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup/EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup/AddPlacePopup';
import ImagePopup from './ImagePopup/ImagePopup';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute' ;
import AppApi from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { CardContext } from '../contexts/CardsContext';

function App() {

  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const [loggedIn, setLoggedIn] = useState(false);

  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const closeAllPopups = () => {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setSelectedCard(null);
  }

  useEffect(() => {
    AppApi.getProfileInfo()
      .then((res) => {
        setCurrentUser(res);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    AppApi.getInitialCards()
      .then((res) => {
        setCards(res);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    if(isLiked) {
      AppApi.removeLike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
        })
        .catch((err) => console.log(err));
    } else {
      AppApi.addLike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
        })
        .catch((err) => console.log(err));
    }
  }

  function handleCardDelete(card) {
    AppApi.removeCardFromServer(card._id)
      .then(() => {
        setCards((prev) => {

         return(
          prev.filter((c) => {
            return (c._id !== card._id);
          })
         )
        });
      })       
      .catch((err) => console.log(err));
  }
  
  function handleUpdateUser(data) {

    const newState = Object.assign(currentUser);

    newState.name = data.name;
    newState.about = data.about;
    
    AppApi.changeProfileInfo(data)
      .then(() => {
        setCurrentUser(newState);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }
  
  function handleAvatarUpdate(data) {

    const newState = Object.assign(currentUser);

    newState.avatar = data.avatar;

    AppApi.changeAvatar(data.avatar)
      .then(() => {
        setCurrentUser(newState);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  async function handleAddPlace(newCardData) {
    /*актуализируем стейт
    напрямую с сервера*/
    try {
      await AppApi.pushCardToServer(newCardData);
      const res = await AppApi.getInitialCards();
      setCards(res);

    } catch (err) {
      console.log(err);
    }

    closeAllPopups();
  }

  return (
    <BrowserRouter>
      <CurrentUserContext.Provider value={currentUser}>
      <CardContext.Provider value={cards}>

      <Header />

        <Routes>
          <Route path="/" 
            element={<ProtectedRoute element={Main} 
            onEditProfile={() => {setEditProfilePopupOpen(true)}}
            onAddPlace={() => {setAddPlacePopupOpen(true)}}
            onEditAvatar={() => {setEditAvatarPopupOpen(true)}}
            onCardClick={(card) => handleCardClick(card)}
            onCardLike={(card) => handleCardLike(card)}
            onCardDelete={(card) => handleCardDelete(card)}
          />} />
        </Routes>
      
    
      {/* <Main
        onEditProfile={() => {setEditProfilePopupOpen(true)}}
        onAddPlace={() => {setAddPlacePopupOpen(true)}}
        onEditAvatar={() => {setEditAvatarPopupOpen(true)}}
        onCardClick={(card) => handleCardClick(card)}
        onCardLike={(card) => handleCardLike(card)}
        onCardDelete={(card) => handleCardDelete(card)}
      /> */}

      <Footer />

      <EditProfilePopup 
        isOpen={isEditProfilePopupOpen} 
        onClose={closeAllPopups} 
        onUpdateUser={handleUpdateUser} 
      />

      <AddPlacePopup 
        isOpen={isAddPlacePopupOpen} 
        onClose={closeAllPopups} 
        onAddPlace={handleAddPlace} 
      />

      <EditAvatarPopup 
        isOpen={isEditAvatarPopupOpen} 
        onClose={closeAllPopups} 
        onAvatarUpdate={handleAvatarUpdate} 
      />

      <PopupWithForm
        name="delete"
        title="Вы уверены?"
        onClose={closeAllPopups}
        buttonText="Да">
      </PopupWithForm>

      <ImagePopup
        card={selectedCard}
        onClose={closeAllPopups}
      />

      </CardContext.Provider>
    </CurrentUserContext.Provider>
    </BrowserRouter>
  );
}

export default App;

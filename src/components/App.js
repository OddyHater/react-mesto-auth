import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Header from './Header/Header';
import Main from './Main/Main';
import Footer from './Footer/Footer';
import Login from './Login/Login';
import Register from './Register/Register';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';

import PopupWithForm from './PopupWithForm/PopupWithForm';
import EditProfilePopup from './EditProfilePopup/EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup/EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup/AddPlacePopup';
import ImagePopup from './ImagePopup/ImagePopup';
import InfoTooltip from './InfoTooltip/InfoTooltip';

import AppApi from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { CardContext } from '../contexts/CardsContext';

import success from '../images/svg/success.svg';
import cancel from '../images/svg/cancel.svg';


function App() {

  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isInfoPopupOpen, setisInfoPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [InfoImage, setInfoImage] = useState('');
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const closeAllPopups = () => {
    setEditProfilePopupOpen(false);
    setisInfoPopupOpen(false);
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

  function handleRegiser({email, password}) {
    if(!email || !password) {
      return;
    }

    AppApi.regiser({email, password})
      .then((res) => {
        if(res) {
          setInfoTitle('Вы успешно зарегистрировались!');
          setInfoImage(success);
          navigate('/sign-in', {replace: true});
        } else {
          setInfoTitle('Что-то пошло не так! Попробуйте ещё раз.');
          setInfoImage(cancel);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setisInfoPopupOpen(true);
      })
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
    <CurrentUserContext.Provider value={currentUser}>
      <CardContext.Provider value={cards}>

      <Header />

      <Routes>

        <Route path="/" element={<ProtectedRoute 
          element={Main}
          loggedIn={loggedIn}
          onEditProfile={() => {setEditProfilePopupOpen(true)}}
          onAddPlace={() => {setAddPlacePopupOpen(true)}}
          onEditAvatar={() => {setEditAvatarPopupOpen(true)}}
          onCardClick={(card) => handleCardClick(card)}
          onCardLike={(card) => handleCardLike(card)}
          onCardDelete={(card) => handleCardDelete(card)}
        />} />

        <Route path="/sign-up" element={<Register onSubmit={handleRegiser}/>} />

        <Route path="/sign-in" element={<Login />} />

      </Routes>

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

      <InfoTooltip 
        isOpen={isInfoPopupOpen}
        onClose={closeAllPopups}
        name={'info'}
        title={infoTitle}
        image={InfoImage}
      />

      </CardContext.Provider>
    </CurrentUserContext.Provider>  
  );
}

export default App;
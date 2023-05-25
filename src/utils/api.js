class Api {
  constructor({headers, url}) {
    this._headers = headers;
    this._url = url;
  }

  _getResponseData(res) {
    if(res.ok) {       
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getProfileInfo() {
    return fetch('https://nomoreparties.co/v1/cohort-62/users/me', {
      headers: this._headers
    })
      .then(res => {        
        return this._getResponseData(res);
      });
  }

  changeProfileInfo(item) {
    return fetch('https://nomoreparties.co/v1/cohort-62/users/me', {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: item.name,
        about: item.about
      })
    })
    .then(res => {
      return this._getResponseData(res);
    })
    .catch(err => {
      console.log(err);
    });
  }

  pushCardToServer({name, link, like, id}) {
    return fetch('https://mesto.nomoreparties.co/v1/cohort-62/cards', {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: link,
        like: like,
        _id: id
      })
    })
    .then(res => {
      return this._getResponseData(res);
    });
  }

  removeCardFromServer(cardID) {
    return fetch(`https://mesto.nomoreparties.co/v1/cohort-62/cards/${cardID}`, {
      method: 'DELETE',
      headers: this._headers
    })
    .then(res => {
      return this._getResponseData(res);
    })
  }

  addLike(cardId) {
    return fetch(`https://mesto.nomoreparties.co/v1/cohort-62/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: this._headers
    })
    .then(res => {
      return this._getResponseData(res);
    })
  }

  removeLike(cardId) {
    return fetch(`https://mesto.nomoreparties.co/v1/cohort-62/cards/${cardId}/likes`, {
      method: 'DELETE', 
      headers: this._headers
    })
    .then(res => {
      return this._getResponseData(res);
    })
  }

  changeAvatar(link) {  
    return fetch(`https://mesto.nomoreparties.co/v1/cohort-62/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: link
      })
    })
    .then(res => {
      return this._getResponseData(res);
    })
  }

  getInitialCards() {
    return fetch('https://mesto.nomoreparties.co/v1/cohort-62/cards', {
      headers: this._headers
    })
    .then(res => {      
      return this._getResponseData(res);
    })   
  }

  regiser({email, password}) {
    return fetch(`${this._url}/signup`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({password, email})
    })
    .then((response) => {
      try {
        if (response.status === 200){
          return response.json();
        }
      } catch(e){
        return (e)
      }
    })
    .then(res => res)
    .catch((err) => console.log(err));
  }

  login({email, password}) {
    return fetch(`${this._url}/signin`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email, password})
    })
    .then((response) => {
      try {
        if (response.status === 200){
          return response.json();
        }
      } catch(e){
        return (e)
      }
    })
    .then(res => res)
    .catch((err) => console.log(err));
  }
  
}

const apiOptions = {  
  headers: {
    authorization: '49fa0164-6f79-4747-b9b7-a7fde6f409fd',
    'Content-type': 'application/json'
  },

  url: 'https://auth.nomoreparties.co'
};


const AppApi = new Api(apiOptions);

export default AppApi;
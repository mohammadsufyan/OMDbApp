import * as responseTypes from './ResponseTypes';

const baseURL = 'http://www.omdbapi.com/';

export const callGetAPI = (url, handler) => {
  fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then((response) => response.json())
      .then((responseJson) => {
        handler(responseTypes.SUCCESS, responseJson);
        return responseJson;
      })
      .catch((error) => {
        handler(responseTypes.FAILURE, error);
        // console.error('=====> error: ',error);
      });
};

export const makeFetchRequest = (searchText, handler) => {
  const url = baseURL+'?t='+searchText;
  callGetAPI(url, handler);
};

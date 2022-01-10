import React from 'react';

export const AppContext = React.createContext();

// Set up Initial State
export const initialState = {
  showLoader: false,
  alert: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'SHOW_ALERT':
      return {
        ...state,
        alert: { ...action.payload },
      };
    case 'HIDE_ALERT':
      return {
        ...state,
        alert: null,
      };
    case 'SET_STATIC_DATA':
      return {
        ...state,
        staticData: action.payload,
      };

    default:
      return initialState;
  }
}

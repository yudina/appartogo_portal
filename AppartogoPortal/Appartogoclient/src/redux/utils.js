export const requestState = (state, isLoading) => {
  return {
    ...state,
    isLoading,
  };
};

export const failureState = (state, action) => {
  return {
    ...state,
    error: action.payload,
    isLoading: false,
  };
};

export const requestActionCreator = (type) => {
  return {
    type,
  };
};

export const responseActionCreator = (type, payload) => {
  return {
    type,
    payload,
  };
};

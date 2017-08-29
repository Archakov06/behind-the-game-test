export const addUser = (value) => {
  return {
    type: 'ADD_USER',
    payload: value
  };
};

export const removeUser = (i) => {
  return {
    type: 'REMOVE_USER',
    payload: i
  };
};

export const editUser = (i, data) => {
  return {
    type: 'EDIT_USER',
    payload: {
      index: i,
      data: data
    }
  };
};

export const setUsers = (data) => {
  return {
    type: 'SET_USERS',
    payload: data
  };
};

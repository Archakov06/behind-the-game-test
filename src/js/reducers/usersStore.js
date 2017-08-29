const initialState = {
  users: [],
};

export default function usersStore(state = initialState, action) {

  switch (action.type) {
    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload]
      }
    case 'REMOVE_USER':
      return {
        ...state,
        users: state.users.filter((_, i) => i != action.payload)
      }
    case 'EDIT_USER':
      return {
        ...state,
        users: state.users.map((item, i) => action.payload.index == i ? action.payload.data : item)
      }
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload
      }
    default:
      return state;
  }

};

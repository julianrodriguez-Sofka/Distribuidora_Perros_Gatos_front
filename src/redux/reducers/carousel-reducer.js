const initialState = {
  images: [],
  isLoading: false,
  error: null,
};

const carouselReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_CAROUSEL_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_CAROUSEL_SUCCESS':
      return {
        ...state,
        images: action.payload.sort((a, b) => a.orden - b.orden),
        isLoading: false,
        error: null,
      };
    case 'FETCH_CAROUSEL_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'ADD_CAROUSEL_IMAGE_SUCCESS':
      return {
        ...state,
        images: [...state.images, action.payload].sort((a, b) => a.orden - b.orden),
      };
    case 'DELETE_CAROUSEL_IMAGE_SUCCESS':
      return {
        ...state,
        images: state.images.filter(img => img.id !== action.payload),
      };
    case 'REORDER_CAROUSEL_SUCCESS':
      return {
        ...state,
        images: action.payload.sort((a, b) => a.orden - b.orden),
      };
    default:
      return state;
  }
};

export default carouselReducer;


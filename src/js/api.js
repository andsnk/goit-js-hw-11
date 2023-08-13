import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38682723-ccb8378626c039a4163c61aff';

export const getPhoto = async (query, page) => {
  try {
    const { data } = await axios(
      `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

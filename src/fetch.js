import axios from 'axios';
export async function fetchImages(searchValue, pageNumb, perPage) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '32404222-937c1bf72b6be116ae047f8a7';
  const searchParam = `?key=${API_KEY}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${pageNumb}`;
  const response = await axios.get(`${BASE_URL}${searchParam}`);
  return response;
}

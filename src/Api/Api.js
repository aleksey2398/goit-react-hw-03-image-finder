import axios from 'axios';

const key = '24499282-2c88a00bf4afff93913de8ef0';
const URL = "https://pixabay.com/api/";

export const fetchImages = async (searchQuery, currentPage) => {
  try {
    const result = await axios.get(URL, {
      params: {
        key: key,
        q: searchQuery,
        page: currentPage,
        per_page: 12,
        image_type: "photo",
        orientation: "horizontal",
      },
    });
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetch';

let q = '';
let page = 1;
let simpleLightBox;
const perPage = 40;

const refs = {
  input: document.querySelector('.input'),
  form: document.querySelector('#search-form'),
  div: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
};
// console.log(refs.button);
refs.button.classList.add('is-hidden');
function createGalleryMarkup(data) {
  return data.reduce(
    (
      acc,
      { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) => `${acc}<div class="photo-card">
  <a class="gallery__item" href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="350" height="200" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`,
    ''
  );
}
function onError() {
  return 0;
}
function addMarkup(data) {
  return refs.div.insertAdjacentHTML('beforeend', createGalleryMarkup(data));
}
function onSubmit(e) {
  page = 1;
  e.preventDefault();
  q = e.currentTarget.searchQuery.value.trim();
  if (!q) return;
  refs.div.innerHTML = '';
  fetchImages(q, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        refs.button.classList.add('is-hidden');
        refs.div.innerHTML = '';
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      if (data.totalHits > perPage) {
        refs.button.classList.remove('is-hidden');
        refs.button.textContent = 'Load More';
      }
      if (data.totalHits < perPage && data.totalHits != 0) {
        refs.button.classList.add('is-hidden');
      }
      addMarkup(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    })
    .catch(onError);
}
function onLoadMore(e) {
  page++;
  simpleLightBox.destroy();
  fetchImages(q, page, perPage)
    .then(({ data }) => {
      addMarkup(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      const totalPages = Math.ceil(data.totalHits / perPage);
      if (page > totalPages) {
        refs.button.classList.add('is-hidden');
        return Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(onError);
}
refs.form.addEventListener('submit', onSubmit);
refs.button.addEventListener('click', onLoadMore);

// test

// const onFormSubmit = function (e) {
//   e.preventDefault();
//   page = 1;
//   searchValue = e.currentTarget.searchQuery.value.trim();
//   if (!searchValue) return;
//   fetchImages(searchValue, pageNumb, perPage).then(({ data }) => {
//     console.log(data.hits);
//   });
// };
// refs.form.addEventListener('submit', onFormSubmit);
// refs.button.addEventListener('click', onLoadMoreBtn);

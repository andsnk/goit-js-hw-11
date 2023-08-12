import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { getPhoto } from './js/api';

const form = document.querySelector('.search-form');
const loadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', submitForm);
loadMore.addEventListener('click', onLoadMore);

let page = 1;
let searchQuery = '';
let totalPages = 0;
const lightbox = new SimpleLightbox('.gallery a');

function submitForm(evt) {
  evt.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  loadMore.classList.add('is-hidden');
  searchQuery = evt.currentTarget.elements.searchQuery.value;
  if (searchQuery) {
    getPhoto(searchQuery, page)
      .then(data => {
        if (data.hits.length !== 0) {
          createMarkup(data);
          loadMore.classList.remove('is-hidden');
          totalPages = Math.ceil(data.totalHits / 40);
          console.log(totalPages);
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);
          form.reset();
        } else
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
      })
      .catch(error => Notiflix.Notify.failure(error.message));
  } else Notiflix.Notify.info('Please fill in the search field');
}

function createMarkup(data) {
  const markup = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<a href="${largeImageURL}" class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300px" height="200px" />
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
    </a>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function onLoadMore() {
  page += 1;
  getPhoto(searchQuery, page)
    .then(data => {
      createMarkup(data);
      if (page >= totalPages) {
        loadMore.classList.add('is-hidden');
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })
    .catch(error => Notiflix.Notify.failure(error.message));
}

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
Notiflix.Notify.init({
  width: '280px',
  position: 'top',
  distance: '60px',
  opacity: 1,
});
import { getPhoto } from './js/api';
import { scrollToTop, showScroll } from './js/scroll';

const form = document.querySelector('.search-form');
const loadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', submitForm);
loadMore.addEventListener('click', onLoadMore);

let page = 1;
let searchQuery = '';
let totalPages = 0;
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function submitForm(evt) {
  evt.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  loadMore.classList.add('is-hidden');
  searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
  if (searchQuery) {
    getPhoto(searchQuery, page)
      .then(data => {
        if (data.hits.length !== 0) {
          createMarkup(data);
          totalPages = Math.ceil(data.totalHits / 40);
          if (page !== totalPages) {
            loadMore.classList.remove('is-hidden');
          }
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);
          form.reset();
        } else
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
      })
      .catch(error => Notiflix.Notify.failure(error.message));
  } else Notiflix.Notify.warning('Please fill in the search field');
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
        `<div class="photo-card-wrap">
        <a href="${largeImageURL}" class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" width="380px" height="230px" />
      <div class="info">
        <p class="info-item">
          <span class="info-top-text">Likes</span><span class="info-bottom-text">${likes}</span>
        </p>
        <p class="info-item">
          <span class="info-top-text">Views</span><span class="info-bottom-text">${views}</span>
        </p>
        <p class="info-item">
          <span class="info-top-text">Comments</span><span class="info-bottom-text">${comments}</span>
        </p>
        <p class="info-item">
          <span class="info-top-text">Downloads</span><span class="info-bottom-text">${downloads}</span>
        </p>
      </div>
    </a>
    </div>`
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

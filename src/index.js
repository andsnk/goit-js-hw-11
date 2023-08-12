import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { fetchImages } from './js/api';

const galleryImages = document.querySelector('.gallery-js');
const loadMore = document.querySelector('.load-more-btn');
const searchForm = document.querySelector('.search-form-js');

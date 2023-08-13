const upScrollLink = document.querySelector('.scroll-up');

window.addEventListener('scroll', showScroll);
upScrollLink.addEventListener('click', scrollToTop);

export function showScroll() {
  if (window.scrollY > 400) {
    upScrollLink.classList.add('is-visible');
  } else {
    upScrollLink.classList.remove('is-visible');
  }
}

export function scrollToTop() {
  if (window.scrollY > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

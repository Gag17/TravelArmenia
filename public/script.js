const images = document.querySelectorAll('.image-carousel img');
const title = document.getElementById('carousel-title');
const description = document.getElementById('carousel-description');
const dotContainer = document.getElementById('dot-container');
let currentIndex = 0;
let intervalId;

function showImage(index) {
  images.forEach((img, i) => {
    img.style.opacity = i === index ? 1 : 0;
  });

  updateDots(index);
}

function changeImage(step) {
  currentIndex = (currentIndex + step + images.length) % images.length;
  showImage(currentIndex);
}

function createDot(index) {
  const dot = document.createElement('div');
  dot.classList.add('carousel-dot');
  dot.addEventListener('click', () => showImage(index));
  return dot;
}

function updateDots(index) {
  dotContainer.innerHTML = '';
  for (let i = 0; i < images.length; i++) {
    const dot = createDot(i);
    if (i === index) {
      dot.classList.add('active');
    }
    dotContainer.appendChild(dot);
  }
}

function startCarousel() {
  intervalId = setInterval(() => {
    changeImage(1);
  }, 7000);
}

function stopCarousel() {
  clearInterval(intervalId);
}

showImage(currentIndex);

startCarousel();
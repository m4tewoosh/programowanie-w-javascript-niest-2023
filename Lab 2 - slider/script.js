const slideLeftButton = document.getElementById("left");
const slideRightButton = document.getElementById("right");
const pauseButton = document.getElementById("pause");

const slidesWrapper = document.getElementById("slides");
const dotsWrapper = document.getElementById("dots");

const slidesCount = slidesWrapper.children.length;
let currentSlide = 1;
let intervalRef;

const handleSlideLeft = () => {
  if (currentSlide === 1) {
    return;
  }

  pauseSlider();

  const transformAmount = currentSlide * 600 - 1200;

  slidesWrapper.style.transform = `translateX(${-transformAmount}px)`;
  currentSlide--;

  clearDotsClasses();
  dotsWrapper.children[currentSlide - 1].classList.add("activeDot");

  resumeSlider();
};

slideLeftButton.onclick = handleSlideLeft;

const handleSlideRight = () => {
  pauseSlider();
  if (currentSlide === slidesCount) {
    slidesWrapper.style.transform = `translateX(0px)`;
    currentSlide = 1;

    clearDotsClasses();
    dotsWrapper.children[0].classList.add("activeDot");

    resumeSlider();
    return;
  }

  const transformAmount = currentSlide * 600;

  slidesWrapper.style.transform = `translateX(-${transformAmount}px)`;
  currentSlide++;

  clearDotsClasses();
  dotsWrapper.children[currentSlide - 1].classList.add("activeDot");

  resumeSlider();
};

slideRightButton.onclick = handleSlideRight;

const pauseSlider = () => {
  if (intervalRef) {
    clearInterval(intervalRef);
    intervalRef = null;

    pauseButton.innerHTML = "Wznów slider";
  }
};

const resumeSlider = () => {
  if (!intervalRef) {
    intervalRef = setInterval(handleSlideRight, 2000);
    pauseButton.innerHTML = "Zapauzuj slider";
  }
};

const handlePauseButton = () => {
  if (intervalRef) {
    pauseSlider();
    return;
  }
  resumeSlider();
};

pauseButton.onclick = handlePauseButton;

const handleDotClick = (e) => {
  pauseSlider();
  clearDotsClasses();

  const slideIndex = e.target.id;
  currentSlide = Number(slideIndex);

  e.target.classList.add("activeDot");

  const transformAmount = slideIndex * 600 - 600;
  slidesWrapper.style.transform = `translateX(-${transformAmount}px)`;

  resumeSlider();
};

const createDots = () => {
  for (let i = 0; i < slidesCount; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    dot.id = `${i + 1}`;
    dot.onclick = handleDotClick;
    dotsWrapper.appendChild(dot);
  }
};

const clearDotsClasses = () => {
  const dots = dotsWrapper.children;
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("activeDot");
  }
};

const init = () => {
  createDots();
  dotsWrapper.children[0].classList.add("activeDot");
  intervalRef = setInterval(handleSlideRight, 2000);
};

init();

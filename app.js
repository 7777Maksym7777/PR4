// ZenSpace — інтерактивність на JavaScript (DOM та BOM)

// Вибір елементів DOM сучасними методами querySelector / querySelectorAll.
const themeButton = document.querySelector("#themeButton");
const infoButton = document.querySelector("#infoButton");
const modal = document.querySelector("#infoModal");
const closeModalButton = document.querySelector("#closeModal");
const modalOkButton = document.querySelector("#modalOk");
const reviewForm = document.querySelector("#reviewForm");
const reviewName = document.querySelector("#reviewName");
const reviewText = document.querySelector("#reviewText");
const reviewList = document.querySelector("#reviewList");
const reviewCount = document.querySelector("#reviewCount");
const nameError = document.querySelector("#nameError");
const textError = document.querySelector("#textError");
const formStatus = document.querySelector("#formStatus");
const charCount = document.querySelector("#charCount");
const scrollProgress = document.querySelector("#scrollProgress");

let totalReviews = reviewList.querySelectorAll(".review-card").length;

// Перемикання теми через classList.toggle().
themeButton.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  themeButton.textContent = isDark ? "☀" : "☾";
  themeButton.setAttribute("aria-label", isDark ? "Увімкнути світлу тему" : "Увімкнути темну тему");
});

// Модальне вікно: відкриття, закриття кнопками та кліком на фон.
function openModal() {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  closeModalButton.focus();
}
function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  infoButton.focus();
}
infoButton.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);
modalOkButton.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

// Подія клавіатури keydown: Escape закриває модальне вікно.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

// Лічильник символів — подія input.
reviewText.addEventListener("input", () => {
  charCount.textContent = `${reviewText.value.length} / 300`;
});

// Допоміжна функція створює аватар з першої літери імені.
function getInitial(name) {
  return name.trim().charAt(0).toUpperCase();
}

// Обробка submit. preventDefault() не дозволяє браузеру перезавантажити сторінку.
reviewForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = reviewName.value.trim();
  const message = reviewText.value.trim();
  let isValid = true;

  nameError.textContent = "";
  textError.textContent = "";
  formStatus.textContent = "";

  if (name.length < 2) {
    nameError.textContent = "Введи ім’я (мінімум 2 символи).";
    isValid = false;
  }
  if (message.length < 5) {
    textError.textContent = "Відгук має містити щонайменше 5 символів.";
    isValid = false;
  }
  if (!isValid) {
    formStatus.textContent = "Перевір, будь ласка, заповнення полів.";
    return;
  }

  // Створення вузлів DOM. textContent безпечно вставляє введений користувачем текст.
  const article = document.createElement("article");
  article.classList.add("review-card");

  const top = document.createElement("div");
  top.classList.add("review-top");

  const avatar = document.createElement("span");
  avatar.classList.add("review-avatar");
  avatar.textContent = getInitial(name);

  const userInfo = document.createElement("div");
  const userName = document.createElement("h3");
  userName.textContent = name;
  const subtitle = document.createElement("span");
  subtitle.textContent = "Новий відгук";
  userInfo.append(userName, subtitle);

  const date = document.createElement("span");
  date.classList.add("review-date");
  date.textContent = "Щойно";
  top.append(avatar, userInfo, date);

  const paragraph = document.createElement("p");
  paragraph.textContent = message;

  const likeButton = document.createElement("button");
  likeButton.type = "button";
  likeButton.classList.add("like-button");
  likeButton.setAttribute("aria-label", "Вподобати відгук");
  likeButton.setAttribute("aria-pressed", "false");
  const heart = document.createElement("span");
  heart.textContent = "♡";
  const count = document.createElement("span");
  count.classList.add("like-count");
  count.textContent = "0";
  likeButton.append(heart, document.createTextNode(" "), count);

  article.append(top, paragraph, likeButton);
  reviewList.prepend(article);

  totalReviews += 1;
  reviewCount.textContent = totalReviews;
  reviewForm.reset();
  charCount.textContent = "0 / 300";
  formStatus.textContent = "Дякуємо! Твій відгук успішно додано.";
});

// Делегування події click для всіх кнопок вподобань (у тому числі нових).
reviewList.addEventListener("click", (event) => {
  // Знаходимо кнопку серед елементів списку через querySelectorAll().
  const likeButtons = reviewList.querySelectorAll(".like-button");
  let button = null;
  likeButtons.forEach((item) => {
    if (item === event.target || item.contains(event.target)) button = item;
  });
  if (!button) return;

  const isLiked = button.classList.toggle("liked");
  button.setAttribute("aria-pressed", String(isLiked));
  const countElement = button.querySelector(".like-count");
  const currentCount = Number(countElement.textContent);
  countElement.textContent = isLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
  button.querySelector("span").textContent = isLiked ? "♥" : "♡";
});

// BOM: window scroll та innerWidth.
window.addEventListener("scroll", () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
});

window.addEventListener("resize", () => {
  // Демонстрація читання ширини вікна браузера через BOM.
  document.body.dataset.screen = window.innerWidth < 600 ? "mobile" : "desktop";
});
document.body.dataset.screen = window.innerWidth < 600 ? "mobile" : "desktop";

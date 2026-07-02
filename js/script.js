// Собственный JavaScript для лабораторной работы №3

document.addEventListener('DOMContentLoaded', () => {
  initOrderForm();
  initCatalogSearch();
});

/**
 * Обработка формы бронирования:
 * - отключает стандартную отправку формы;
 * - проверяет обязательные поля;
 * - дополнительно проверяет телефон;
 * - выводит данные в console.log;
 * - показывает Bootstrap Modal Dialog с результатом.
 */
function initOrderForm() {
  const form = document.querySelector('#orderForm');

  // На страницах без формы функция просто не выполняется.
  if (!form) return;

  const phoneInput = form.querySelector('#userPhone');
  const modalElement = document.querySelector('#formResultModal');
  const modalMessage = document.querySelector('#modalMessage');
  const resultModal = modalElement ? new bootstrap.Modal(modalElement) : null;

  // Проверка телефона: считаем количество цифр.
  function isPhoneValid(value) {
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  }

  // Проверка телефона при вводе.
  phoneInput.addEventListener('input', () => {
    if (isPhoneValid(phoneInput.value)) {
      phoneInput.setCustomValidity('');
    } else {
      phoneInput.setCustomValidity('Введите корректный номер телефона');
    }
  });

  // Обработка кнопки submit.
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!isPhoneValid(phoneInput.value)) {
      phoneInput.setCustomValidity('Введите корректный номер телефона');
    } else {
      phoneInput.setCustomValidity('');
    }

    const isValid = form.checkValidity();
    form.classList.add('was-validated');

    const formData = Object.fromEntries(new FormData(form).entries());

    if (isValid) {
      console.log('Данные формы успешно обработаны:', formData);

      if (modalMessage) {
        modalMessage.textContent = 'Бронирование успешно оформлено. Данные выведены в консоль разработчика.';
      }

      if (resultModal) resultModal.show();
      form.reset();
      form.classList.remove('was-validated');
    } else {
      console.log('Данные формы некорректны:', formData);

      if (modalMessage) {
        modalMessage.textContent = 'Данные некорректны. Проверьте обязательные поля, email и номер телефона.';
      }

      if (resultModal) resultModal.show();
    }
  });
}

/**
 * Поиск по странице со списком данных:
 * при вводе текста скрывает строки таблицы, которые не подходят под запрос.
 */
function initCatalogSearch() {
  const searchInput = document.querySelector('#searchInput');
  const rows = document.querySelectorAll('.data-row');
  const resultCount = document.querySelector('#resultCount');
  const emptyMessage = document.querySelector('#emptyMessage');

  // На страницах без списка данных функция просто не выполняется.
  if (!searchInput || rows.length === 0) return;

  function filterRows() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    rows.forEach((row) => {
      const rowText = row.textContent.toLowerCase();
      const isVisible = rowText.includes(query);

      row.classList.toggle('d-none', !isVisible);

      if (isVisible) visibleCount += 1;
    });

    if (resultCount) resultCount.textContent = visibleCount;
    if (emptyMessage) emptyMessage.classList.toggle('d-none', visibleCount === 0 ? false : true);
  }

  searchInput.addEventListener('input', filterRows);
  filterRows();
}

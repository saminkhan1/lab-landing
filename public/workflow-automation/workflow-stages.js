document.documentElement.classList.add('js');

const canvas = document.querySelector('.workflow-canvas');
const tabs = [...document.querySelectorAll('.workflow-tab')];

if (canvas && tabs.length) {
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const stage = tab.dataset.stage;
      canvas.dataset.active = stage;
      tabs.forEach((item) => item.setAttribute('aria-pressed', String(item === tab)));
    });
  });
}

const approve = document.querySelector('[data-demo-approve]');
if (approve) {
  approve.addEventListener('click', () => {
    approve.textContent = 'Approved ✓';
    approve.classList.add('is-approved');
    approve.disabled = true;
  });
}

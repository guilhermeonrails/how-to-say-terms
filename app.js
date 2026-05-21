let currentFilter = 'all';
let currentSearch = '';
let currentSort = 'az';

const grid = document.getElementById('terms-grid');
const searchInput = document.getElementById('search');
const counter = document.getElementById('counter');
const letterButtons = document.querySelectorAll('.letter-btn');
const sortButtons = document.querySelectorAll('.sort-btn');

function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function getFiltered() {
  return techTerms.filter(term => {
    const matchesLetter = currentFilter === 'all' || term.word.toUpperCase().startsWith(currentFilter);
    const q = normalize(currentSearch);
    const matchesSearch = !q ||
      normalize(term.word).includes(q) ||
      normalize(term.pronunciation).includes(q);
    return matchesLetter && matchesSearch;
  }).sort((a, b) => {
    if (currentSort === 'az') return a.word.localeCompare(b.word);
    return b.word.localeCompare(a.word);
  });
}

function highlight(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function render() {
  const filtered = getFiltered();
  const q = currentSearch;

  counter.textContent = `${filtered.length} termo${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>Nenhum termo encontrado para "<strong>${currentSearch}</strong>"</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map((term, i) => `
    <div class="card" style="--i:${i % 20}">
      <div class="card-word">${highlight(term.word, q)}</div>
      <div class="card-pronunciation">
        <span class="pron-label">Como se pronuncia</span>
        <span class="pron-value">${highlight(term.pronunciation, q)}</span>
      </div>
      <div class="card-meaning">${highlight(term.meaning, q)}</div>
    </div>
  `).join('');
}

searchInput.addEventListener('input', (e) => {
  currentSearch = e.target.value.trim();
  currentFilter = 'all';
  letterButtons.forEach(b => b.classList.remove('active'));
  document.querySelector('[data-letter="all"]').classList.add('active');
  render();
});

letterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.letter;
    currentSearch = '';
    searchInput.value = '';
    letterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

sortButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentSort = btn.dataset.sort;
    sortButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

document.getElementById('clear-search').addEventListener('click', () => {
  searchInput.value = '';
  currentSearch = '';
  render();
});

searchInput.addEventListener('input', () => {
  document.getElementById('clear-search').style.display = searchInput.value ? 'flex' : 'none';
});

render();

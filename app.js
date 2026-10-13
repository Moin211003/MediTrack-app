// MediTrack - Smart Medicine Tracker Application
const medForm = document.getElementById('med-form');
const medList = document.getElementById('med-list');
const emptyState = document.getElementById('empty-state');
const clearAllBtn = document.getElementById('clear-all-btn');

const totalCount = document.getElementById('total-count');
const takenCount = document.getElementById('taken-count');
const pendingCount = document.getElementById('pending-count');

// Fetch from LocalStorage or empty array
let medicines = JSON.parse(localStorage.getItem('meditrack_records')) || [];

function saveAndRender() {
  localStorage.setItem('meditrack_records', JSON.stringify(medicines));
  renderMedicines();
  updateStats();
}

function updateStats() {
  const total = medicines.length;
  const taken = medicines.filter(m => m.taken).length;
  const pending = total - taken;

  totalCount.textContent = total;
  takenCount.textContent = taken;
  pendingCount.textContent = pending;
}

function renderMedicines() {
  medList.innerHTML = '';

  if (medicines.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  medicines.forEach((med, index) => {
    const item = document.createElement('div');
    item.className = `med-item ${med.taken ? 'taken' : ''}`;

    item.innerHTML = `
      <div class="med-details">
        <span class="med-name">${med.name}</span>
        <span class="med-meta">
          <strong>Dosage:</strong> ${med.dosage} &bull; 
          <strong>Time:</strong> ${med.time} &bull; 
          <strong>Instruction:</strong> ${med.instructions}
        </span>
      </div>
      <div class="med-actions">
        <button class="action-btn btn-toggle" onclick="toggleStatus(${index})">
          ${med.taken ? '✓ Taken' : 'Mark Taken'}
        </button>
        <button class="action-btn btn-delete" onclick="deleteMedicine(${index})">
          Delete
        </button>
      </div>
    `;

    medList.appendChild(item);
  });
}

medForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('med-name').value.trim();
  const dosage = document.getElementById('med-dosage').value.trim();
  const time = document.getElementById('med-time').value;
  const instructions = document.getElementById('med-instructions').value;

  if (!name || !dosage || !time) return;

  const newMed = {
    name,
    dosage,
    time,
    instructions,
    taken: false
  };

  medicines.push(newMed);
  saveAndRender();

  medForm.reset();
});

window.toggleStatus = function (index) {
  medicines[index].taken = !medicines[index].taken;
  saveAndRender();
};

window.deleteMedicine = function (index) {
  medicines.splice(index, 1);
  saveAndRender();
};

clearAllBtn.addEventListener('click', () => {
  if (medicines.length === 0) return;
  if (confirm('Are you sure you want to clear all prescriptions?')) {
    medicines = [];
    saveAndRender();
  }
});

// Initial run
saveAndRender();
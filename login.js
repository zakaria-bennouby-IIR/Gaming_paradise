const form = document.getElementById('textForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const phoneInput = document.getElementById('phoneInput');
const list = document.getElementById('list');
const resetButton = document.getElementById('resetButton');

let isEditing = false; 
let editingItem = null; 

// Function to save data to local storage
function saveToLocalStorage() {
  const items = [];
  document.querySelectorAll('#list li').forEach(item => {
    const details = item.querySelector('span').textContent.split(' - ');
    items.push({
      name: details[0],
      email: details[1],
      phone: details[2]
    });
  });
  localStorage.setItem('listItems', JSON.stringify(items));
}

// Function to load data from local storage
function loadFromLocalStorage() {
  const items = JSON.parse(localStorage.getItem('listItems')) || [];
  items.forEach(item => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span>${item.name} - ${item.email} - ${item.phone}</span>
      <button class="modifyBtn">Modify</button>
      <button class="removeBtn">Remove</button>
    `;
    list.appendChild(listItem);
    
    const modifyBtn = listItem.querySelector('.modifyBtn');
    modifyBtn.addEventListener('click', () => {
      const currentDetails = listItem.querySelector('span').textContent.split(' - ');
      nameInput.value = currentDetails[0];
      emailInput.value = currentDetails[1];
      phoneInput.value = currentDetails[2];
      isEditing = true;
      editingItem = listItem;
    });

    const removeBtn = listItem.querySelector('.removeBtn');
    removeBtn.addEventListener('click', () => {
      list.removeChild(listItem);
      saveToLocalStorage(); // Save after removal
    });
  });
}

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name || !email || !phone) {
    alert("All fields are required.");
    return;
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    alert("Invalid email address.");
    return;
  }

  if (isEditing) {
    // Modify existing user
    editingItem.querySelector('span').textContent = `${name} - ${email} - ${phone}`;
    isEditing = false;
    editingItem = null;
    saveToLocalStorage(); // Save after modification
  } else {
    // Add new user to list
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span>${name} - ${email} - ${phone}</span>
      <button class="modifyBtn">Modify</button>
      <button class="removeBtn">Remove</button>
    `;
    list.appendChild(listItem);

    // Save to local storage
    saveToLocalStorage();

    const modifyBtn = listItem.querySelector('.modifyBtn');
    modifyBtn.addEventListener('click', () => {
      nameInput.value = name;
      emailInput.value = email;
      phoneInput.value = phone;
      isEditing = true;
      editingItem = listItem;
    });

    const removeBtn = listItem.querySelector('.removeBtn');
    removeBtn.addEventListener('click', () => {
      list.removeChild(listItem);
      saveToLocalStorage(); // Save after removal
    });
  }

  // Clear form inputs
  form.reset();
});

// Reset button
resetButton.addEventListener('click', () => {
  list.innerHTML = '';
  form.reset();
  isEditing = false;
  editingItem = null;
  saveToLocalStorage(); // Save the cleared state
});

// Load from local storage on page load
loadFromLocalStorage();

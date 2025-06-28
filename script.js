// Pet state
let petState = {
  name: "",
  hunger: 100,
  lastFed: Date.now(),
  mood: "happy",
};

let hungerInterval;
let isLoaded = false;

// Pet images (local files)
const petImages = {
  happy: "./cat_happy.png",
  neutral: "./cat_neutral.png",
  cry: "./cat_cry.png",
  lowBattery: "./cat_low_battery.png",
};

// Play UI sound (local file)
function playUISound() {
  try {
    const audio = new Audio("./ui-pop-sound.mp3");
    audio.volume = 1;
    audio.play().catch((e) => console.log("Audio play prevented:", e));
  } catch (error) {
    console.log("Audio loading error:", error);
  }
}

// Calculate mood based on hunger
function calculateMood(hunger) {
  if (hunger >= 70) return "happy";
  if (hunger >= 30) return "neutral";
  return "sad";
}

// Get pet avatar based on mood
function getPetAvatar(mood, hunger) {
  if (mood === "happy") {
    return petImages.happy;
  } else if (mood === "neutral") {
    return petImages.neutral;
  } else if (mood === "sad") {
    if (hunger <= 10) {
      return petImages.cry;
    } else {
      return petImages.lowBattery;
    }
  }
  return petImages.happy;
}

// Get mood color
function getMoodColor(mood) {
  switch (mood) {
    case "happy":
      return "#D1F2EB";
    case "neutral":
      return "#e8d079";
    case "sad":
      return "#FFBCBC";
    default:
      return "#D1F2EB";
  }
}

// Get hunger bar color
function getHungerBarColor(hunger) {
  if (hunger >= 70) return "#D1F2EB";
  if (hunger >= 30) return "#e8d079";
  return "#FFBCBC";
}

// Save pet state to localStorage
function savePetState() {
  localStorage.setItem("virtualPet", JSON.stringify(petState));
}

// Load pet state from localStorage
function loadPetState() {
  const saved = localStorage.getItem("virtualPet");
  if (saved) {
    const savedState = JSON.parse(saved);
    const now = Date.now();
    const timePassed = now - savedState.lastFed;
    const hoursPassedDecimal = timePassed / (1000 * 60 * 60);

    const hungerDecrease = Math.floor(hoursPassedDecimal * 10);
    const newHunger = Math.max(0, savedState.hunger - hungerDecrease);
    const newMood = calculateMood(newHunger);

    petState = {
      ...savedState,
      hunger: newHunger,
      mood: newMood,
    };

    document.getElementById("nameInput").value = petState.name;
    savePetState();
  }
  isLoaded = true;
  updateDisplay();
}

// Update display
function updateDisplay() {
  const petTitle = document.getElementById("petTitle");
  const petAvatar = document.getElementById("petAvatar");
  const moodText = document.getElementById("moodText");
  const hungerText = document.getElementById("hungerText");
  const hungerFill = document.getElementById("hungerFill");
  const lastFedTime = document.getElementById("lastFedTime");

  petTitle.textContent = `🐾 ${petState.name || "Your Pet"}`;
  petAvatar.src = getPetAvatar(petState.mood, petState.hunger);
  petAvatar.alt = `${petState.name || "Your pet"} is feeling ${petState.mood}`;

  moodText.textContent = petState.mood;
  moodText.style.color = getMoodColor(petState.mood);

  hungerText.textContent = petState.hunger;
  hungerFill.style.width = `${petState.hunger}%`;
  hungerFill.style.backgroundColor = getHungerBarColor(petState.hunger);

  lastFedTime.textContent = new Date(petState.lastFed).toLocaleTimeString();
}

// Feed the pet
function feedPet() {
  playUISound();
  const now = Date.now();
  petState.hunger = 100;
  petState.lastFed = now;
  petState.mood = "happy";
  savePetState();
  updateDisplay();

  // Trigger bounce animation
  const avatar = document.getElementById("petAvatar");
  avatar.classList.add("bounce");
  setTimeout(() => avatar.classList.remove("bounce"), 1000);
}

// Update pet name
function updatePetName() {
  const nameInput = document.getElementById("nameInput");
  if (nameInput.value.trim()) {
    playUISound();
    petState.name = nameInput.value.trim();
    savePetState();
    updateDisplay();
    closeModal("settingsModal");
  }
}

// Decrease hunger over time
function startHungerTimer() {
  if (!isLoaded) return;

  hungerInterval = setInterval(() => {
    petState.hunger = Math.max(0, petState.hunger - 1);
    petState.mood = calculateMood(petState.hunger);
    savePetState();
    updateDisplay();
  }, 10000); // Decrease by 1 every 10 seconds
}

// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).classList.add("show");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("show");
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Load pet state
  loadPetState();
  startHungerTimer();

  // Feed button
  document.getElementById("feedBtn").addEventListener("click", feedPet);

  // Settings modal
  document.getElementById("settingsBtn").addEventListener("click", () => {
    playUISound();
    openModal("settingsModal");
  });
  document
    .getElementById("closeSettings")
    .addEventListener("click", () => closeModal("settingsModal"));
  document
    .getElementById("saveNameBtn")
    .addEventListener("click", updatePetName);
  document.getElementById("nameInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") updatePetName();
  });

  // Help modal
  document.getElementById("helpBtn").addEventListener("click", () => {
    playUISound();
    openModal("helpModal");
  });
  document
    .getElementById("closeHelp")
    .addEventListener("click", () => closeModal("helpModal"));

  // Close modals when clicking outside
  document.getElementById("settingsModal").addEventListener("click", (e) => {
    if (e.target.id === "settingsModal") closeModal("settingsModal");
  });
  document.getElementById("helpModal").addEventListener("click", (e) => {
    if (e.target.id === "helpModal") closeModal("helpModal");
  });
});

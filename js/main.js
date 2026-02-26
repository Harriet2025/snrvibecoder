// ================= IMAGE SLIDER =================
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

function showNextSlide() {
  if (totalSlides === 0) return;
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % totalSlides;
  slides[currentSlide].classList.add("active");
}

// Change slide every 5 seconds
if (totalSlides > 0) {
  setInterval(showNextSlide, 5000);
}
// ================= ADMISSION FORM =================
function validateAdmission() {
  const form = document.getElementById("admissionForm");
  if (form && form.dataset.submitting === "true") {
    return false;
  }

  let valid = true;

  const name = document.getElementById("fullname");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const gender = document.getElementById("gender");
  const program = document.getElementById("program");

  document.querySelectorAll(".error").forEach(e => e.innerText = "");

  if (name.value.trim() === "") {
    showError(name, "Full name required");
    valid = false;
  }

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!emailPattern.test(email.value)) {
    showError(email, "Invalid email format");
    valid = false;
  }

  const phonePattern = /^(0\d{9}|\+233\d{9})$/;
  if (!phonePattern.test(phone.value)) {
    showError(phone, "Invalid Ghana phone format");
    valid = false;
  }

  if (gender.value === "") {
    showError(gender, "Select gender");
    valid = false;
  }

  if (program.value === "") {
    showError(program, "Select program");
    valid = false;
  }

  if (!valid) return false;

  if (form) {
    form.dataset.submitting = "true";
  }

  saveApplicant();

  if (form) {
    setTimeout(() => {
      form.dataset.submitting = "false";
    }, 500);
  }

  return false;
}

function showError(input, message) {
  input.nextElementSibling.innerText = message;
}

function saveApplicant() {
  const fullname = document.getElementById("fullname");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const gender = document.getElementById("gender");
  const program = document.getElementById("program");

  const applicant = {
    name: fullname.value,
    email: email.value,
    phone: phone.value,
    gender: gender.value,
    program: program.value,
    wassce: document.getElementById("wassce").value
  };

  let applicants = JSON.parse(localStorage.getItem("applicants")) || [];
  applicants.push(applicant);
  localStorage.setItem("applicants", JSON.stringify(applicants));

  document.getElementById("successMsg").innerText =
    "Application saved successfully";

  document.getElementById("admissionForm").reset();
}

// ================= LOAD APPLICANTS =================
function loadApplicants() {
  let applicants = JSON.parse(localStorage.getItem("applicants")) || [];
  let table = document.getElementById("appTable");

  if (!table) return;

  table.innerHTML = "";

  applicants.forEach((app, i) => {
    table.innerHTML += `
      <tr>
        <td>${app.name}</td>
        <td>${app.email}</td>
        <td>${app.phone}</td>
        <td>${app.program}</td>
        <td><button onclick="deleteApplicant(${i})">Delete</button></td>
      </tr>
    `;
  });
}

function deleteApplicant(index) {
  let applicants = JSON.parse(localStorage.getItem("applicants")) || [];
  applicants.splice(index,1);
  localStorage.setItem("applicants", JSON.stringify(applicants));
  loadApplicants();
}

function clearAll() {
  localStorage.removeItem("applicants");
  loadApplicants();
}

// ================= NEWS FILTER =================
function filterNews() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;

  let category = categoryFilter.value;
  let cards = document.querySelectorAll(".news-card");

  cards.forEach(card => {
    if (category === "all" || card.dataset.category === category) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadApplicants();
});

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

  // Update stats
  updateStats(applicants);

  // Populate program filter dropdown
  populateProgramFilter(applicants);

  // Show/hide empty state
  const emptyState = document.getElementById("emptyState");
  if (applicants.length === 0) {
    if (emptyState) emptyState.classList.add("visible");
  } else {
    if (emptyState) emptyState.classList.remove("visible");
  }

  applicants.forEach((app, i) => {
    table.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${app.name}</td>
        <td>${app.email}</td>
        <td>${app.phone}</td>
        <td>${app.gender || '—'}</td>
        <td>${app.program}</td>
        <td><button class="btn-delete" onclick="deleteApplicant(${i})">Delete</button></td>
      </tr>
    `;
  });
}

// ================= STATS =================
function updateStats(applicants) {
  const totalEl = document.getElementById("totalCount");
  const maleEl = document.getElementById("maleCount");
  const femaleEl = document.getElementById("femaleCount");
  const programEl = document.getElementById("programCount");

  if (!totalEl) return;

  totalEl.textContent = applicants.length;

  const males = applicants.filter(a => a.gender && a.gender.toLowerCase() === "male").length;
  const females = applicants.filter(a => a.gender && a.gender.toLowerCase() === "female").length;
  const uniquePrograms = [...new Set(applicants.map(a => a.program))].length;

  maleEl.textContent = males;
  femaleEl.textContent = females;
  programEl.textContent = uniquePrograms;
}

// ================= PROGRAM FILTER DROPDOWN =================
function populateProgramFilter(applicants) {
  const filterEl = document.getElementById("programFilter");
  if (!filterEl) return;

  const programs = [...new Set(applicants.map(a => a.program))].sort();
  const currentVal = filterEl.value;

  filterEl.innerHTML = '<option value="all">All Programs</option>';
  programs.forEach(p => {
    filterEl.innerHTML += `<option value="${p}">${p}</option>`;
  });

  filterEl.value = currentVal || "all";
}

// ================= SEARCH & FILTER =================
function filterApplicants() {
  const searchVal = (document.getElementById("searchInput")?.value || "").toLowerCase();
  const programVal = document.getElementById("programFilter")?.value || "all";

  let applicants = JSON.parse(localStorage.getItem("applicants")) || [];
  let table = document.getElementById("appTable");
  if (!table) return;

  const filtered = applicants.filter((app, i) => {
    const matchSearch = !searchVal ||
      app.name.toLowerCase().includes(searchVal) ||
      app.email.toLowerCase().includes(searchVal) ||
      app.program.toLowerCase().includes(searchVal);
    const matchProgram = programVal === "all" || app.program === programVal;
    return matchSearch && matchProgram;
  });

  table.innerHTML = "";

  const emptyState = document.getElementById("emptyState");
  if (filtered.length === 0) {
    if (emptyState) emptyState.classList.add("visible");
  } else {
    if (emptyState) emptyState.classList.remove("visible");
  }

  filtered.forEach((app, i) => {
    // Find original index for delete
    const origIndex = applicants.indexOf(app);
    table.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${app.name}</td>
        <td>${app.email}</td>
        <td>${app.phone}</td>
        <td>${app.gender || '—'}</td>
        <td>${app.program}</td>
        <td><button class="btn-delete" onclick="deleteApplicant(${origIndex})">Delete</button></td>
      </tr>
    `;
  });
}

// ================= EXPORT CSV =================
function exportCSV() {
  let applicants = JSON.parse(localStorage.getItem("applicants")) || [];
  if (applicants.length === 0) {
    alert("No applicants to export.");
    return;
  }

  let csv = "No,Name,Email,Phone,Gender,Program\n";
  applicants.forEach((app, i) => {
    csv += `${i + 1},"${app.name}","${app.email}","${app.phone}","${app.gender || ''}","${app.program}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "atu_applicants.csv";
  link.click();
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

// News filter with button-style controls
function filterNews2(category, btn) {
  const items = document.querySelectorAll(".news-item");
  items.forEach(item => {
    if (category === "all" || item.dataset.category === category) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
  // Update active button
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  loadApplicants();
});

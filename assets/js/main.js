document.addEventListener("DOMContentLoaded", function () {
  /* =========================
     NAVBAR – SCROLL TO SECTION
  ========================== */
  const navbarEl = document.querySelector(".navbar");
  const navbarHeight = navbarEl ? navbarEl.offsetHeight : 0;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").slice(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();
        const offsetTop = targetElement.offsetTop - navbarHeight;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth"
        });
      }
    });
  });

  /* =========================
     NAVBAR – CLOSE MOBILE (BOOTSTRAP)
  ========================== */
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  if (navbarToggler && navbarCollapse) {
    document.querySelectorAll(".navbar-collapse .nav-link").forEach(link => {
      link.addEventListener("click", () => {
        if (navbarCollapse.classList.contains("show")) {
          navbarToggler.click(); // לסגור את התפריט
        }
      });
    });
  }

  /* =========================
     CUSTOM MOBILE MENU (menu-btn)
  ========================== */
  const menuBtn = document.querySelector(".menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");
  const closeBtn = document.querySelector(".close-btn");
  const mobileMenuClick = document.querySelector(".mobile-menu ul");

  if (menuBtn && mobileMenu && closeBtn && mobileMenuClick) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.style.display = "block";
      mobileMenu.style.animation = "showMenu 1s forwards";
    });

    closeBtn.addEventListener("click", () => {
      mobileMenu.style.animation = "hideMenu 1s forwards";
    });

    mobileMenuClick.addEventListener("click", () => {
      mobileMenu.style.animation = "hideMenu 1s forwards";
    });
  }

  /* =========================
     FORM – SEND TO APPS SCRIPT
  ========================== */
  const form = document.getElementById("form");
  const messageBox = document.getElementById("message");
  const submitBtn = document.getElementById("submit-button");

  // הכנס כאן את ה־URL הנכון של ה־Google Apps Script שלך
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwxKiMlRWWW1tUGK8YyqHRk96_Lyfi9u28C1PDlhcweh9lR6l00v2GNhU90UDw1rWjS/exec";

  if (form && messageBox && submitBtn) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // למנוע שליחה רגילה

      messageBox.textContent = "Submitting...";
      messageBox.style.display = "block";
      submitBtn.disabled = true;

      const formData = new FormData(form);
      const keyValuePairs = [];
      for (const pair of formData.entries()) {
        keyValuePairs.push(pair[0] + "=" + pair[1]);
      }
      const formDataString = keyValuePairs.join("&");

      fetch(SCRIPT_URL, {
        redirect: "follow",
        method: "POST",
        body: formDataString,
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Failed to submit the form.");
          }
          return response; // לא משתמשים ב-data בפועל, אז זה בסדר
        })
        .then(function () {
          // מעבר לדף תודה
          window.location.href = "/merci.html";
        })
        .catch(function (error) {
          console.error(error);
          messageBox.textContent =
            "An error occurred while submitting the form.";
          messageBox.style.display = "block";
          submitBtn.disabled = false;
        });
    });
  }

  /* =========================
     DATE – MIN = TODAY
  ========================== */
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // חודשים 0–11
    const dd = String(today.getDate()).padStart(2, "0");

    const minDate = `${yyyy}-${mm}-${dd}`;
    dateInput.setAttribute("min", minDate);
  }

  /* =========================
     NAVBAR – FIXED ON SCROLL
  ========================== */
  const body = document.querySelector("body");

  if (navbarEl && body) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        navbarEl.classList.add("fixed", "shrink");
        body.style.paddingTop = navbarEl.offsetHeight + "px"; // למנוע קפיצה של התוכן
      } else {
        navbarEl.classList.remove("fixed", "shrink");
        body.style.paddingTop = "0px";
      }
    });
  }

  /* =========================
     REVEAL ANIMATION
  ========================== */
  const reveals = document.querySelectorAll(".reveal");

  function handleReveal() {
    const triggerBottom = window.innerHeight * 0.85;

    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < triggerBottom) {
        el.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", handleReveal);
  handleReveal(); // פעם אחת בהתחלה
});

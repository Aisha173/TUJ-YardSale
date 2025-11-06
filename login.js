document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const pw = document.getElementById("tuj-password").value.trim();

  if (pw === "password") {
    window.location.href = "index.html";
  } else {
    document.getElementById("login-error").classList.remove("hidden");
  }
});

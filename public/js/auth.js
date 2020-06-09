async function onAuth(evt) {
  evt.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await axios.post("/auth", { username, password });

  if (!response.data.token) {
    alert(response.data.message);
  } else {
    localStorage.setItem("views-score-jwt", response.data.token);
    window.location = "/import";
  }
}

window.onload = () => {
  document.getElementById("formAuth").addEventListener("submit", onAuth);
};

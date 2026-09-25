// Playing around with the button
const button = document.getElementById("btn");

button.addEventListener("click", () => {
    window.location.href = "registration.html";
});

const backButton = document.getElementById("bck");

backButton.addEventListener("click", () => {
    window.history.back();
})


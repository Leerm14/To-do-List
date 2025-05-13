const input = document.getElementById("inputText");
const preview = document.getElementById("preview");

input.addEventListener("input", function () {
  preview.textContent = input.value;
});

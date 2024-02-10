const form = document.getElementById("form");
const submitButton = document.getElementById("submitButton");
const addFieldButton = document.getElementById("addFieldButton");
const initialInputDeleteButtons = document.getElementsByClassName(
  "initialInputDeleteButton"
);

const inputs = document.getElementsByClassName("input");

const sumP = document.getElementById("sum");
const avgP = document.getElementById("avg");
const minP = document.getElementById("min");
const maxP = document.getElementById("max");

handleSubmit = () => {
  const inputs = document.getElementsByClassName("input");

  const values = Array.from(inputs).map((i) => i.value);

  const sum = values.reduce((acc, curr) => acc + Number(curr), 0);
  sumP.innerHTML = `Suma: ${sum}`;
  avgP.innerHTML = `Średnia: ${sum / inputs.length}`;
  minP.innerHTML = `Min: ${Math.min(...values)}`;
  maxP.innerHTML = `Max: ${Math.max(...values)}`;
};

const handleAddField = () => {
  const wrapper = document.createElement("div");

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "delete";

  const input = document.createElement("input");
  input.type = "number";
  input.className = "input";
  input.onkeyup = handleSubmit;

  deleteButton.addEventListener("click", () => {
    if (input.value) {
      alert("Input nie jest pusty!");
      return;
    }
    wrapper.remove();
    handleSubmit();
  });

  wrapper.appendChild(input);
  wrapper.appendChild(deleteButton);
  form.appendChild(wrapper);
};

Array.from(inputs).forEach((input) => (input.onkeyup = handleSubmit));

form.addEventListener("submit", (e) => e.preventDefault());
submitButton.addEventListener("click", handleSubmit);
addFieldButton.addEventListener("click", handleAddField);

Array.from(initialInputDeleteButtons).forEach((button) =>
  button.addEventListener("click", () => {
    const input = button.previousElementSibling;
    if (input.value) {
      alert("Input nie jest pusty!");
      return;
    }

    button.parentElement.remove();
    handleSubmit();
  })
);

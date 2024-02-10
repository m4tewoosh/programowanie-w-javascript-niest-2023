const sampleNotes = [
  {
    title: "Meeting Notes",
    content: "Discuss project timelines and goals.",
    color: "blue",
    pin: false,
    creationDate: new Date("8.02.2024, 15:20:45"),
  },
  {
    title: "Grocery List",
    content: "Milk, Eggs, Bread, Apples.",
    color: "orange",
    pin: false,
    creationDate: new Date("8.02.2024, 18:45:33"),
  },
  {
    title: "Birthday Plans",
    content: "Prepare for Sarah's birthday party.",
    color: "red",
    pin: true,
    creationDate: new Date("8.02.2024, 12:59:28"),
  },
  {
    title: "Workout Routine",
    content: "Jogging in the morning, Weightlifting in the evening.",
    color: "green",
    pin: false,
    creationDate: new Date("8.02.2024, 21:05:17"),
  },
];

const form = document.getElementById("form");
const submitButton = document.getElementById("submitButton");
const notesElement = document.getElementById("notes");
const searchBar = document.getElementById("searchBar");

const titleInput = document.getElementById("titleInput");
const contentInput = document.getElementById("contentInput");
const colorInput = document.getElementById("colorInput");
const pinInput = document.getElementById("pinInput");

const displayNote = (note) => {
  const noteWrapper = document.createElement("div");
  noteWrapper.style.color = note.color;

  if (note.pin) {
    noteWrapper.style.border = "1px solid black";
  }

  const noteTitle = document.createElement("p");
  noteTitle.innerHTML = `Tytuł: ${note.title}`;
  noteWrapper.appendChild(noteTitle);

  const noteContent = document.createElement("p");
  noteContent.innerHTML = `Treść: ${note.content}`;
  noteWrapper.appendChild(noteContent);

  const creationDate = document.createElement("p");
  creationDate.innerHTML = `Data utworzenia: ${new Date(
    note.creationDate
  ).toLocaleString()}`;
  noteWrapper.appendChild(creationDate);

  notesElement.appendChild(noteWrapper);
};

handleSubmit = () => {
  const noteObject = {
    title: titleInput.value,
    content: contentInput.value,
    color: colorInput.value,
    pin: pinInput.checked,
    creationDate: Date.now(),
  };

  const firstNote = !localStorage.getItem("notes");

  if (firstNote) {
    const notes = [noteObject];
    localStorage.setItem("notes", JSON.stringify(notes));

    displayNotes(notes);
    return;
  }

  const notes = JSON.parse(localStorage.getItem("notes"));
  const newNotes = [...notes, noteObject];
  localStorage.setItem("notes", JSON.stringify(newNotes));

  displayNotes(newNotes);
};

const displayNotes = (notes) => {
  if (!notes) {
    return;
  }

  const sortedNotes = notes.sort(
    (a, b) => b.pin - a.pin || a.creationDate - b.creationDate
  );

  while (notesElement.firstChild) {
    notesElement.removeChild(notesElement.firstChild);
  }

  notesElement.innerHtml = "";

  sortedNotes.forEach((note) => {
    displayNote(note);
  });
};

displayNotes(JSON.parse(localStorage.getItem("notes")));
// displayNotes(sampleNotes);

submitButton.onclick = (event) => {
  event.preventDefault();
  handleSubmit();
};

const handleChangeSearchbar = (event) => {
  const searchedValue = event.target.value.toLowerCase();
  const notes = JSON.parse(localStorage.getItem("notes"));
  //   const notes = [...sampleNotes];

  const filteredNotes = [...notes].filter(
    (note) =>
      note.title.toLowerCase().includes(searchedValue) ||
      note.content.toLowerCase().includes(searchedValue) ||
      new Date(note.creationDate).toLocaleString().includes(searchedValue)
  );

  displayNotes(filteredNotes);
};

searchBar.onkeyup = handleChangeSearchbar;

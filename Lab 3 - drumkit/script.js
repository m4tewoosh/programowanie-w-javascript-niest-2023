const recordButtons = document.querySelectorAll(".recordButton");
const selectRecordingCheckboxes = document.querySelectorAll(
  ".selectRecordingCheckbox"
);
const playRecordButtons = document.querySelectorAll(".playRecordButton");
const playAllRecordsButton = document.getElementById("playAllRecordsButton");
const playSelectedRecordsButton = document.getElementById(
  "playSelectedRecordsButton"
);
const metronomeButton = document.getElementById("metronome");
const metronomeInput = document.getElementById("metronomeInput");

const playS1Checkbox = document.getElementById("play_s1");
const playS2Checkbox = document.getElementById("play_s2");
const playS3Checkbox = document.getElementById("play_s3");
const playS4Checkbox = document.getElementById("play_s4");

let metronomeInterval;

let currentDrum;

let isRecording = false;
const records = {
  s1: { isRecording: false },
  s2: { isRecording: false },
  s3: { isRecording: false },
  s4: { isRecording: false },
};

let record = [];

const KeyToSound = {
  a: document.querySelector('audio[id="s1"]'),
  s: document.querySelector('audio[id="s2"]'),
  d: document.querySelector('audio[id="s3"]'),
  f: document.querySelector('audio[id="s4"]'),
};

const onKeyDown = (event) => {
  const sound = KeyToSound[event.key];
  sound.parentElement.classList.add("drum_active");

  sound.volume = 0.2;
  playSound(sound);
};

const playSound = (sound) => {
  sound.currentTime = 0;
  sound.play();
};

const onKeyUp = (event) => {
  const sound = KeyToSound[event.key];
  sound.parentElement.classList.remove("drum_active");
};

const handleRecordButtonClick = (button) => {
  const soundId = button.parentElement.id.split("_")[0];

  if (records[soundId].isRecording) {
    document.dispatchEvent(
      new CustomEvent("stop_recording", {
        detail: soundId,
        xd: "xd",
      })
    );

    button.innerHTML = "Start recording";

    return;
  }

  if (isAnotherRecordInProgress(soundId)) {
    alert("another record in progress");
    return;
  }

  document.dispatchEvent(
    new CustomEvent("start_recording", { detail: soundId })
  );

  records[soundId].isRecording = true;
  button.innerHTML = "Stop recording";
};

const handleRegisterDrum = (event) => {
  const sound = KeyToSound[event.key];

  if (!sound) {
    return;
  }

  if (sound.id === currentDrum) {
    const drumObject = {
      timestamp: new Date().getTime(),
      key: event.key,
    };

    record.push(drumObject);
  }
};

const isAnotherRecordInProgress = (currentRecordId) => {
  const otherRecords = Object.entries(records).filter(
    (entry) => entry[0] !== currentRecordId
  );

  return otherRecords.some((record) => record[1].isRecording);
};

const onStartRecording = (event) => {
  console.log("onStartRecording");
  currentDrum = event.detail;

  record = [];

  const initialObject = {
    timestamp: new Date().getTime(),
  };
  record.push(initialObject);

  document.addEventListener("keypress", handleRegisterDrum);
};

const onStopRecording = (event) => {
  const soundId = event.detail;

  playRecordButtons.forEach((btn) => {
    if (btn.id === soundId) {
      btn.disabled = false;
    }
  });

  document.removeEventListener("keypress", handleRegisterDrum);
  records[soundId].isRecording = false;

  records[event.detail] = record;

  const isEmptyRecord = Object.values(records).find(
    (record) => !Array.isArray(record)
  );

  if (!isEmptyRecord) {
    playAllRecordsButton.disabled = false;
  }
};

const handlePlayRecord = (recordId) => {
  const record = records[recordId];

  if (!record.length) {
    alert("no record!");
    return;
  }

  const initialTimestamp = record[0].timestamp;

  for (let i = 1; i < record.length; i++) {
    const timestamp = record[i].timestamp;

    const diff = timestamp - initialTimestamp;
    const sound = KeyToSound[record[i].key];
    sound.volume = 0.2;

    setTimeout(() => {
      playSound(sound);
    }, diff);
  }
};

playSelectedRecordsButton.onclick = () => {
  selectRecordingCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      handlePlayRecord(checkbox.id);
    }
  });
};

recordButtons.forEach((button) => {
  button.onclick = () => handleRecordButtonClick(button);
});

playRecordButtons.forEach((button) => {
  button.onclick = () =>
    handlePlayRecord(button.parentElement.id.split("_")[0]);
});

playAllRecordsButton.onclick = () => {
  console.log("play all records");
  handlePlayRecord("s1");
  handlePlayRecord("s2");
  handlePlayRecord("s3");
  handlePlayRecord("s4");
};

metronomeButton.onclick = () => {
  if (metronomeInterval) {
    clearInterval(metronomeInterval);
    metronomeInterval = null;

    metronomeButton.innerHTML = "Start metronome";
    return;
  }

  metronomeButton.innerHTML = "Stop metronome";

  const sound = document.getElementById("s0");
  sound.volume = 0.2;

  let BPMValue = 60000 / metronomeInput.value;

  metronomeInterval = setInterval(() => {
    playSound(sound);
  }, BPMValue);
  playSound(sound);
};

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);
document.addEventListener("start_recording", onStartRecording);
document.addEventListener("stop_recording", onStopRecording);

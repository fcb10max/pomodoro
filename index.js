// constant variables
const timerTypes = Array.from(
  document.querySelectorAll(`input[name="timer_type"`)
);
const circle = document.getElementById("svg_circle");
const timeTextBlock = document.querySelector("h1.time");
const timerControlButton = document.querySelector("button.button_text");
const settingsIcon = document.querySelector("i.settings_icon > svg");
const settingsWrapper = document.querySelector(".settings_wrapper");
const settingsBlockCloser = document.querySelector(".settings_block-top > i");
// settings' elements
const pomodoroInput = document.getElementById("pomodoro_input");
const shortTimerInput = document.getElementById("short_timer_input");
const longTimerInput = document.getElementById("long_timer_input");
// settings time input arrow keys
const arrowUpKeysArr = Array.from(
  document.querySelectorAll(".time_input_block > span > i:first-child")
);
const arrowDownKeysArr = Array.from(
  document.querySelectorAll(".time_input_block > span > i:last-child")
);
//fonts radio buttons
const fontRadioButtons = Array.from(
  document.querySelectorAll(`input[name="fonts"]`)
);
//colors radio buttons
const colorsRadioButtons = Array.from(
  document.querySelectorAll(`input[name="colors"]`)
);
// settings "apply" button
const settingsApplyButton = document.querySelector(".settings_apply_button");

// dynamic variables
let isTimerActive = false;
let shortTimerMinutes = 5;
let longTimerMinutes = 10;
let pomodoroTimerMinutes = 20;
let currentSeconds = 0;
let currentMinutes = pomodoroTimerMinutes;
let currentMaxSeconds = currentMinutes * 60 + currentSeconds;
let overallSeconds = currentMinutes * 60 + currentSeconds;
let intervalID = "";
let currentFont = window.getComputedStyle(document.body).fontFamily;
let currentMainColor = window
  .getComputedStyle(document.documentElement)
  .getPropertyValue("--main-color");
let currentSecondaryColor = window
  .getComputedStyle(document.documentElement)
  .getPropertyValue("--secondary-color");

// enter stroke dasharray depending on circle length
const circleLength = circle.getTotalLength();
circle.style.strokeDasharray = Math.ceil(circleLength);

// pomodoro timer type click handler
const timerTypeClickHandler = (e) => {
  isTimerActive = false;
  clearInterval(intervalID);
  const timerType = e.currentTarget.value;
  resetTimer(timerType);
};

const resetTimer = (timerType) => {
  if (timerType === "pomodoro") {
    overallSeconds = pomodoroTimerMinutes * 60;
    currentMaxSeconds = pomodoroTimerMinutes * 60;
  }
  if (timerType === "short") {
    overallSeconds = shortTimerMinutes * 60;
    currentMaxSeconds = shortTimerMinutes * 60;
  }
  if (timerType === "long") {
    overallSeconds = longTimerMinutes * 60;
    currentMaxSeconds = longTimerMinutes * 60;
  }
  timerControlButton.textContent = "Start";
  updateTimer();
};

// start/pause/restart buttons click handler
const timerControlButtonClickHandler = (e) => {
  // if clicked restart, reset timer
  if (timerControlButton.textContent === "Restart") {
    currentMinutes = currentMaxSeconds / 60;
    currentSeconds = currentMaxSeconds % 60;
    overallSeconds = currentMaxSeconds;
    timerControlButton.textContent = "Start";
    updateTimer();
    return;
  }

  // timer launcher
  if (!isTimerActive) {
    isTimerActive = true;
    timerControlButton.textContent = "Pause";

    intervalID = setInterval(() => {
      // if timer is over, stop interval
      if (overallSeconds === 0) {
        isTimerActive = false;
        timeTextBlock.textContent = "00:00";
        timerControlButton.textContent = "Restart";
        clearInterval(intervalID);
        return;
      }
      // else continue counting
      overallSeconds -= 1;
      updateTimer();
      let remainedTimePercent = Number(
        overallSeconds / currentMaxSeconds
      ).toFixed(4);
      circle.style.strokeDashoffset =
        circle.style.strokeDasharray * (1 - remainedTimePercent);
    }, 1000);
  } else if (isTimerActive) {
    // pauses timer when clicked "pause" button
    isTimerActive = false;
    timerControlButton.textContent = "Start";
    clearInterval(intervalID);
  }
};

// updates text and time of timer in sceen
const updateTimer = () => {
  currentMinutes = Math.floor(overallSeconds / 60);
  currentSeconds = Math.floor(overallSeconds % 60);
  timeTextBlock.textContent = `${
    currentMinutes > 9 ? currentMinutes : `0${currentMinutes}`
  }:${currentSeconds > 9 ? currentSeconds : `0${currentSeconds}`}`;
  if (!isTimerActive && timerControlButton.textContent !== "Start")
    timerControlButton.textContent = "Start";
  circle.style.strokeDashoffset = 0;
};

// opens settings window
const settingsClickHandler = (e) => {
  if (!settingsWrapper.classList.contains("active"))
    settingsWrapper.classList.add("active");
};

// closes settings window
const settingsBlockCloserClickHandler = (e) => {
  if (settingsWrapper.classList.contains("active"))
    settingsWrapper.classList.remove("active");
  settingsWrapper.style.fontFamily = currentFont;
  fontRadioButtons.forEach((el) =>
    el.value === currentFont ? (el.checked = true) : (el.checked = false)
  );
  document.documentElement.style.cssText = `--main-color: ${currentMainColor}; --secondary-color: ${currentSecondaryColor}`;
  colorsRadioButtons.forEach((el) =>
    el.value.startsWith(currentMainColor) ? (el.checked = true) : (el.checked = false)
  );
};

// settings > time(minutes) > input change handler
const timerSettingInputChangeHandler = (e) => {
  if (e.target.value < 0) return (e.target.value = 0);
  if (e.target.value > 60) return (e.target.value = 60);
  if (!/[0-9]+/.test(e.target.value)) e.target.value = 1;
};

// settings > time(minutes) > input arrow down keys click handler
const inputArrowDownClickHandler = (e) => {
  const ancestor = e.currentTarget.closest(".time_input_block");
  const input = Array.from(ancestor.children).find(
    (child) => child.tagName === "INPUT" && child.type === "number"
  );
  if (Number(input.value) > 0) input.value = Number(input.value) - 1;
};
// settings > time(minutes) > input arrow up keys click handler
const inputArrowUpClickHandler = (e) => {
  const ancestor = e.currentTarget.closest(".time_input_block");
  const input = Array.from(ancestor.children).find(
    (child) => child.tagName === "INPUT" && child.type === "number"
  );
  if (Number(input.value) < 60) input.value = Number(input.value) + 1;
};

const fontButtonHandler = (e) => {
  const fontName = e.target.value;
  settingsWrapper.style.fontFamily = fontName;
  return;
};

const colorButtonHandler = (e) => {
  const currentMainColorLocal = e.target.value.split("/")[0];
  const currentSecondaryColorLocal = e.target.value.split("/")[1];
  document.documentElement.style.cssText = `--main-color: ${currentMainColorLocal}; --secondary-color: ${currentSecondaryColorLocal}`;
};

// settings' apply button click event handler
const applyButtonClickHandler = (e) => {
  const values = getSettingsEnteredValues();
  currentFont = values.fontName;
  currentMainColor = values.mainColor;
  currentSecondaryColor = values.secondaryColor;
  document.body.style.fontFamily = values.fontName;
  pomodoroTimerMinutes = values.timers.pomodoro;
  shortTimerMinutes = values.timers.short;
  longTimerMinutes = values.timers.long;
  settingsWrapper.classList.remove("active");
  document.documentElement.style.cssText = `--main-color: ${values.mainColor}; --secondary-color: ${values.secondaryColor}`;
  const currentTimerType = timerTypes.find((el) => el.checked).value;
  resetTimer(currentTimerType);
  clearInterval(intervalID);
};

// function to get settings' entered values
const getSettingsEnteredValues = () => {
  const values = {
    timers: {
      pomodoro: pomodoroInput.value,
      short: shortTimerInput.value,
      long: longTimerInput.value,
    },
    fontName: document.querySelector('input[name="fonts"]:checked').value,
    mainColor: String(
      document.querySelector('input[name="colors"]:checked').value
    ).split("/")[0],
    secondaryColor: String(
      document.querySelector('input[name="colors"]:checked').value
    ).split("/")[1],
  };
  return values;
};

// timer type buttons "click" event listener
timerTypes.forEach((el) => el.addEventListener("click", timerTypeClickHandler));
timerControlButton.addEventListener("click", timerControlButtonClickHandler);
settingsIcon.addEventListener("click", settingsClickHandler);
settingsBlockCloser.addEventListener("click", settingsBlockCloserClickHandler);
// settings > time(minutes) > input "change" event listeners
pomodoroInput.addEventListener("change", timerSettingInputChangeHandler);
shortTimerInput.addEventListener("change", timerSettingInputChangeHandler);
longTimerInput.addEventListener("change", timerSettingInputChangeHandler);
// add "click" event listeners for settings > time(minutes) > input arrow keys
arrowDownKeysArr.forEach((el) =>
  el.addEventListener("click", inputArrowDownClickHandler)
);
arrowUpKeysArr.forEach((el) =>
  el.addEventListener("click", inputArrowUpClickHandler)
);
// font radio click handler
fontRadioButtons.forEach((el) =>
  el.addEventListener("click", fontButtonHandler)
);
// color radio click handler
colorsRadioButtons.forEach((el) =>
  el.addEventListener("click", colorButtonHandler)
);
// add "click" event listener for settings' apply button
settingsApplyButton.addEventListener("click", applyButtonClickHandler);

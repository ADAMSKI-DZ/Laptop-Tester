const updateStage = document.querySelectorAll(".update-stage");
const downloadUpdateBtn = document.querySelector(".download-update");
const downloadSpeedMeter = document.querySelector(".download-speed span");
const downloadPercentText = document.querySelector(".download-percent");
const downloadProgressCircle = document.querySelector(".download-progress");
const updateSizeText = document.querySelector(".update-size");
const updateReleaseDate = document.querySelector(".update-release-date");
const restartBtn = document.querySelector(".restart");
const UpdateBackBtn = document.querySelector(".back-btn");

const appVersionText = document.querySelectorAll(".app-version span");

ipc.on("app_version", (event, data) => {
  appVersionText.forEach((appVer) => {
    appVer.innerText = `V${data.appVersion}`;
  });
});

const checkForUpdateBtn = document.querySelector(".check-for-update");

checkForUpdateBtn.addEventListener("click", () => {
  ipc.send("check_for_update");

  updateStage.forEach((stage) => {
    stage.classList.remove("active");
  });
  updateStage[1].classList.add("active");
});

const updateVersionText = document.querySelector(".update-version span");

ipc.on("update_available", (event, data) => {
  updateStage.forEach((stage) => {
    stage.classList.remove("active");
  });
  updateStage[3].classList.add("active");

  updateVersionText.innerText = `V${data.updateVersion}`;
});

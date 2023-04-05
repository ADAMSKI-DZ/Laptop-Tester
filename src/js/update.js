const updateStage = document.querySelectorAll(".update-stage");

/* update system */

const bytesToSize = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) {
    return "n/a";
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) {
    return `${bytes} ${sizes[i]}`;
  }
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

const appVersionText = document.querySelectorAll(".app-version span");

ipc.on("app_version", (event, data) => {
  appVersionText.forEach((appVer) => {
    appVer.innerText = `V${data.appVersion}`;
  });
});

const UpdateBackBtn = document.querySelector(".back-btn");

UpdateBackBtn.addEventListener("click", () => {
  updateStage.forEach((stage) => {
    stage.classList.remove("active");
  });
  updateStage[0].classList.add("active");
});

const checkForUpdateBtn = document.querySelector(".check-for-update");

checkForUpdateBtn.addEventListener("click", () => {
  console.log("checking for an update");

  ipc.send("check_for_update");

  updateStage.forEach((stage) => {
    stage.classList.remove("active");
  });
  updateStage[1].classList.add("active");
});

ipc.on("no_update_available", () => {
  console.log("you are updated");

  updateStage.forEach((stage) => {
    stage.classList.remove("active");
  });
  updateStage[2].classList.add("active");
});

const updateVersionText = document.querySelector(".update-version span");
const updateReleaseDate = document.querySelector(".update-release-date span");

ipc.on("update_available", (event, data) => {
  console.log("there is available update");

  const updateAvailableNoti = new Notification("🔥 New update is here 🔥", {
    body: `Version ${data.updateVersion} is here click to download it 👉`,
    icon: "../asset/photos/icon.ico",
  });
  updateAvailableNoti.onclick = () => {
    ipc.send("download_update");
  };

  updateStage.forEach((stage) => {
    stage.classList.remove("active");
  });
  updateStage[3].classList.add("active");

  updateVersionText.innerText = `V${data.updateVersion}`;
  updateReleaseDate.innerText = `${data.releaseDate}`;
});

const updateSizeText = document.querySelector(".update-size span");
const downloadProgressCircle = document.querySelector(".download-progress");
const downloadPercentText = document.querySelector(".download-percent");
const downloadUpdateBtn = document.querySelector(".download-update");
const downloadSpeedMeter = document.querySelector(".download-speed span");

downloadUpdateBtn.addEventListener("click", () => {
  console.log("downloading update");
  ipc.send("download_update");
});

ipc.on("download_progress", (event, data) => {
  updateStage.forEach((stage) => {
    stage.classList.remove("active");
  });
  updateStage[4].classList.add("active");

  updateSizeText.innerText = bytesToSize(data.size);
  downloadProgressCircle.style.strokeDashoffset = `${
    440 - (375 * Math.floor(data.percent)) / 100
  }`;
  downloadPercentText.innerText = `${Math.floor(data.percent)}%`;
  downloadSpeedMeter.innerText = `${bytesToSize(data.speed)}/S`;
  console.log(
    Math.floor(data.percent),
    bytesToSize(data.size),
    bytesToSize(data.speed)
  );
});

ipc.on("update_downloaded", () => {
  console.log("update downloaded");

  const updateDownloadedNoti = new Notification(
    "✅ The updated has been downloaded ✅",
    {
      body: "Click to install the update and restart the app 👉",
      icon: "../asset/photos/icon.ico",
    }
  );
  updateDownloadedNoti.onclick = () => {
    ipc.send("restart_the_app");
  };

  updateStage.forEach((stage) => {
    stage.classList.remove("active");
  });
  updateStage[5].classList.add("active");
});

const restartBtn = document.querySelector(".restart");

restartBtn.addEventListener("click", () => {
  ipc.send("restart_the_app");
});

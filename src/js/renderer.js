/*------ Importing ipc ------*/
const { ipcRenderer } = require("electron");
const ipc = ipcRenderer;

/*------ Adding close / minimize / maximize functions ------*/
const closeBtn = document.querySelector(".close-btn");
const minimizeBtn = document.querySelector(".minimize-btn");
const maximizeBtn = document.querySelector(".maximize-btn");

closeBtn.addEventListener("click", () => {
  ipc.send("close_the_app");
});
minimizeBtn.addEventListener("click", () => {
  ipc.send("minimize_the_app");
});
maximizeBtn.addEventListener("click", () => {
  ipc.send("maximize_the_app");
});

/*------ Importing app name from main process ------*/
const documentTitle = document.querySelector(".document-title");
const navTitle = document.querySelector(".logo h1");
ipc.on("app_name", (event, data) => {
  documentTitle.innerText = data.title;
  navTitle.innerText = data.title;
  console.log(data.title);
});

/*------ Stoping app scaling in ------*/
window.onkeydown = function (evt) {
  // disable zooming
  if (
    (evt.code == "Minus" || evt.code == "Equal") &&
    (evt.ctrlKey || evt.metaKey)
  ) {
    evt.preventDefault();
  }
};

/*------ Tabs and buttons navigation ------*/
const links = document.querySelectorAll(".link");
const tabs = document.querySelectorAll(".tab");
const homeTab = document.querySelector(".home");

const pages = [
  "System information",
  "Keyboard test",
  "Display test",
  "Battery test",
  "About",
];
const titleIndicator = document.querySelector(".title-indicator h1");

links.forEach((link, index) => {
  link.addEventListener("click", () => {
    homeTab.classList.remove("active");
    titleIndicator.innerText = pages[index];
    links.forEach((link) => {
      link.classList.remove("active");
    });
    tabs.forEach((tab) => {
      tab.classList.remove("active");
    });
    links[index].classList.add("active");
    tabs[index].classList.add("active");
  });
});

const logo = document.querySelector(".logo");

logo.addEventListener("click", () => {
  homeTab.classList.add("active");
  links.forEach((link) => {
    link.classList.remove("active");
  });
  tabs.forEach((tab) => {
    tab.classList.remove("active");
  });
  titleIndicator.innerText = "Home";
});

/*------ Getting user name from main process ------*/
const userNameHome = document.querySelector(".user-name");
ipc.on("user_name", (event, data) => {
  userNameHome.innerText = data.userName;
  console.log(data.userName);
});

/*------ Starting test on click / sending to main process ------*/
const video1 = document.querySelector(".video-1");
const video2 = document.querySelector(".video-2");

video1.addEventListener("click", () => {
  ipc.send("start_video1");
});
video2.addEventListener("click", () => {
  ipc.send("start_video2");
});

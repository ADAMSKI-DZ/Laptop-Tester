/*------ Getting battery info for checking i other PCs ------*/
si.battery()
  .then((data) => {
    console.log(`---------- battery data ----------`);
    console.table(data);
    console.log(
      "--------------------------------------------------------------------"
    );
  })
  .catch((err) => {
    console.log(err);
  });
/*------ Importing battery npm package ------*/
const battery = require("battery");

/*------ Getting battery info ------*/
const batInfoData = document.querySelectorAll(".bat-info-data span");
const batCol1 = document.querySelector(".bat-info-container .col-1");
const batCol2 = document.querySelector(".bat-info-container .col-2");

const batChargeStat = document.querySelectorAll(".bat-charge-stat span");

/*------ function to change true to 'YES' / false to 'NO' ------*/
const isCharging = (answer) => {
  if (answer === true) {
    return "Yes";
  } else if (answer === false) {
    return "No";
  } else {
    return "We can't determine";
  }
};

/*------ Showing battery infos ------*/
const checkBatteryInfo = () => {
  si.battery()
    .then((data) => {
      if (data.currentCapacity === 0 && data.maxCapacity === 0) {
        console.log("pc not supported");

        batCol2.classList.add("show");
        batCol1.classList.add("hide");

        setInterval(() => {
          (async () => {
            const { level, charging } = await battery();
            batChargeStat[0].innerText = isCharging(charging);
            batChargeStat[1].innerText = `${level * 100}%`;
          })();
        }, 1000);
      } else {
        console.log("you pc is supported ");
        batCol1.classList.add("show");

        let health = `${(data.currentCapacity / data.maxCapacity) * 100}%`;

        batInfoData[0].innerText = isCharging(data.isCharging);

        batInfoData[1].innerText = `${data.percent}%`;

        batInfoData[2].innerText = `${Math.floor(health)}%`;

        batInfoData[3].innerText = `${data.currentCapacity} ${data.capacityUnit}`;

        batInfoData[4].innerText = `${data.maxCapacity} ${data.capacityUnit}`;
      }
    })
    .catch((err) => {
      batInfoData[0].innerText = err;
    });
};

/*------ Waiting click on battery tab then getting battery info // for performance ------*/
links[3].addEventListener(
  "click",
  () => {
    checkBatteryInfo();
  },
  { once: true }
);

/*------ Generating windows 10 battery-report.html ------*/
const generateBtn = document.querySelector(".generate-btn");

generateBtn.addEventListener("click", () => {
  ipc.send("generate_battery_info");
});

/*------ Calculating battery health ------*/
const designCapacityInput = document.querySelector(".design-capacity");
const fullChargeCapacityInput = document.querySelector(".full-charge-capacity");
const calculateBtn = document.querySelector(".calculate-btn");
const resultHealth = document.querySelector(".result-health span");

const calculateBatteryHealth = () => {
  let health =
    (fullChargeCapacityInput.value / designCapacityInput.value) * 100;
  resultHealth.innerText = `${Math.floor(health)}%`;
  console.log(health);
};

calculateBtn.addEventListener("click", () => {
  calculateBatteryHealth();
});
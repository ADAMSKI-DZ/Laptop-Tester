/*------ Importing system information package ------*/
const si = require("systeminformation");

/*------ Getting system infos / adding loading animation ------*/
const specs = document.querySelectorAll(".spec");
const sysContainer = document.querySelector(".system-container");
const sysInfoLoading = document.querySelector(".sys-info-loading");

/*------ Sizes converter ------*/
function convertToGB(bytesValue) {
  let gbValue = Math.floor(bytesValue / 1000 ** 3);
  return gbValue;
}

/*------ When link pressed get system info / ? for quick startup ------*/
const checkPcInfo = () => {
  si.osInfo()
    .then((data) => {
      console.log(`---------- OS data ----------`);

      specs[0].innerText = `${data.distro} ${data.arch} Build ${data.build}`;

      console.log("All data");
      console.table(data);
      console.log(
        "--------------------------------------------------------------------"
      );
    })
    .catch((err) => {
      specs[0].innerText = err;
      console.log(err);
    });

  si.cpu()
    .then((data) => {
      console.log(`---------- CPU data ----------`);

      specs[1].innerText = `${data.manufacturer} ${data.brand} ${data.speed}GHZ ${data.physicalCores} Cores`;

      console.log("All data");
      console.table(data);
      console.log(
        "--------------------------------------------------------------------"
      );
    })
    .catch((err) => {
      specs[1].innerText = err;
      console.log(err);
    });

  si.memLayout()
    .then((data) => {
      console.log(`---------- RAM data ----------`);

      if (data.length === 1) {
        specs[2].innerText = `Slot 1 : ${convertToGB(data[0].size)}GB ${
          data[0].type
        } ${data[0].clockSpeed}MHZ ${data[0].manufacturer}`;

        console.log(`Found one :`);
        console.table(data[0]);
      } else {
        specs[2].innerText = `Slot 1 : ${convertToGB(data[0].size)}GB ${
          data[0].type
        } ${data[0].clockSpeed}MHZ ${
          data[0].manufacturer
        } | Slot 2 : ${convertToGB(data[1].size)}GB ${data[1].type} ${
          data[1].clockSpeed
        }MHZ ${data[1].manufacturer}`;

        console.log(`Found two :`);
        console.log("One =>");
        console.table(data[1]);

        console.log("two =>");
        console.table(data[2]);
      }

      console.log("All data");
      console.table(data);
      console.log(
        "--------------------------------------------------------------------"
      );
    })
    .catch((err) => {
      specs[2].innerText = err;
      console.log(err);
    });

  si.graphics()
    .then((data) => {
      console.log(`---------- GPU data ----------`);

      if (data.controllers.length === 1) {
        specs[3].innerText = `GPU 1 :${
          data.controllers[0].model
        } Vram ${convertToGB(data.controllers[0].vram * 1000000)}GB ${
          data.controllers[0].bus
        }`;

        console.log(`Found one :`);
        console.table(data.controllers[0]);
      }
      if (data.controllers.length === 2) {
        specs[3].innerText = `GPU 1 : ${
          data.controllers[0].model
        } Vram ${convertToGB(data.controllers[0].vram * 1000000)}GB ${
          data.controllers[0].bus
        } | GPU 2 : ${data.controllers[1].model} Vram ${convertToGB(
          data.controllers[1].vram * 1000000
        )}GB ${data.controllers[1].bus}`;
        console.log("Found two :");
        console.log("One =>");
        console.table(data.controllers[0]);

        console.log("two =>");
        console.table(data.controllers[1]);
      }
      console.log("All data");
      console.table(data.controllers);
      console.log(
        "--------------------------------------------------------------------"
      );
    })
    .catch((err) => {
      specs[3].innerText = err;
      console.log(err);
    });

  si.diskLayout()
    .then((data) => {
      console.log(`---------- disk data ----------`);

      if (data.length === 1) {
        specs[4].innerText = `Disk 1 : ${convertToGB(data[0].size)}GB ${
          data[0].type
        } ${data[0].vendor} ${data[0].interfaceType}`;

        console.log(`Found one :`);
        console.table(data[0]);
      }
      if (data.length === 2) {
        specs[4].innerText = `Disk 1 : ${convertToGB(data[0].size)}GB ${
          data[0].type
        } ${data[0].vendor} ${data[0].interfaceType} | Disk 2 : ${convertToGB(
          data[1].size
        )}GB ${data[1].type} ${data[1].vendor} ${data[1].interfaceType}`;

        console.log(`Found two :`);
        console.log("One =>");
        console.table(data[1]);

        console.log("two =>");
        console.table(data[2]);
      }
      console.log("All data");
      console.table(data);
      console.log(
        "--------------------------------------------------------------------"
      );
      sysContainer.classList.add("show");
      sysInfoLoading.classList.remove("show");
    })
    .catch((err) => {
      specs[4].innerText = err;
      console.log(err);
    });
};

links[0].addEventListener(
  "click",
  () => {
    checkPcInfo();
    sysInfoLoading.classList.add("show");
  },
  { once: true }
);
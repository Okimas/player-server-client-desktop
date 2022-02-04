const { parentPort, isMainThread, workerData } = require("worker_threads");
const constants = require("./constants");
const { dynamicRequire } = require("./utils");
let axios;
let status;
const TOTAL = 10;

const someBlockingJob = (category) => {
  return new Promise(async (resolve, reject) => {
    try {
      let counter = 0;
      for (let i = 0; i < TOTAL; i++) {
        status[category].scanning = "URL: " + (i + 1);
        const url = "https://picsum.photos/300?" + new Date().getTime();
        await axios.get(url);
        status[category].numbers[0]++;
        parentPort.postMessage({ status });
        counter++;
        if (counter === TOTAL) {
          resolve(true);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

if (!isMainThread) {
  parentPort.on("message", ({ url, delay }) => {
    console.log("worker params", url, delay);
    axios = dynamicRequire("axios", workerData.isDev);

    /**
     * THIS IS ONLY A MEDIA SCANNER SIMULATION.
     * THE COMPLETE SOFTWARE WILL SOON BE AVAILABLE AS WINDOWS INSTALLER.
     */
    /**
     * IMPORTANT:
     * AS WORKER THREAD IT WON'T BLOCK THEM MAIN THREAD OR USER INTERFACE.
     * ONLY "AXIOS" WAS IMPORTED HERE AND IT NEEDS A DYNAMIC REQUIRE. YOU CAN SEE IN "build.asarUnpack" UNDER PACKEGE.JSON WHAT YOU NEED TO DO.
     */
    const categories = ["music", "series", "movies", "books", "courses"];
    let counter = 0;
    status = JSON.parse(JSON.stringify(constants.scanner));
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      status[category].numbers = [0, 0, TOTAL];
      parentPort.postMessage({ status });
      someBlockingJob(category)
        .then((result) => {
          // category DONE
        })
        .catch((error) => {
          parentPort.postMessage({ error });
        })
        .finally(() => {
          counter++;
          if (counter === 5) {
            parentPort.postMessage({ lists: constants.listsEmpty });
          }
        });
    }
  });
}

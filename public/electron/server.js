const fs = require("fs");
const path = require("path");
const logger = require("./logger");
const constants = require("./constants");

const SERVER = {
  protocol: "http",
  ip: "0.0.0.0",
  port: 7777,
  url: "",
  enabled: false,
};

const getProfile = (id) => {
  return new Promise((resolve, reject) => {
    const filepath = id + ".json";
    fs.readFile(filepath, { encoding: "utf8" }, (error, data) => {
      resolve(error ? null : JSON.parse(data));
    });
  });
};

const getProfileMedias = (id) => {
  return new Promise(async (resolve, reject) => {
    const profileData = await getProfile(id);
    if (profileData && "medias" in profileData) {
      resolve(profileData.medias);
    } else resolve(null);
  });
};

const getLists = () => {
  return new Promise((resolve, reject) => {
    const filepath = "lists.json";
    fs.readFile(filepath, { encoding: "utf8" }, (error, data) => {
      resolve(error ? null : JSON.parse(data));
    });
    resolve(null);
  });
};

const stream = (req, res) => {
  const fullpath = req.params.path;
  fs.stat(fullpath, (err, stats) => {
    if (err) return res.status(404).end();

    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Length": stats.size,
    });
    const stream = fs.createReadStream(fullpath);
    if (stream) {
      stream.on("open", () => stream.pipe(res));
      stream.on("error", (streamErr) => res.status(404).end());
    } else res.status(404).end();
  });
};

const streamMedia = (req, res) => {
  const fullpath = req.params.path;
  fs.stat(fullpath, (err, stats) => {
    if (err) return res.status(404).end();

    const { size } = stats;
    const { range } = req.headers;
    const start = Number((range || "").replace(/bytes=/, "").split("-")[0]);
    const end = size - 1;
    const chunkSize = end - start + 1;

    res.set({
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": req.params.mime.replace("-", "/"),
    });

    res.status(206);

    const stream = fs.createReadStream(fullpath, { start, end });
    stream.on("open", () => stream.pipe(res));
    stream.on("error", (streamErr) => res.end(streamErr));
  });
};

const getLocalIP = () => {
  const networkInterfaces = require("os").networkInterfaces();
  for (const key of Object.keys(networkInterfaces)) {
    const arr = networkInterfaces[key];
    for (const item of arr) {
      if (
        "family" in item &&
        item.family === "IPv4" &&
        !item.address.startsWith("127")
      ) {
        return item.address;
      }
    }
  }
  return null;
};

module.exports = {
  start: (options) => {
    return new Promise((resolve, reject) => {
      const IP = getLocalIP();
      if (IP) {
        const express = require("express");
        const app = express();

        app.use(express.json());
        app.get("/test", (req, res) => {
          res.status(200).send("OK");
        });
        app.get("/", (req, res) => {
          if (!SERVER.enabled) return res.status(404).send();
          res.status(200).send("<h1>Media Learnimg Center Server</h1>");
        });
        app.get("/api/image/:path", (req, res) => {
          if (!SERVER.enabled && req.ip.replace("::ffff:", "") !== SERVER.ip)
            return res.status(404).send();
          stream(req, res);
        });
        app.get("/api/profile/:id", (req, res) => {
          if (!SERVER.enabled && req.ip.replace("::ffff:", "") !== SERVER.ip)
            return res.status(404).send();
          getProfile(req.params.id)
            .then((profile) => {
              res.status(200).send(profile);
            })
            .catch((error) => {
              res.status(404).send({ error });
            });
        });
        app.get("/api/profile/:id/medias", (req, res) => {
          if (!SERVER.enabled && req.ip.replace("::ffff:", "") !== SERVER.ip)
            return res.status(404).send();
          getProfileMedias(req.params.id)
            .then((medias) => {
              res.status(200).send(medias);
            })
            .catch((error) => {
              res.status(404).send({ error });
            });
        });
        app.get("/api/file/:path", (req, res) => {
          if (!SERVER.enabled && req.ip.replace("::ffff:", "") !== SERVER.ip)
            return res.status(404).send();
          stream(req, res);
        });
        app.get("/api/lists", (req, res) => {
          if (!SERVER.enabled && req.ip.replace("::ffff:", "") !== SERVER.ip)
            return res.status(404).send();
          getLists()
            .then((lists) => {
              res
                .status(200)
                .send(lists ? lists : { code: -1, message: "file error" });
            })
            .catch((error) => {
              res.status(404).send({ error });
            });
        });
        app.get("/api/media/:path/:mime", (req, res) => {
          if (!SERVER.enabled && req.ip.replace("::ffff:", "") !== SERVER.ip)
            return res.status(404).send();
          streamMedia(req, res);
        });

        const server = require(options.protocol).createServer(
          options.protocol === "https"
            ? {
                key: fs.readFileSync(options.https.certificateKey),
                cert: fs.readFileSync(options.https.certificateFile),
              }
            : {},
          app
        );
        server.listen(options.port, () => {
          SERVER.protocol = options.protocol;
          SERVER.ip = IP;
          SERVER.port = options.port;
          SERVER.url = options.protocol + "://" + IP + ":" + options.port;
          resolve(SERVER);
        });
        server.on("error", (error) => {
          logger.log("server start(1)", error);
          resolve(null);
        });
      } else {
        logger.log("server start", { message: "no IP" });
        resolve(null);
      }
    });
  },
  setEnable: (enabled) => {
    SERVER.enabled = enabled;
    return SERVER;
  },
};

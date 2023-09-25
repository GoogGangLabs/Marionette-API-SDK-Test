const { MarionetteClient } = require("./lib/index");

const video = document.getElementById("video");
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const loadStream = document.getElementById("loadStream");
const connect = document.getElementById("connect");
const publish = document.getElementById("publish");

const client = new MarionetteClient({
  token: "Input your access token",
  roomId: "hihi",
});

client.on("ERROR", (data) => console.log(data));

start.disabled = false;

window.onbeforeunload = async (_) => {
  await client.release();
};

start.addEventListener("click", async () => {
  await client.init();

  stop.disabled = false;
  loadStream.disabled = false;
});

stop.addEventListener("click", async () => {
  await client.release();

  stop.disabled = true;
  loadStream.disabled = true;
  connect.disabled = true;
  publish.disabled = true;
});

loadStream.addEventListener("click", async () => {
  const stream = await client.loadStream();
  video.srcObject = stream;
  video.play();

  stream.getTracks().forEach((track) => (track.enabled = true));

  connect.disabled = false;
});

connect.addEventListener("click", async () => {
  await client.connect();

  publish.disabled = false;
});

publish.addEventListener("click", async () => {
  await client.publish();
});

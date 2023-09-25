const { MarionetteClient } = require("./lib/index");

const video = document.getElementById("video");
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const loadStream = document.getElementById("loadStream");
const connect = document.getElementById("connect");
const publish = document.getElementById("publish");

let flag = false;
let startTime;
let count = 0;

const client = new MarionetteClient({
  token:
    "eyJzZXNzaW9uSWQiOiJmMmI3ZDEwMzk1ZGQ0MWYyYmU1ZmJlNzhlMTRkZjFmMSIsInVpZCI6ImY5YzBiYjE3MjQ1NjRhZjE5NjQ0NjBjNDE5NGU2ZDdmIiwiaWF0IjoxNjk1NTcwNjQwLCJleHAiOjE3MDI3NzA2NDB9.7CFPdoJs67ogPHCHNZzzZ3ALrd7dlQg9lfaCZp8uGgo",
  roomId: "hihi",
});

client.on("ERROR", (data) => console.log(data));
client.on("BLENDSHAPE_RESULT", (data) => {
  if (!flag) {
    flag = true;
    startTime = Date.now();
  }
  count++;
});

start.disabled = false;

window.onbeforeunload = async (_) => {
  await client.release();
};

start.addEventListener("click", async () => {
  await client.init();

  document.getElementById("roomId").innerText = client.getRoomId();
  document.getElementById("nickname").innerText = client.getNickname();

  stop.disabled = false;
  loadStream.disabled = false;
});

stop.addEventListener("click", async () => {
  flag = false;
  const endTime = Date.now();

  console.log(endTime - startTime, count);

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

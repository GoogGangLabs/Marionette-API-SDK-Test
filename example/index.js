const { MarionetteClient, Enum } = require('./lib/index');

const video = document.getElementById('video');
const input = document.getElementById('input');
const code = document.getElementById('code');
const roomId = document.getElementById('roomId');
const nickname = document.getElementById('nickname');
const start = document.getElementById('start');
const stop = document.getElementById('stop');
const loadStream = document.getElementById('loadStream');
const connect = document.getElementById('connect');
const publish = document.getElementById('publish');

let token = '';
let flag = false;
let startTime;
let count = 0;

let client = new MarionetteClient({ token: '' });

input.addEventListener('input', (event) => {
  token = event.target.value;
});

code.addEventListener('click', async () => {
  if (!token.length) {
    alert('Invalid input');
  }

  if (await checkToken(token)) {
    localStorage.setItem('token', token);
    init(token);
    input.value = '';
  }
});

start.addEventListener('click', async () => {
  client.setRoomId(roomId.value);
  client.setNickname(nickname.value);

  await client.init();

  document.getElementById('label-roomId').innerText = client.getRoomId();
  document.getElementById('label-sessionId').innerText = client.getSessionId();
  document.getElementById('label-nickname').innerText = client.getNickname();

  roomId.disabled = true;
  nickname.disabled = true;
  start.disabled = true;
  stop.disabled = false;
  loadStream.disabled = false;
});

stop.addEventListener('click', async () => {
  flag = false;
  const endTime = Date.now();

  console.log(endTime - startTime, count);

  await client.release();

  roomId.disabled = false;
  nickname.disabled = false;
  start.disabled = false;
  stop.disabled = true;
  loadStream.disabled = true;
  connect.disabled = true;
  publish.disabled = true;
});

loadStream.addEventListener('click', async () => {
  const stream = await client.loadStream();
  video.srcObject = stream;
  video.play();

  stream.getTracks().forEach((track) => (track.enabled = true));

  connect.disabled = false;
});

connect.addEventListener('click', async () => {
  await client.connect();

  publish.disabled = false;
});

publish.addEventListener('click', async () => {
  await client.publish();
});

const checkToken = async (accessToken) => {
  const response = await fetch(`https://api.goodganglabs.xyz/auth/token`, {
    method: 'GET',
    cache: 'no-cache',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.ok) {
    input.placeholder = 'Token checking successfully';
    input.disabled = true;
    code.disabled = true;
  }
  return response.ok;
};

const init = (validToken) => {
  console.log(validToken);
  client = new MarionetteClient({
    token: validToken,
    roomId: 'hihi',
  });

  client.on(Enum.EventState.ERROR, (data) => console.log(data));
  client.on(Enum.EventState.BLENDSHAPE_EVENT, (data) => {
    if (!flag) {
      flag = true;
      startTime = Date.now();
    }
    count++;
    data.forEach((session) => console.log(session));
  });
  client.on(Enum.EventState.METADATA_EVENT, (data) => {
    console.log(data);
  });

  start.disabled = false;
};

window.onload = async () => {
  const localToken = localStorage.getItem('token');

  if (localToken && localToken.length && (await checkToken(localToken))) {
    init(localToken);
  }
};

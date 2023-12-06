const { MarionetteClient, Enum } = require('./lib/index');

const video = document.getElementById('video');
const input = document.getElementById('input');
const code = document.getElementById('code');
const roomname = document.getElementById('roomname');
const nickname = document.getElementById('nickname');
const roomId = document.getElementById('roomId');
const start = document.getElementById('start');
const stop = document.getElementById('stop');
const createRoom = document.getElementById('create');
const deleteRoom = document.getElementById('delete');
const debug = document.getElementById('debug');
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
  client.setRoomName(roomname.value);
  client.setNickname(nickname.value);

  await client.init();

  document.getElementById('label-sessionId').innerText = client.getSessionId();
  document.getElementById('label-nickname').innerText = client.getNickname();
  document.getElementById('label-roomname').innerText = client.getRoomName();

  roomname.disabled = true;
  nickname.disabled = true;
  start.disabled = true;
  createRoom.disabled = false;
  stop.disabled = false;
  debug.disabled = false;
  loadStream.disabled = false;
});

stop.addEventListener('click', async () => {
  flag = false;
  const endTime = Date.now();

  console.log(endTime - startTime, count);

  await client.release();

  roomId.value = '';

  roomname.disabled = false;
  nickname.disabled = false;
  roomId.disabled = false;
  start.disabled = false;
  createRoom.disabled = true;
  deleteRoom.disabled = true;
  stop.disabled = true;
  loadStream.disabled = true;
  connect.disabled = true;
  publish.disabled = true;
});

createRoom.addEventListener('click', async () => {
  await client.createRoom(document.getElementById('label-roomname').innerText);
  document.getElementById('label-own-roomId').innerText = client.getOwnRoomId();

  createRoom.disabled = true;
  deleteRoom.disabled = false;
});

deleteRoom.addEventListener('click', async () => {
  await client.deleteRoom();
  document.getElementById('label-own-roomId').innerText = '';

  createRoom.disabled = false;
  deleteRoom.disabled = true;
});

debug.addEventListener('click', async () => {
  await client.debug();
  debug.disabled = true;
});

loadStream.addEventListener('click', async () => {
  const stream = await client.loadStream();
  video.srcObject = stream;
  video.play();

  stream.getTracks().forEach((track) => (track.enabled = true));

  connect.disabled = false;
});

connect.addEventListener('click', async () => {
  let joinRoomId = roomId.value || client.getOwnRoomId();
  console.log(joinRoomId);
  if (!joinRoomId || !joinRoomId.length) return;

  await client.connect(joinRoomId);

  publish.disabled = false;
  roomId.disabled = true;

  document.getElementById('label-joined-roomId').innerText = client.getJoinedRoomId();
  document.getElementById('label-roomname').innerText = client.getRoomName();
});

publish.addEventListener('click', async () => {
  await client.publish();
});

const checkToken = async (accessToken) => {
  console.log(accessToken);
  const response = await fetch(`http://localhost:3000/auth/token`, {
    // const response = await fetch(`https://api.goodganglabs.xyz/auth/token`, {
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
  });

  client.on(Enum.EventState.ERROR, (data) => console.log(data));
  client.on('BLENDSHAPE_EVENT', (data) => {
    if (!flag) {
      flag = true;
      startTime = Date.now();
    }
    count++;
    data.forEach((session) => {
      const weightedTime =
        session.elapsedTimes.reduce((a, b) => a + b, 0) + session.proceededTimes.reduce((a, b) => a + b, 0);
      console.log(
        `Sequence: ${session.sequence}, FPS: ${session.fps}, Weighted time: ${weightedTime}ms, Elapsed time: [${session.elapsedTimes}], Proceeded time: [${session.proceededTimes}]`,
      );
    });
  });
  client.on('SESSION_EVENT', (data) => {
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

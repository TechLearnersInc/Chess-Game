'use strict';

// Variables
const csrfToken = document.getElementById('CsrfParam').value;
const joinGamePlayAs = document.getElementById('joinGamePlayAs');
const btnJoinGame = document.getElementById('btnJoinGame');
const btnNewGame = document.getElementById('btnNewGame');
const joinGamePinCode = document.getElementById('joinGamePinCode');
const joinGamePinCodeRow = document.getElementById('joinGamePinCodeRow');
const btnGameCodeSubmit = document.getElementById('btnGameCodeSubmit');
const joinGameCodeInput = document.getElementById('joinGameCodeInput');
const notificationToastID = document.getElementById('notificationToast');
const notificationToastTitle = document.getElementById('notificationToastTitle');
const notificationToastText = document.getElementById('notificationToastText');
const modalJoinGameID = document.getElementById('modalJoinGame');
const modalJoinGameTitle = document.getElementById('modalJoinGameTitle');
const modalJoinGame = new bootstrap.Modal(modalJoinGameID, {
  keyboard: false,
});
const notificationToast = new bootstrap.Toast(notificationToastID, {
  animation: true,
  autohide: true,
  delay: 5000,
});

// Endpoints
const newGamecodeEndpoint = '/newcode';
const verifyGamecodeEndpoint = '/verify-gamecode';
const gameplayRoute = '/gameplay';

notificationToastID.addEventListener('show.bs.toast', () => {
  notificationToastID.classList.add('animate__animated');
  notificationToastID.classList.add('animate__fadeInDown');
});

notificationToastID.addEventListener('hide.bs.toast', () => {
  notificationToastID.classList.remove('animate__fadeInDown');
  notificationToastID.classList.add('animate__fadeOutUp');
});

notificationToastID.addEventListener('hidden.bs.toast', () => {
  notificationToastID.classList.remove('animate__animated');
  notificationToastID.classList.remove('animate__fadeInDown');
  notificationToastID.classList.remove('animate__fadeOutUp');
});

// Initial gamecode clear
setTimeout(() => {
  localStorage.clear();
  sessionStorage.clear();
}, 1000 /* 1 Second */);

btnNewGame.addEventListener('click', async event => {
  event.preventDefault();

  if (localStorage.getItem('gamecode') === null) {
    const data = await newGamecodeRequest();
    localStorage.setItem('gamecode', data.gamecode);
  }

  modalJoinGameTitle.innerText = 'Share gamecode to invite';
  joinGameCodeInput.value = localStorage.getItem('gamecode');
  joinGameCodeInput.readOnly = true;

  joinGamePinCode.value = '';
  joinGamePinCodeRow.style.display = 'none';

  setTimeout(() => {
    localStorage.removeItem('gamecode');
  }, 15 * 1000 /* 15 Second */);

  modalJoinGame.show();
});

btnJoinGame.addEventListener('click', event => {
  event.preventDefault();

  joinGamePinCodeRow.style.display = 'block';
  modalJoinGameTitle.innerText = 'Enter your gamecode';
  joinGameCodeInput.value = '';
  joinGameCodeInput.readOnly = false;

  modalJoinGame.show();
});

btnGameCodeSubmit.addEventListener('click', async event => {
  event.preventDefault();

  const gamecode = joinGameCodeInput.value;
  const joinAs = joinGamePlayAs.options[joinGamePlayAs.selectedIndex].text.toLowerCase();

  // Checking informations given or not
  {
    const hasGamecode = gamecode === '';
    const hasJoinAs = joinAs === 'join as';
    const hasError = {
      title: 'Error!',
      message: undefined,
    };

    if (hasGamecode) hasError.message = 'Please provide gamecode.';
    else if (hasJoinAs) hasError.message = 'Please select from Join as.';

    if (hasError.message !== undefined) {
      modalJoinGame.hide();
      notification({
        title: hasError.title,
        text: hasError.message,
        action: 'show',
      });
      return;
    }
  }

  // Validating information from server
  {
    const data = await verifyAndGetTokenRequest({
      gamecode: gamecode,
      player: joinAs,
      playerPin: joinGamePinCode.value == '' ? 'false' : joinGamePinCode.value,
    });

    if (!data.gamecodeValid) {
      modalJoinGame.hide();
      notification({
        title: 'Error!',
        text: 'Invalid gamecode or pin.',
        action: 'show',
      });
      return;
    } else if (!data.playerPinValid) {
      modalJoinGame.hide();
      notification({
        title: 'Error!',
        text: 'Wrong pin code.',
        action: 'show',
      });
      return;
    }
  }

  modalJoinGame.hide();

  notification({
    title: 'All good!',
    text: 'Redirecting to the chess board',
    action: 'show',
  });

  setTimeout(() => {
    location.href = gameplayRoute;
  }, 2000 /* 1 Second */);
});

/**
 * Functions
 */
async function newGamecodeRequest() {
  return fetch(newGamecodeEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'csrf-token': csrfToken,
    },
  })
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      notification({
        title: 'Bad news!',
        text: 'An error occured on getting the new gamecode.',
        action: 'show',
      });
      return undefined;
    });
}

async function verifyAndGetTokenRequest(body) {
  return fetch(verifyGamecodeEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'csrf-token': csrfToken,
    },
    body: JSON.stringify({
      gamecode: body.gamecode,
      player: body.player,
      playerPin: body.playerPin,
    }),
  })
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      notification({
        title: 'Bad news!',
        text: 'An error occured on getting the new gamecode.',
        action: 'show',
      });
      return undefined;
    });
}

// Notification Toast Show
function notification(args = {}) {
  if (args.action == 'show') {
    const title = args.title || 'Title';
    const text = args.text || 'Body Text';
    notificationToastTitle.innerText = title;
    notificationToastText.innerText = text;
    notificationToast.show();
  } else if (args.action == 'hide') notificationToast.hide();
  else console.error(new Error('Invalid arguement'));
}

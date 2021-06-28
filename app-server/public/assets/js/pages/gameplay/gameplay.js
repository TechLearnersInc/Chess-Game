"use strict";

const modalConfirmID = document.getElementById("modalConfirm");
const modalConfirmNoID = document.getElementById("modalConfirmNo");
const modalConfirmYesID = document.getElementById("modalConfirmYes");
const notificationToastID = document.getElementById("notificationToast");
const notificationToastTitle = document.getElementById("notificationToastTitle");
const notificationToastText = document.getElementById("notificationToastText");
const notificationToast = new bootstrap.Toast(notificationToastID, {
  animation: true,
  autohide: true,
  delay: 5000,
});

const board = Chessboard("chess-board", board_config);

$(window).resize(board.resize);

notificationToastID.addEventListener("show.bs.toast", () => {
  notificationToastID.classList.add("animate__animated");
  notificationToastID.classList.add("animate__fadeInDown");
});

notificationToastID.addEventListener("hide.bs.toast", () => {
  notificationToastID.classList.remove("animate__fadeInDown");
  notificationToastID.classList.add("animate__fadeOutUp");
});

notificationToastID.addEventListener("hidden.bs.toast", () => {
  notificationToastID.classList.remove("animate__animated");
  notificationToastID.classList.remove("animate__fadeInDown");
  notificationToastID.classList.remove("animate__fadeOutUp");
});

// notificationToast.show();

/**
 * Functions
 */

// Notification Toast Show
function notification(args = {}) {
  if (args.action == "show") {
    const title = args.title || "Title";
    const text = args.text || "Body Text";
    notificationToastTitle.innerText = title;
    notificationToastText.innerText = text;
    notificationToast.show();
  } else if (args.action == "hide") notificationToast.hide();
  else console.error(new Error("Invalid arguement"));
}

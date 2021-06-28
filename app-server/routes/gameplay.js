/* Variables */
const express = require("express");
const router = express.Router();

/* Gameplay */
router.get("/", async (req, res) => {
  if (req.cookies.token === undefined) {
    res.redirect(302, "/");
  } else {
    res.render("gameplay", {
      title: "Chess Game",
      CsrfParam: req.csrfToken(),
    });
  }
});

module.exports = router;

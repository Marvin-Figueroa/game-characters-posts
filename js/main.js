"use strict";

// import HttpClient from "./httpClient.js";
import checkInputs from "./formInputsValidation.js";

const form = document.getElementById("form-create");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const author = document.getElementById("author");
const creationDate = document.getElementById("creationDate");
const imageUrl = document.getElementById("imageUrl");
const postBody = document.getElementById("body");
const tags = document.getElementById("tags");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  checkInputs([
    title,
    subtitle,
    author,
    creationDate,
    imageUrl,
    postBody,
    tags,
  ]);
});

document.addEventListener("DOMContentLoaded", (e) => {
  displayNews();
});

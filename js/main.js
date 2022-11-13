"use strict";

import HttpClient from "./httpClient.js";

const form = document.getElementById("form-create");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const author = document.getElementById("author");
const creationDate = document.getElementById("creationDate");
const imageUrl = document.getElementById("imageUrl");
const postBody = document.getElementById("body");
const tags = document.getElementById("tags");
const submitPost = document.getElementById("submitPost");

const urlRegEx =
  /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#&//=]*)$/i;

const nameRegEx = /^\b([A-Za-zÀ-ÿ][-,a-z. ']+[ ]*)+$/;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  checkInputs();
});

function checkInputs() {
  const titleVal = title.value.trim();
  const subtitleVal = subtitle.value.trim();
  const authorVal = author.value.trim();
  const creationDateVal = creationDate.value;
  const imageUrlVal = imageUrl.value.trim();
  const postBodyVal = postBody.value.trim();
  const tagsVal = tags.value.trim();

  if (titleVal === "") {
    setInputError(title, "Title cannot be empty");
  } else {
    setInputSuccess(title);
  }

  if (subtitleVal === "") {
    setInputError(subtitle, "Subtitle cannot be empty");
  } else {
    setInputSuccess(subtitle);
  }

  if (authorVal === "") {
    setInputError(author, "Author cannot be empty");
  } else if (!nameRegEx.test(authorVal)) {
    setInputError(author, "This field only accepts letters");
  } else {
    setInputSuccess(author);
  }

  if (creationDateVal === "") {
    setInputError(creationDate, "The date is required");
  } else {
    setInputSuccess(creationDate);
  }

  if (imageUrlVal === "") {
    setInputError(imageUrl, "Image URL cannot be empty");
  } else if (!urlRegEx.test(imageUrlVal)) {
    setInputError(imageUrl, "Enter a valid image URL");
  } else {
    setInputSuccess(imageUrl);
  }

  if (postBodyVal === "") {
    setInputError(postBody, "Post's body cannot be empty");
  } else {
    setInputSuccess(postBody);
  }

  if (tagsVal === "") {
    setInputError(tags, "Enter at least 1 tag");
  } else if (!validateTags(tagsVal)) {
    setInputError(tags, "Tags must be comma separated alfanumeric values");
  } else {
    setInputSuccess(tags);
  }
}

function setInputError(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector(".form-create__validation-feedback");
  formControl.className = "form-control error";
  small.textContent = message;
}

function setInputSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

function validateTags(tags) {
  return (
    tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => /^[a-z0-9]+$/i.test(tag.trim())).length > 0
  );
}

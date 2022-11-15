"use strict";

import HttpClient from "./httpClient.js";
import { areValidInputs, areValidTags } from "./formInputsValidation.js";

const currentPostId = new URLSearchParams(window.location.search).get("id");

const form = document.getElementById("form-create");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const author = document.getElementById("author");
const creationDate = document.getElementById("creationDate");
const imageUrl = document.getElementById("imageUrl");
const postBody = document.getElementById("body");
const tags = document.getElementById("tags");

let initialPostValues;

const httpClient = new HttpClient(
  "https://delightful-likeable-principle.glitch.me"
);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (
    areValidInputs([
      title,
      subtitle,
      author,
      creationDate,
      imageUrl,
      postBody,
      tags,
    ])
  ) {
    // make patch request to modify the post
    const currentPostValues = {
      title: title.value,
      subTitle: subtitle.value,
      author: author.value,
      createDate: creationDate.value,
      image: imageUrl.value,
      body: postBody.value,
      tags: tags.value,
    };

    if (
      JSON.stringify(initialPostValues) !== JSON.stringify(currentPostValues)
    ) {
      const modifiedObject = {
        title:
          initialPostValues.title !== currentPostValues.title
            ? currentPostValues.title
            : null,
        subTitle:
          initialPostValues.subTitle !== currentPostValues.subTitle
            ? currentPostValues.subTitle
            : null,
        author:
          initialPostValues.author !== currentPostValues.author
            ? currentPostValues.author
            : null,
        createDate:
          initialPostValues.createDate !== currentPostValues.createDate
            ? currentPostValues.createDate
            : null,
        image:
          initialPostValues.image !== currentPostValues.image
            ? currentPostValues.image
            : null,
        body:
          initialPostValues.body !== currentPostValues.body
            ? currentPostValues.body
            : null,
        tags:
          initialPostValues.tags !== currentPostValues.tags
            ? currentPostValues.tags
            : null,
      };

      console.log("prev author: ", initialPostValues.author);
      console.log("curr author: ", currentPostValues.author);

      // delete null properties from object
      Object.keys(modifiedObject).forEach((key) => {
        if (modifiedObject[key] === null) {
          delete modifiedObject[key];
        }
      });

      // If I modified the tags field value in the form, I register new tags found if any and then change the slugs values for their corresponding ids
      if (modifiedObject.tags) {
        const newTags = getformattedTagsFromValue(modifiedObject.tags);
        await submitTags(newTags);

        const allTags = await httpClient.get("/tags");

        const tagsIds = await getTagsIdsFromSlugs(modifiedObject.tags);

        modifiedObject.tags = tagsIds;
      }

      await httpClient.patch(`/posts/${currentPostId}`, modifiedObject);

      alert("Changes were saved!!!");
    }
  }
});

window.addEventListener("DOMContentLoaded", async (e) => {
  const currentPost = await httpClient.get(`/posts/${currentPostId}`);
  populateForm(currentPost);
});

async function populateForm(post) {
  renderAuthorNames(author, post.author);
  title.value = post.title;
  subtitle.value = post.subTitle;
  creationDate.value = new Date(post.createDate).toLocaleDateString("en-CA");
  imageUrl.value = post.image;
  postBody.value = post.body;
  tags.value = await getTagsFromPost(post);

  initialPostValues = {
    title: title.value,
    subTitle: subtitle.value,
    author: author.value,
    createDate: creationDate.value,
    image: imageUrl.value,
    body: postBody.value,
    tags: tags.value,
  };
}

async function getTagsFromPost(post) {
  const allTags = await httpClient.get("/tags");
  const tagsSlugs = allTags
    .filter((tag) => post.tags.includes(tag.id))
    .map((tag) => tag.slug);

  return tagsSlugs.join(",");
}

async function renderAuthorNames(parentElement, currentAuthorId) {
  const authors = await httpClient.get(`/authors`);

  const authorsMarkup = authors
    .map((author) => {
      return `<option value="${author.id}" ${
        +author.id === +currentAuthorId ? "selected" : ""
      }>${author.name} ${author.lastName}</option>`;
    })
    .join("");

  parentElement.insertAdjacentHTML("afterbegin", authorsMarkup);
}

function getformattedTagsFromValue(tagsValue) {
  let formattedTagName;
  let formattedTags;
  if (areValidTags(tagsValue)) {
    formattedTags = tagsValue.split(",").map((tag) => {
      // change 'hello-world' for 'hello world'
      formattedTagName = tag.trim().split("-").join(" ");
      // next I change {name: 'hello world'} to {name: 'Hello world'}
      return {
        name:
          formattedTagName.charAt(0).toUpperCase() + formattedTagName.slice(1),
        slug: tag.trim(),
      };
    });
  }

  const uniqueFormattedTags = [...new Set(formattedTags)];

  return uniqueFormattedTags;
}

async function submitTags(tagsObjectsList) {
  const allTags = await httpClient.get("/tags");
  const allTagsSlugs = allTags.map((tag) => tag.slug);

  const newTags = tagsObjectsList.filter(
    (tag) => !allTagsSlugs.includes(tag.slug)
  );

  newTags.forEach(async (tag) => {
    await httpClient.post("/tags", tag);
  });
}

async function getTagsIdsFromSlugs(slugsListValue) {
  const allTags = await httpClient.get("/tags");
  const slugsList = slugsListValue.split(",").map((slug) => slug.trim());

  const tagsIds = allTags
    .filter((tag) => slugsList.includes(tag.slug))
    .map((tag) => tag.id);

  return tagsIds;
}

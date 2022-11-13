import HttpClient from "./httpClient.js";

const tagsContainer = document.getElementById("posts-tags");
const httpClient = new HttpClient(
  "https://delightful-likeable-principle.glitch.me"
);

window.addEventListener("DOMContentLoaded", (e) => {
  renderTags();
});

async function renderTags() {
  const tags = await httpClient.get("/tags");

  const tagsMarkup = tags.map((tag) => {
    const { slug } = tag;

    return `<div class="tag">
    <input class="tag__input" type="radio" name="tag" id="${slug}" />
    <label class="tag__label" for="${slug}">${slug}</label>
  </div>`;
  });

  tagsMarkup.forEach((tag) => {
    tagsContainer.insertAdjacentHTML("afterbegin", tag);
  });
}

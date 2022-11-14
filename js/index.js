import HttpClient from "./httpClient.js";

const tagsContainer = document.getElementById("posts-tags");
const featuredPostsContainer = document.querySelector(".posts-featured");
const postsContainer = document.querySelector(".posts");

const httpClient = new HttpClient(
  "https://delightful-likeable-principle.glitch.me"
);

window.addEventListener("DOMContentLoaded", (e) => {
  renderTags();
  displayPosts();
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

async function renderPosts(postsList, featured) {
  const authors = await httpClient.get("/authors");
  const tagsList = await httpClient.get("/tags");

  const postsMarkup = postsList.map((post) => {
    const { title, createDate, likes, author, tags } = post;
    const { name, lastName } = authors.filter(
      (auth) => +auth.id === +author
    )[0];

    const tagsSlugs = tagsList
      .filter((tag) => tags.includes(tag.id))
      .map((tag) => `<span class="post__tag">#${tag.slug}</span>`);

    return `<article class="post ${featured ? "post--featured" : ""}">
    <div class="post__info">
      <p class="post__author">${name + " " + lastName}</p>
      <small class="post__date">${createDate}</small>
    </div>
    <h2 class="post__title">
      <a class="post__title-link" href="#">${title}</a>
    </h2>
    <div class="post__tags">
    ${tagsSlugs.join("")}
    </div>
    <span class="post__likes"
      ><i class="fa-regular fa-heart"></i> ${likes}</span
    >
  </article>`;
  });

  const postsContainerTarget = featured
    ? featuredPostsContainer
    : postsContainer;

  postsMarkup.forEach((post) => {
    postsContainerTarget.insertAdjacentHTML("beforeend", post);
  });
}

function getLatestPosts(postsList, from = 0, limit) {
  const posts = postsList;

  const sortedPosts = posts.sort(
    (a, b) => new Date(b.createDate) - new Date(a.createDate)
  );

  console.log("sorted", sortedPosts);

  return limit ? sortedPosts.slice(from, limit) : sortedPosts.slice(from);
}

async function displayPosts() {
  const posts = await httpClient.get("/posts");
  // I get the 'featured posts' - the 3 more recent ones
  const featuredPosts = getLatestPosts(posts, 0, 3);
  // I get the rest of the posts - all which are not the 3 most recent ones
  const nonFeaturedPosts = getLatestPosts(posts, 3);
  await renderPosts(featuredPosts, true);
  await renderPosts(nonFeaturedPosts, false);
}

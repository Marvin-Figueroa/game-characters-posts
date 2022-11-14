import HttpClient from "./httpClient.js";

const formSearch = document.getElementById("form-search");
const searchInput = document.getElementById("search-posts");
const tagsContainer = document.getElementById("posts-tags");
const featuredPostsContainer = document.querySelector(".posts-featured");
const postsContainer = document.querySelector(".posts");
let posts;
let tags;
let authors;

const httpClient = new HttpClient(
  "https://delightful-likeable-principle.glitch.me"
);

window.addEventListener("DOMContentLoaded", async (e) => {
  tags = await httpClient.get("/tags");
  posts = await httpClient.get("/posts");
  authors = await httpClient.get("/authors");

  renderTags(tags);
  displayPosts(posts);
});

formSearch.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchInput.value.trim().length > 0) {
    tagsContainer.innerHTML = "";
    postsContainer.innerHTML = "";
    featuredPostsContainer.innerHTML = "";
    displayFilteredPostsBySearch(posts, searchInput.value);
  }
});

tagsContainer.addEventListener("change", (e) => {
  postsContainer.innerHTML = "";
  featuredPostsContainer.innerHTML = "";
  displayFilteredPostsByTag(posts, e.target.id);
});

// Debounde/Throttle this
searchInput.addEventListener("input", (e) => {
  if (e.target.value.trim().length === 0) {
    renderTags(tags);
    displayPosts(posts);
  }
});

async function renderTags(tags) {
  const tagsMarkup = tags.map((tag) => {
    const { slug } = tag;

    return `<div class="tag">
    <input class="tag__input" type="radio" name="tag" id="${slug}" />
    <label class="tag__label" for="${slug}">${slug}</label>
  </div>`;
  });

  tagsMarkup.push(`<div class="tag">
  <input class="tag__input" type="radio" name="tag" id="all" checked />
  <label class="tag__label" for="all">all</label>
</div>`);

  tagsMarkup.forEach((tag) => {
    tagsContainer.insertAdjacentHTML("afterbegin", tag);
  });
}

function renderPosts(postsList, featured) {
  const postsMarkup = postsList.map((post) => {
    const { id, title, createDate, likes, author, tags: currTags } = post;
    const { name, lastName } = authors.filter(
      (auth) => +auth.id === +author
    )[0];

    const tagsSlugs = tags
      .filter((tag) => currTags.includes(tag.id))
      .map((tag) => `<span class="post__tag">#${tag.slug}</span>`);

    return `<article class="post ${featured ? "post--featured" : ""}">
    <div class="post__info">
      <p class="post__author">${name + " " + lastName}</p>
      <small class="post__date">${createDate}</small>
    </div>
    <h2 class="post__title">
      <a class="post__title-link" href="details.html?id=${id}">${title}</a>
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

  return limit ? sortedPosts.slice(from, limit) : sortedPosts.slice(from);
}

function displayPosts(posts) {
  // I get the 'featured posts' - the 3 more recent ones
  const featuredPosts = getLatestPosts(posts, 0, 3);
  // I get the rest of the posts - all which are not the 3 most recent ones
  const nonFeaturedPosts = getLatestPosts(posts, 3);
  renderPosts(featuredPosts, true);
  renderPosts(nonFeaturedPosts, false);
}

function displayFilteredPostsBySearch(posts, search) {
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );
  displayPosts(filteredPosts);
}

function displayFilteredPostsByTag(posts, tagSlug) {
  if (tagSlug === "all") {
    displayPosts(posts);
  } else {
    const targetTag = tags.filter((tag) => tag.slug === tagSlug)[0];

    const filteredPosts = posts.filter((post) =>
      post.tags.includes(targetTag.id)
    );

    displayPosts(filteredPosts);
  }
}

import HttpClient from "./httpClient.js";
const currentPostId = new URLSearchParams(window.location.search).get("id");
const detailsContainer = document.querySelector(".post-details-container");
let comments;
let users;
let tags;
let currentPost;
let likePost = false;

const httpClient = new HttpClient(
  "https://delightful-likeable-principle.glitch.me"
);

window.addEventListener("DOMContentLoaded", async (e) => {
  users = await httpClient.get("/users");
  tags = await httpClient.get("/tags");
  comments = await httpClient.get("/comments");
  currentPost = await httpClient.get(`/posts/${currentPostId}`);
  renderDetails();
});

document.body.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = e.target.user.value;
  const commentText = e.target.comment.value.trim();
  const commentsContainer = document.querySelector(
    ".post-details__comments-list"
  );
  const commentsContainerLabel = document.querySelector(".post-details__label");

  const comment = {
    comment: commentText,
    postId: +currentPostId,
    user: +user,
  };

  e.target.reset();
  e.target.newCommentSubmit.setAttribute("disabled", true);

  const newComment = await httpClient.post("/comments/", comment);
  const updatedComments = await httpClient.get("/comments");
  comments = updatedComments;

  appendComment(newComment, commentsContainer);
  const commentsByPost = comments.filter(
    (comment) => +comment.postId === +currentPostId
  );
  commentsContainerLabel.textContent = `All comments (${commentsByPost.length})`;
});

document.body.addEventListener("input", (e) => {
  const submitCommentBtn = document.querySelector(".new-comment__submit");
  if (e.target.id === "comment") {
    if (e.target.value.trim() !== "") {
      submitCommentBtn.removeAttribute("disabled");
    } else {
      submitCommentBtn.setAttribute("disabled", true);
    }
  }
});

document.body.addEventListener(
  "click",
  throttle(async (e) => {
    if (e.target.id === "post-details-delete") {
      if (
        confirm(
          "Do you really want to delete this post?\nThis can't be undone."
        )
      ) {
        await httpClient.delete(`/posts/${currentPostId}`);
        window.location.replace("/index.html");
      }
    } else if (e.target.id === "post-likes") {
      const updatedPost = await toggleLikeToPost(currentPost);
      document.getElementById("post-likes-number").textContent =
        updatedPost.likes;
      e.target.classList.toggle("fa-solid");
    }
  }, 1500)
);

async function toggleLikeToPost(post) {
  likePost = !likePost;
  let currentPostLikes = post.likes;
  const likes = likePost ? currentPostLikes + 1 : currentPostLikes;

  const updatedPost = await httpClient.patch(`/posts/${post.id}`, {
    likes: likes,
  });

  return updatedPost;
}

function throttle(fn, interval) {
  let enableCall = true;

  return (...args) => {
    if (!enableCall) return;

    enableCall = false;
    fn(...args);
    setTimeout(() => (enableCall = true), interval);
  };
}

async function renderDetails() {
  const post = await httpClient.get(`/posts/${currentPostId}`);
  renderPostDetailsMarkup(post);
}

async function renderPostDetailsMarkup(post) {
  const {
    id,
    title,
    subTitle,
    body,
    image,
    createDate,
    likes,
    author,
    tags: currTags,
  } = post;

  const { name, lastName } = await httpClient.get(`/authors/${author}`);

  const usersOptions = users.map(
    (user) =>
      `<option value="${user.id}">${user.name} ${user.lastName}</option>`
  );

  const tagsSlugs = tags
    .filter((tag) => currTags.includes(tag.id))
    .map((tag) => `<span class="post-details__tag">#${tag.slug}</span>`);

  const commentsByPost = comments.filter((comment) => comment.postId === id);

  const postDetailsMarkup = `
  <header class="post-details-header">
        <a id="post-details-delete" class="post-details-delete">
          Delete Post <i class="fa-solid fa-trash-can"></i>
        </a>
        <a href="./edit.html?id=${currentPostId}" class="post-details-edit">
          Edit Post <i class="fa-solid fa-file-pen"></i>
        </a>
      </header>
  <article class="post-details">
  <div class="post-details__image-container">
    <img
      src="${image}"
      alt="The image of the post"
      class="post-details__image"
    />
  </div>
  <div class="post-details__text-container">
    <div class="post-details__info">
      <div class="post-details__creation">
        <p class="post-details__author">${name + " " + lastName}</p>
        <small class="post-details__date">Posted on ${new Date(
          createDate
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</small>
      </div>
      <div class="post-details__likes">
        <i id="post-likes" class="fa-regular fa-heart"></i><span id='post-likes-number'>${likes}</span>
      </div>
    </div>
    <h2 class="post-details__title">${title}</h2>
    <h3 class="post-details__subtitle">${subTitle}</h3>
    <div class="post-details__tags">${tagsSlugs.join("")}</div>
    <p class="post-details__body">
      ${body}
    </p>
  </div>
  <div class="post-details__comments">
    <p class="post-details__label">All comments (${commentsByPost.length})</p>
    <form id="post-details__new-comment" class="post-details__new-comment">
      <select class="new-comment__author" name="user" id="user">
      ${usersOptions.join("")}
      </select>
      <textarea
        class="new-comment__text"
        name="comment"
        id="comment"
        cols="30"
        rows="6"
      ></textarea>
      <button id="newCommentSubmit" class="new-comment__submit" disabled>Submit</button>
    </form>
    <div class="post-details__comments-list">
    ${commentsByPost.map((comment) => createCommentMarkup(comment.id)).join("")}
    </div>
  </div>
</article>`;

  detailsContainer.insertAdjacentHTML("afterbegin", postDetailsMarkup);
}

function appendComment(comment, commentsContainer) {
  const commentMarkup = createCommentMarkup(comment.id);

  commentsContainer.insertAdjacentHTML("beforeend", commentMarkup);
}

function createCommentMarkup(commentId) {
  const { comment, user } = comments.filter(
    (comment) => comment.id === commentId
  )[0];

  const { name, lastName } = users.filter(
    (currUser) => currUser.id === user
  )[0];

  return `<div class="post-details__comment">
  <p class="comment__author">${name} ${lastName}</p>
  <p class="comment__text">
    ${comment}
  </p>
</div>`;
}

// AUN FALTA

// 3 - que el usuario pueda darle like al post y se sume enviando una peticion patch, con un efecto de toggle al clickar en el icono de like usando debounce

// 8 - usar el patron factory en la app

import HttpClient from "./httpClient.js";
const id = new URLSearchParams(window.location.search).get("id");
const detailsContainer = document.querySelector(".post-details-container");
// let author;
let users;
let comments;
let tags;

const httpClient = new HttpClient(
  "https://delightful-likeable-principle.glitch.me"
);

window.addEventListener("DOMContentLoaded", async (e) => {
  users = await httpClient.get("/users");
  comments = await httpClient.get("/comments");
  tags = await httpClient.get("/tags");
  renderDetails();
});

async function renderDetails() {
  const post = await httpClient.get(`/posts/${id}`);
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

  const postDetailsMarkup = `<article class="post-details">
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
      <span class="post-details__likes">
        <i class="fa-regular fa-heart"></i> ${likes}
      </span>
    </div>
    <h2 class="post-details__title">${title}</h2>
    <h3 class="post-details__subtitle">${subTitle}</h3>
    <div class="post-details__tags">${tagsSlugs.join("")}</div>
    <p class="post-details__body">
      ${body}
    </p>
  </div>
  <div class="post-details__comments">
    <form class="post-details__new-comment">
      <select class="new-comment__author" name="user" id="user">
      ${usersOptions.join("")}
      </select>
      <textarea
        class="new-comment__text"
        name="comment"
        id="1"
        cols="30"
        rows="6"
      ></textarea>
      <button new-comment__submit>Submit</button>
    </form>
    ${commentsByPost.map((comment) => createCommentMarkup(comment.id)).join("")}
  </div>
</article>`;

  detailsContainer.insertAdjacentHTML("afterbegin", postDetailsMarkup);
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
// 1 - estilizar la pagina de details
// 2 - agregar los comentario del post dinamicamente
// 3 - que el usuario pueda darle like al post y se sume enviando una peticion patch, con un efecto de toggle al clickar en el icono de like usando debounce
// 4 - aplicar debounce al formulario de busqueda
// 5 - que el usuario pueda agregar un comentario seleccionando al usuario del select y este se guarde mediante una peticion post
// 6 - que el usuario pueda borrar un post mediante un boton con un icono de basurero y le pida confirmacion antes
// 7 - que el usuario pueda editar un post con clickar un boton y que lo lleve al formulario y precargue los datos en los campos del mismo y que al darle guardar se envien los cambios mediante una peticion patch
// 8 - usar el patron factory en la app

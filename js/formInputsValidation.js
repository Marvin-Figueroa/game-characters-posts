const urlRegEx =
  /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#&//=]*)$/i;

const nameRegEx = /^\b([A-Za-zÀ-ÿ][-,a-z. ']+[ ]*)+$/;

const tagRegEx = /^[a-z0-9\s]+$/i;

export default function checkInputs(inputs) {
  inputs.forEach((input) => {
    const { value, name } = input;

    if (value.trim() === "") {
      setInputError(input, "This field cannot be empty");
    } else if (name === "author") {
      if (!nameRegEx.test(value)) {
        setInputError(input, "This field only accepts letters");
      } else {
        setInputSuccess(input);
      }
    } else if (name === "imageUrl") {
      if (!urlRegEx.test(value)) {
        setInputError(input, "Enter a valid image URL");
      } else {
        setInputSuccess(input);
      }
    } else if (name === "tags") {
      if (!validateTags(value)) {
        setInputError(input, "Tags must be comma separated alfanumeric values");
      } else {
        setInputSuccess(input);
      }
    } else {
      setInputSuccess(input);
    }
  });
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
      .filter((tag) => tagRegEx.test(tag)).length > 0
  );
}

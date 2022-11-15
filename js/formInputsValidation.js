const urlRegEx =
  /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#&//=]*)$/i;

const nameRegEx = /^\b([A-Za-zÀ-ÿ][-,a-z. ']+[ ]*)+$/;

export function areValidInputs(inputs) {
  let validInputs = true;
  inputs.forEach((input) => {
    const { value, name } = input;

    if (value.trim() === "") {
      setInputError(input, "This field cannot be empty");
      validInputs = false;
    } else if (name === "author") {
      setInputSuccess(input);
    } else if (name === "imageUrl") {
      if (!urlRegEx.test(value)) {
        setInputError(input, "Enter a valid image URL");
        validInputs = false;
      } else {
        setInputSuccess(input);
      }
    } else if (name === "tags") {
      if (!areValidTags(value)) {
        setInputError(
          input,
          "Must be comma separated alfanumeric lowercase values"
        );
        validInputs = false;
      } else {
        setInputSuccess(input);
      }
    } else {
      setInputSuccess(input);
    }
  });

  return validInputs;
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

export function areValidTags(tags) {
  const tagRegEx = /^\b\w*[-]{0,1}\w*\b$/;
  let validTags = true;

  tags
    .split(",")
    .map((tag) => tag.trim())
    .forEach((tag) => {
      if (!tagRegEx.test(tag)) {
        validTags = false;
      }
    });

  return validTags;
}

export default class HttpClient {
  static #instance;
  #baseURL = "";

  constructor(baseURL) {
    if (HttpClient.#instance) {
      return HttpClient.#instance;
    }

    HttpClient.#instance = this;
    this.#baseURL = baseURL;
  }

  async #fetchJSON(endpoint, options = {}) {
    const res = await fetch(this.#baseURL + endpoint, { ...options });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    if (res.status !== 204) {
      return res.json();
    }

    return undefined;
  }

  get(endpoint, options = {}) {
    return this.#fetchJSON(endpoint, {
      ...options,
      method: "GET",
    });
  }

  post(endpoint, body, options = {}) {
    return this.#fetchJSON(endpoint, {
      ...options,
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  delete(endpoint, options = {}) {
    return this.#fetchJSON(endpoint, {
      ...options,
      method: "DELETE",
    });
  }

  patch(endpoint, body, options = {}) {
    return this.#fetchJSON(endpoint, {
      ...options,
      body: JSON.stringify(body),
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

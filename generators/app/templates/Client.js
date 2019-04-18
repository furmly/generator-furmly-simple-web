const HTTP_VERBS = {
  POST: "POST",
  DELETE: "DELETE",
  PUT: "PUT",
  GET: "GET"
};
const parseJson = function(response) {
  if (response.status !== 200) {
    return response.json().then(x => {
      throw new Error(x.message);
    });
  }
  return response.json();
};
const secure = function(obj = {}) {
  if (!this.credentials) throw new Error("No Credentials to send");
  obj.headers = {
    ...obj.headers,
    Authorization: `Bearer ${this.credentials.access_token}`
  };
  return obj;
};
const _fetch = function(url, ...args) {
  args.unshift(`${this.baseUrl}${url}`);
  return fetch.apply(null, args).then(parseJson.bind(this));
};
class Client {
  constructor(baseUrl, credentials) {
    if (typeof baseUrl !== "string")
      throw new Error("Base URL must be a string");
    this.baseUrl = baseUrl;
    this.credentials = credentials;
  }

  getMenu(name) {
    return _fetch.call(
      this,
      `/api/admin/acl?category=${name || "MAINMENU"}`,
      {}
    );
  }
}

export default Client;

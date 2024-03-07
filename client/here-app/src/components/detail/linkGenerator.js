export class LinkGenarator {
  static #baseUrl = "http://localhost:5173/locations";
  /*
    @params:
        id: The location id.
        state: state of the location.
        title: location title.
    @feature:
        convert the params 
        to the url 
        for location sharing
    */
  static convertLocationToUrl = (id="", country="", title="") => {
    return (
      this.#baseUrl +
      `/${String(country).toLowerCase()}/${
        String(title).replace(/\s+/g, "-").toLowerCase()
      }-${id}`
    );
  };

  /*
    @params:
        url: the location share url. 
    @feature:
        convert the location url share
         to id.
    */
  static convertUrlToId = (url = "") => {
    let id = ""
    if (String(url).startsWith(this.#baseUrl)) {
        let titleWithId = url.split("/").at(url.split("/").length -1);
        id = titleWithId.split("-").at(titleWithId.split("-").length-1);
    }
    return id;
  };
}

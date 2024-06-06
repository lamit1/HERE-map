import { LinkGenarator } from "../components/detail/linkGenerator";

// Function to remove the pointerleave listener
const removePointerLeaveListener = (marker, bubble, map) => {
  marker.removeEventListener("pointerleave", (evt) =>
    pointerLeaveListener(evt, marker, bubble, map)
  );
};

// Function to add the pointerleave listener
const addPointerLeaveListener = (marker, bubble, map) => {
  marker.addEventListener(
    "pointerleave",
    (evt) => pointerLeaveListener(evt, marker, bubble, map),
    false
  );
};

// Pointer leave event listener
const pointerLeaveListener = function (evt, marker, bubble, map) {
  // Check if the bubble exists and remove it
  marker.setIcon(
    new H.map.Icon("/assets/endmarker.svg", { size: { w: 24, h: 24 } })
  );
  marker.setZIndex(0);
  if (bubble) {
    map?.UI.removeBubble(bubble);
    bubble.close();
  }
};

export const addBubbleInfoCategory = (
  map,
  lat,
  lng,
  id,
  name,
  imageUrl,
  address,
  rating,
  totalReviews,
  setDestination,
  setDetailId,
  setSearchResults,
  country
) => {
  console.log(country);
  try {
    const marker = new H.map.Marker(
      { lat, lng },
      {
        icon: new H.map.Icon("/assets/endmarker.svg", {
          size: { w: 24, h: 24 },
        }),
      }
    );

    marker.setData(`
      <div style="display: flex; flex-direction: column; padding: 10px; background-color: #fff;">
          <div style="display:flex; flex-direction:row; ">
            <img src=${
              imageUrl || "/assets/no-image.jpg"
            } style="width: 3rem; height: 3rem; margin: 0.5rem; border-radius: 50%; border: 1px solid; object-fit: cover;"/>
            <div style="display: flex; flex-direction:column; flex:4;">
              <div style="font-weight: bold; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; font-size: 20px; margin-bottom: 5px; margin-right:2rem;">${name}</div>
              <div style="font-size: small; margin-bottom: 5px;">${address}</div>
            </div>
          </div>
        <div style="display:flex; flex-direction:row; gap:1rem; justify-content:center; align-items:center;">
          ${
            rating?.provider
              ? `
            <img style="height:3rem; width:auto" src="${
              (rating?.provider == "YELP" && "/assets/Yelp_Logo.png") ||
              (rating?.provider == "TRIPADVISOR" &&
                "/assets/Tripadvisor-Logo.png") ||
              ""
            }"/>
            <div style="display:flex; flex-direction:row; align-items:center; justify-content:center;">
              <div style="">${rating?.value}</div>
              <img style="height:1rem;" src="/assets/star.png"/>
            </div>
            `
              : `<div style="flex:2"></div>`
          }
          ${
            totalReviews
              ? `<div style=";text-align:center; font-size: 12px; padding:0.5rem">${totalReviews} Reviews</div>`
              : ""
          }
          </div>
        </div>
    `);

    map?.addObject(marker);

    let bubble = new H.ui.InfoBubble(
      { lat, lng },
      { content: marker.getData() }
    );

    bubble.setData(id);

    // Create an event listener for pointerenter to show the info bubble
    marker.addEventListener(
      "pointerenter",
      function (evt) {
        // Assuming newWidth and newHeight are the new desired width and height of the marker icon
        marker.setIcon(
          new H.map.Icon("/assets/endmarker.svg", { size: { w: 40, h: 40 } })
        );
        map?.UI.addBubble(bubble);
        bubble.open();
      },
      false
    );

    // Create an event listener for pointerleave to remove the info bubble
    marker.addEventListener(
      "pointerleave",
      (evt) => pointerLeaveListener(evt, marker, bubble, map),
      false
    );

    marker.addEventListener("tap", (evt) => {
      map?.removeObjects(map?.getObjects().filter((o) => o !== marker));
      setDestination((prevDes) => ({
        position: { lat, lng },
        name: name,
        id: id,
      }));
      if(window.location.href !== LinkGenarator.convertLocationToUrl(id, country, name)) {
        console.log(country);
        window.history.pushState(
          null,
          "",
          LinkGenarator.convertLocationToUrl(id, country, name)
        );
      }
      setDetailId(id);
    });
    map?.setCenter({ lat, lng });
  } catch (error) {
    console.log(error);
  }
};

export const addBubbleLabel = (
  map,
  title,
  address,
  position,
  id,
  name,
  country
) => {
  console.log(position);
  const marker = new H.map.Marker(position, {
    icon: new H.map.Icon("/assets/endmarker.svg", { size: { w: 24, h: 24 } }),
  });
  marker.setData(`
    <div className= "display: flex, flex-direction:column" >
      <div>${title}</div>
      <div>${address}</div>
    </div>
  `);

  const bubble = new H.ui.InfoBubble(position, {
    content: marker.getData(),
  });

  marker.addEventListener(
    "pointerenter",
    function (evt) {
      marker.setIcon(
        new H.map.Icon("/assets/endmarker.svg", { size: { w: 40, h: 40 } })
      );
      marker.setZIndex(10);
      map?.UI.addBubble(bubble);
      bubble.open();
    },
    false
  );

  // Create an event listener for pointerleave to remove the info bubble
  marker.addEventListener(
    "pointerleave",
    (evt) => pointerLeaveListener(evt, marker, bubble, map),
    false
  );
  map?.addObject(marker);
  map?.setCenter(position);
};

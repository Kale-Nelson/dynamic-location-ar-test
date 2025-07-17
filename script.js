let startingLatitude = null;
let startingLongitude = null;
let northOffset = 0;
let eastOffset = 0;
let modelIndex = 0;
let modelEntity = null;

const models = [
  {
    url: "./assets/magnemite/scene.gltf",
    scale: "0.5 0.5 0.5",
    info: "Magnemite, Lv. 5, HP 10/10",
    rotation: "0 0 0",
  },
  {
    url: "./assets/articuno/scene.gltf",
    scale: "0.2 0.2 0.2",
    rotation: "0 0 0",
    info: "Articuno, Lv. 80, HP 100/100",
  },
  {
    url: "./assets/dragonite/scene.gltf",
    scale: "0.08 0.08 0.08",
    rotation: "0 0 0",
    info: "Dragonite, Lv. 99, HP 150/150",
  },
];

window.addEventListener("load", () => {
  const button = document.querySelector('button[data-action="change"]');
  button.innerText = "﹖";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        startingLatitude = position.coords.latitude;
        startingLongitude = position.coords.longitude;
        renderModelInLocation();
        document
          .querySelectorAll(".direction-button, .randomize-button")
          .forEach((btn) => (btn.disabled = false));
      },
      () => {
        alert("Could not get GPS location. Please enable location services.");
      }
    );
  }

  button.addEventListener("click", () => {
    changeModel(1);
  });

  document.querySelectorAll(".direction-button").forEach((btn) => {
    btn.addEventListener("click", (e) => {});
  });

  document
    .querySelectorAll(".direction-button, .randomize-button")
    .forEach((btn) => (btn.disabled = true));
});

function moveOffset(north, east) {
  if (startingLatitude === null || startingLongitude === null) {
    alert("Waiting for GPS location...");
    return;
  }

  northOffset += north;
  eastOffset += east;

  updateModelPosition();
}

function resetOffset() {
  northOffset = 0;
  eastOffset = 0;

  updateModelPosition();
}

function offsetLatLng(lat, lng, north, east) {
  const latitude = north * 0.000009;
  const longitude = (east * 0.000009) / Math.cos((lat * Math.PI) / 180);

  return { latitude: lat + latitude, longitude: lng + longitude };
}

function renderModelInLocation() {
  const scene = document.querySelector("a-scene");

  if (modelEntity && modelEntity.parentNode) {
    modelEntity.parentNode.removeChild(modelEntity);
  }
  modelEntity = document.createElement("a-entity");
  modelEntity.setAttribute("animation-mixer", "");
  setModel(models[modelIndex], modelEntity);
  updateModelPosition();

  scene.appendChild(modelEntity);
}

function updateModelPosition() {
  if (!modelEntity || startingLatitude === null || startingLongitude === null) {
    return;
  }

  const { latitude: newLat, longitude: newLng } = offsetLatLng(
    startingLatitude,
    startingLongitude,
    northOffset,
    eastOffset
  );

  modelEntity.setAttribute(
    "gps-entity-place",
    `latitude: ${newLat}; longitude: ${newLng};`
  );

  const div = document.querySelector(".instructions");
  div.innerText = models[modelIndex].info;
}

function changeModel(direction = 1) {
  modelIndex = (modelIndex + direction + models.length) % models.length;
  setModel(models[modelIndex], modelEntity);
  updateModelPosition();
}

function setModel(model, entity) {
  if (!entity) {
    return;
  }

  if (model.scale) {
    entity.setAttribute("scale", model.scale);
  }

  if (model.rotation) {
    entity.setAttribute("rotation", model.rotation);
  }

  if (model.position) {
    entity.setAttribute("position", model.position);
  }

  entity.setAttribute("gltf-model", model.url);
}

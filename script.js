window.addEventListener("load", () => {
  const button = document.querySelector('button[data-action="change"]');
  button.innerText = "﹖";

  renderModelInFront();
  button.addEventListener("click", changeModel);
});

var currentEntity = null;
function renderModelInFront() {
  let scene = document.querySelector("a-scene");
  if (currentEntity) {
    scene.removeChild(currentEntity);
  }

  let model = document.createElement("a-entity");
  model.setAttribute("position", "0 0 -3");
  setModel(models[modelIndex], model);
  model.setAttribute("animation-mixer", "");

  let camera = document.querySelector("a-camera");
  camera.appendChild(model);
  currentEntity = model;
}

function changeModel() {
  modelIndex = (modelIndex + 1) % models.length;
  renderModelInFront();
}

var models = [
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

var modelIndex = 0;
var setModel = function (model, entity) {
  if (model.scale) {
    entity.setAttribute("scale", model.scale);
  }
  if (model.rotation) {
    entity.setAttribute("rotation", model.rotation);
  }
  entity.setAttribute("gltf-model", model.url);
  const div = document.querySelector(".instructions");
  div.innerText = model.info;
};

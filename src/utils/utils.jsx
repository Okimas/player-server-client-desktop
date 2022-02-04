export const getElementOffset = (el) => {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = 0;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};

export const isValidUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (error) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

export const normalizeString = (string) => {
  return string.normalize("NFD").replace(/\p{Diacritic}/gu, "");
};

export const normalizeArrayOfString = (array) => {
  return array.map((item) => {
    return normalizeString(item.toLowerCase());
  });
};

export const durationToTime = (duration) => {
  if (!duration || duration === 0) return "00:00";
  const sec = parseInt(duration, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - hours * 3600) / 60);
  let seconds = sec - hours * 3600 - minutes * 60;

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  return (hours !== "00" ? hours + ":" : "") + minutes + ":" + seconds;
};

export const getProfileMedias = (profileData) => {
  const medias = [];
  if (profileData.collections) {
    for (let i = 0; i < profileData.collections.length; i++) {
      const collection = profileData.collections[i];
      for (let j = 0; j < collection.medias.length; j++) {
        if (
          collection.medias[j].mime.startsWith("audio/") ||
          collection.medias[j].mime.startsWith("video/")
        )
          medias.push(collection.medias[j]);
      }
    }
  } else {
    for (let j = 0; j < profileData.medias.length; j++) {
      if (
        profileData.medias[j].mime.startsWith("audio/") ||
        profileData.medias[j].mime.startsWith("video/")
      )
        medias.push(profileData.medias[j]);
    }
  }
  return medias;
};

export const unsetDraggable = (draggableElem) => {
  document.onmouseup = null;
  document.onmousemove = null;
  draggableElem.onmousedown = null;
};

export const setDraggable = (draggableElem) => {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  const screenW = document.body.clientWidth;
  const screenH = document.body.clientHeight;
  const elemW = draggableElem.clientWidth;
  const elemH = draggableElem.clientHeight;

  draggableElem.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    if (e.target.getAttribute("id") !== "volume-range") {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  }

  function elementDrag(e) {
    e = e || window.event;
    if (e.target.getAttribute("id") !== "volume-range") {
      e.preventDefault();
      const elemPos = getElementOffset(draggableElem);
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      let nPosTop = draggableElem.offsetTop - pos2;
      let nPosLeft = draggableElem.offsetLeft - pos1;

      if (elemPos.top < 0) nPosTop = 0;
      if (elemPos.left < 0) nPosLeft = 0;
      if (elemPos.top > screenH - elemH) nPosTop = screenH - elemH;
      if (elemPos.left > screenW - elemW) nPosLeft = screenW - elemW;

      draggableElem.style.top = nPosTop + "px";
      draggableElem.style.left = nPosLeft + "px";
    }
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
};

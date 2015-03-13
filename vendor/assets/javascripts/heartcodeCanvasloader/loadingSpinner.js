var cl = new CanvasLoader('canvasloader-container');
cl.setDiameter(34); // default is 40
cl.show(); // Hidden by default

// This bit is only for positioning - not necessary
var loaderObj = document.getElementById("canvasLoader");
loaderObj.style.position = "absolute";
loaderObj.style["top"] = cl.getDiameter() * -0.5 + "px";
loaderObj.style["left"] = cl.getDiameter() * -0.5 + "px";
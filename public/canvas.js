let canvas = document.querySelector("canvas")
let pencilColor = document.querySelectorAll(".pencil-color")
let pencilWidthElem = document.querySelector(".pencil-width")
let eraserWidthElem = document.querySelector(".eraser-width")
let download = document.querySelector(".download")

let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

// undo redo funcitonality
let undoRedoTracker = [];// rep which action from tracker array
let track = 0;
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let mouseDown = false;// mouse down condition m nhi h

let tool = canvas.getContext("2d");// api h function included h for all sort of drawing

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;


// mouse down ->start new path
// mouse move ->path fill(graphics)
canvas.addEventListener("mousedown", (e) => {

    mouseDown = true;
    let data = {
        x: e.clientX,
        y: e.clientY
    }
    socket.emit("beginPath", data);
})

canvas.addEventListener("mousemove", (e) => {

    if (mouseDown) {
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth
        }
        // send data to server
        socket.emit("drawStroke", data);
    }
})

canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);    // main function
    track = undoRedoTracker.length - 1;
})

// undo track--
// undo

undo.addEventListener("click", (e) => {
    if (track > 0) track--;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
})
redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length) track++;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
})

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); // new image reference element
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}



function Pathbegin(obj) {
    tool.beginPath();
    tool.moveTo(obj.x, obj.y);
}

function drawStroke(obj) {
    tool.strokeStyle = obj.color;
    tool.lineWidth = obj.width;
    tool.lineTo(obj.x, obj.y);
    tool.stroke();
}

pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

pencilWidthElem.addEventListener("change", (e) => {
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
})

eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})


// eraser aya from tools.js
// sab aya tools.js se
eraser.addEventListener("click", (e) => {
    if (eraserFlag) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }
    else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

// download button

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})


// 

socket.on("beginPath", (data) => {
    // data -> data from server
    Pathbegin(data);
})

socket.on("drawStroke", (data) => {
    drawStroke(data);
})

socket.on("redoUndo", (data) => {
    undoRedoCanvas(data);
})













































// // tool.strokeStyle = "red"; // for setting the color of the line
// // tool.lineWidth = "8";// increase or dec the width

// // tool.beginPath(); // new graphic(path)
// // tool.moveTo(10, 10);  // start point of the line

// // tool.lineTo(100, 150); // end point
// // tool.stroke(); // fill color

// // tool.lineTo(200, 500)
// // tool.stroke()


// undo.addEventListener("click", (e) => {
//     if (track > 0) {
//         track--;
//     }
//     // action perform
//     let data = {
//         trackValue: track,
//         undoRedoTracker
//     }

//     socket.emit("redoUndo", data);
// })

// // redo track--
// // redo
// redo.addEventListener("click", (e) => {
//     if (track < undoRedoTracker.length - 1) {
//         track++;
//     }
//     // action perform
//     let data = {
//         trackValue: track,
//         undoRedoTracker
//     }
//     socket.emit("redoUndo", data);
// })

// function undoRedoCanvas(trackobj) {
//     track = trackobj.trackValue;
//     undoRedoTracker = trackobj.undoRedoTracker;

//     let img = new Image(); // new image reference eleement
//     let url = undoRedoTracker[track];
//     img.src = url;
//     img.onload = (e) => {
//         tool.drawImage(img, 0, 0, canvas.width, canvas.height);
//     }
// }
function Resize(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let canvas, ctx;
let drawingHistory = [];
let historyIndex = -1;
let drawing = false;
let color = "#000000";
let lineWidth = 10;

window.addEventListener("load", () => {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    Resize(canvas);

    // Variables to store previous touch/mouse coordinates
    let lastX, lastY;

    function startPosition(event) {
        drawing = true;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";

        // Get the initial touch/mouse position
        const pos = getMousePos(canvas, event);
        lastX = pos.x;
        lastY = pos.y;

        // Begin the drawing path
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        document.getElementById("share-link").style.display = "block";
    }

    function endPosition() {
        if (drawing) {
            drawingHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
            historyIndex = drawingHistory.length - 1;
            updateShareLink();
        }
        drawing = false;
        ctx.closePath();
    }

    function draw(event) {
        if (!drawing) return;

        // Get the current touch/mouse position
        const pos = getMousePos(canvas, event);
        const currentX = pos.x;
        const currentY = pos.y;

        // Draw a line segment from the last position to the current position
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Update the last position to the current position
        lastX = currentX;
        lastY = currentY;
    }

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", endPosition);
    canvas.addEventListener("mousemove", draw);

    canvas.addEventListener("touchstart", (event) => {
        event.preventDefault();
        startPosition(event.touches[0]);
    });

    canvas.addEventListener("touchend", endPosition);
    canvas.addEventListener("touchmove", (event) => {
        event.preventDefault();
        draw(event.touches[0]);
    });

    document.getElementById("clear-btn").addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawingHistory = [];
        historyIndex = -1;
        updateShareLink();
    });

    document.getElementById("clear-btn-mobile").addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawingHistory = [];
        historyIndex = -1;
        updateShareLink();
    });

    document.getElementById("color-picker").addEventListener("input", (event) => {
        color = event.target.value;
    });

    document.getElementById("color-picker-sidebar").addEventListener("input", (event) => {
        color = event.target.value;
    });

    document.getElementById("line-width").addEventListener("input", (event) => {
        lineWidth = event.target.value;
    });

    document.getElementById("line-width-sidebar").addEventListener("input", (event) => {
        lineWidth = event.target.value;
    });

    document.getElementById("set-btn").addEventListener("click", () => {
        if (drawingHistory.length === 0) {
            Swal.fire("lezmik torsom 7aga");
            return;
        }
        const dataUrl = canvas.toDataURL("image/png");
        localStorage.setItem("canvas_image", dataUrl);
        updateShareLink(dataUrl);
    });

    document.getElementById("set-btn-mobile").addEventListener("click", () => {
        if (drawingHistory.length === 0) {
            Swal.fire("lezmik torsom 7aga");
            return;
        }
        const dataUrl = canvas.toDataURL("image/png");
        localStorage.setItem("canvas_image", dataUrl);
        updateShareLink(dataUrl);
    });

    document.getElementById("download-btn").addEventListener("click", () => {
        if (drawingHistory.length === 0) {
            Swal.fire("generati link wila lezmik torsom 7aga");
            return;
        }
        const dataUrl = localStorage.getItem("canvas_image");
        if (dataUrl) {
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "canvas_image.jpg";
            link.click();
        } else {
            Swal.fire("No image saved.");
        }
    });

    document.getElementById("download-btn-mobile").addEventListener("click", () => {
        if (drawingHistory.length === 0) {
            Swal.fire("generati link wila lezmik torsom 7aga");
            return;
        }
        const dataUrl = localStorage.getItem("canvas_image");
        if (dataUrl) {
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "canvas_image.jpg";
            link.click();
        } else {
            Swal.fire("No image saved.");
        }
    });

    document.getElementById("undo-btn").addEventListener("click", () => {
        if (historyIndex > 0) {
            historyIndex--;
            ctx.putImageData(drawingHistory[historyIndex], 0, 0);
            updateShareLink();
        }
    });

    document.getElementById("redo-btn").addEventListener("click", () => {
        if (historyIndex < drawingHistory.length - 1) {
            historyIndex++;
            ctx.putImageData(drawingHistory[historyIndex], 0, 0);
            updateShareLink();
        }
    });

    document.getElementById("copy-link-btn").addEventListener("click", () => {
        const imageLink = document.getElementById
        ("image-link");
        navigator.clipboard.writeText(imageLink.textContent).then(() => {
            Swal.fire("Image link copied to clipboard!");
        });
    });

    document.getElementById("tab-btn").addEventListener("click", () => {
        const sidebar = document.getElementById("sidebar");
        sidebar.style.right = sidebar.style.right === "0px" ? "-250px" : "0px";
    });

    document.getElementById("close-tab-btn").addEventListener("click", () => {
        const sidebar = document.getElementById("sidebar");
        sidebar.style.right = "-250px";
    });

    function updateShareLink(imageUrl) {
        const imageLink = document.getElementById("image-link");
        if (imageUrl) {
            imageLink.textContent = imageUrl;
        } else {
            imageLink.textContent = `no_link_set`;
        }
    }

    function getMousePos(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
});

window.addEventListener("resize", () => {
    Resize(canvas);
});

// Zoom functionality
let scale = 1;
canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    const scaleFactor = 0.1; // Adjust as needed
    const deltaY = event.deltaY;
    if (deltaY < 0) {
        // Zoom in
        scale += scaleFactor;
    } else {
        // Zoom out
        scale -= scaleFactor;
    }
    canvas.style.transform = `scale(${scale})`;
});
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
let scale = 1;

window.addEventListener("load", () => {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    Resize(canvas);
    loadColorFromStorage(); // Load previously stored background color

    let lastX, lastY;

    // Helper Functions
    function setupEventListeners() {
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

        document.getElementById("clear-btn").addEventListener("click", clearCanvas);
        document.getElementById("clear-btn-mobile").addEventListener("click", clearCanvas);
        document.getElementById("color-picker").addEventListener("input", changeColor);
        document.getElementById("color-picker-sidebar").addEventListener("input", changeColor);
        document.getElementById("line-width").addEventListener("input", changeLineWidth);
        document.getElementById("line-width-sidebar").addEventListener("input", changeLineWidth);
        document.getElementById("set-btn").addEventListener("click", setCanvasImage);
        document.getElementById("set-btn-mobile").addEventListener("click", setCanvasImage);
        document.getElementById("download-btn").addEventListener("click", downloadImage);
        document.getElementById("download-btn-mobile").addEventListener("click", downloadImage);
        document.getElementById("undo-btn").addEventListener("click", undo);
        document.getElementById("redo-btn").addEventListener("click", redo);
        document.getElementById("copy-link-btn").addEventListener("click", copyLink);
        document.getElementById("tab-btn").addEventListener("click", toggleSidebar);
        document.getElementById("close-tab-btn").addEventListener("click", closeSidebar);
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawingHistory = [];
        historyIndex = -1;
        updateShareLink();
    }

    function changeColor(event) {
        color = event.target.value;
        localStorage.setItem("background_color", color); // Save color to local storage
    }

    function changeLineWidth(event) {
        lineWidth = event.target.value;
    }

    function setCanvasImage() {
        if (drawingHistory.length === 0) {
            Swal.fire("Your screen is empty draw something");
            return;
        }
        const dataUrl = canvas.toDataURL("image/png");
        localStorage.setItem("canvas_image", dataUrl);
        updateShareLink(dataUrl);
    }

    function downloadImage() {
        if (drawingHistory.length === 0) {
            Swal.fire("You can't download unless you click <b>SET</b>");
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
    }

    function undo() {
        if (historyIndex > 0) {
            historyIndex--;
            ctx.putImageData(drawingHistory[historyIndex], 0, 0);
            updateShareLink();
        }
    }

    function redo() {
        if (historyIndex < drawingHistory.length - 1) {
            historyIndex++;
            ctx.putImageData(drawingHistory[historyIndex], 0, 0);
            updateShareLink();
        }
    }

    function copyLink() {
        const imageLink = document.getElementById("image-link");
        navigator.clipboard.writeText(imageLink.textContent).then(() => {
            Swal.fire("Image link copied to clipboard!");
        });
    }

    function toggleSidebar() {
        const sidebar = document.getElementById("sidebar");
        sidebar.style.right = sidebar.style.right === "0px" ? "-250px" : "0px";
    }

    function closeSidebar() {
        const sidebar = document.getElementById("sidebar");
        sidebar.style.right = "-250px";
    }

    function updateShareLink(imageUrl) {
        const imageLink = document.getElementById("image-link");
        imageLink.textContent = imageUrl ? imageUrl : `no_link_set`;
    }

    function getMousePos(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    function startPosition(event) {
        drawing = true;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";

        const pos = getMousePos(event);
        lastX = pos.x;
        lastY = pos.y;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        document.getElementById("share-link").style.display = "block";
    }

    function endPosition() {
        if (drawing) {
            drawingHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
            if (drawingHistory.length > 50) drawingHistory.shift(); // Limit history to improve performance
            historyIndex = drawingHistory.length - 1;
            updateShareLink();
        }
        drawing = false;
        ctx.closePath();
    }

    function draw(event) {
        if (!drawing) return;

        const pos = getMousePos(event);
        const currentX = pos.x;
        const currentY = pos.y;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        lastX = currentX;
        lastY = currentY;
    }

    setupEventListeners();
});

window.addEventListener("resize", () => {
    Resize(canvas);
});

// Zoom functionality
canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    const scaleFactor = 0.1; // Adjust as needed
    const deltaY = event.deltaY;

    scale += deltaY < 0 ? scaleFactor : -scaleFactor;
    scale = Math.min(Math.max(0.5, scale), 3); // Limit scale between 0.5 and 3
    canvas.style.transform = `scale(${scale})`;
});

function loadColorFromStorage() {
    const savedColor = localStorage.getItem("background_color");
    if (savedColor) {
        color = savedColor;
        document.getElementById("color-picker").value = savedColor;
        document.getElementById("color-picker-sidebar").value = savedColor;
    }
}

function Resize(canvas) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const maxWidth = 1920; // Example maximum width
    const maxHeight = 1080; // Example maximum height
    canvas.width = Math.min(window.innerWidth, maxWidth);
    canvas.height = Math.min(window.innerHeight, maxHeight);
    ctx.putImageData(imageData, 0, 0);
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
    loadColorFromStorage();

    let lastX, lastY;

    // Initialize Canvas History
    drawingHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    historyIndex = 0;

    // Event Listeners
    setupEventListeners();

    function setupEventListeners() {
        // Canvas Events
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

        // Button Events
        addEventListeners(["clear-btn", "clear-btn-mobile"], "click", clearCanvas);
        addEventListeners(
            ["color-picker", "color-picker-sidebar"],
            "input",
            changeColor
        );
        addEventListeners(
            ["line-width", "line-width-sidebar"],
            "input",
            changeLineWidth
        );
        addEventListeners(["set-btn", "set-btn-mobile"], "click", setCanvasImage);
        addEventListeners(
            ["download-btn", "download-btn-mobile"],
            "click",
            downloadImage
        );
        document.getElementById("undo-btn").addEventListener("click", undo);
        document.getElementById("redo-btn").addEventListener("click", redo);
        document.getElementById("copy-link-btn").addEventListener("click", copyLink);
        document.getElementById("tab-btn").addEventListener("click", toggleSidebar);
        document
            .getElementById("close-tab-btn")
            .addEventListener("click", closeSidebar);
    }

    function addEventListeners(elementIds, event, handler) {
        elementIds.forEach((id) =>
            document.getElementById(id).addEventListener(event, handler)
        );
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawingHistory = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
        historyIndex = 0;
        updateShareLink();
    }

    function changeColor(event) {
        color = event.target.value;
        Swal.fire("New color applied to future drawings.");
        localStorage.setItem("background_color", color);
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
        localStorage.setItem("InkLink-img", dataUrl);
        updateShareLink(dataUrl);
    }

    function downloadImage() {
        if (drawingHistory.length === 0) {
            Swal.fire("You can't download unless you click <b>SET</b>");
            return;
        }
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "InkLink-img.png";
        link.click();
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
        const dataUrl = imageUrl || canvas.toDataURL("image/png");
        const imageLink = document.getElementById("image-link");
        imageLink.textContent = dataUrl ? dataUrl : `no_link_set`;
    }

    function getMousePos(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
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
            drawingHistory = drawingHistory.slice(0, historyIndex + 1); // Remove redo history
            drawingHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
            if (drawingHistory.length > 100) drawingHistory.shift(); // Limit history
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
});

window.addEventListener("resize", () => {
    Resize(canvas);
});

function loadColorFromStorage() {
    const savedColor = localStorage.getItem("background_color");
    if (savedColor) {
        color = savedColor;
        document.getElementById("color-picker").value = savedColor;
        document.getElementById("color-picker-sidebar").value = savedColor;
    }
}

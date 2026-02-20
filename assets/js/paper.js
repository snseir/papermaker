<<<<<<< HEAD
function buildPDF() {

    const { jsPDF } = window.jspdf;

    const paperSize = document.getElementById("paperSize").value;
    const fileName = document.getElementById("paperName").value;

    let width, height;

    if (paperSize === "letter") {
        width = 216;
        height = 279;
    } else {
        width = 210;
        height = 297;
    }

    const doc = new jsPDF({
        unit: "mm",
        format: [width, height]
    });

    const pageColor = document.getElementById("pageColor").value;

    const m = parseFloat(document.getElementById("marg").value);

    const drawLeft = m;
    const drawRight = width - m;
    const drawTop = m;
    const drawBottom = height - m;

    const spacing = parseFloat(document.getElementById("spacing").value);
    const minorThickness = parseFloat(document.getElementById("minorThickness").value);
    const majorThickness = parseFloat(document.getElementById("majorThickness").value);
    const majorEvery = parseInt(document.getElementById("majorEvery").value);

    const minorColor = document.getElementById("minorColor").value;
    const majorColor = document.getElementById("majorColor").value;

    function hexToRGB(hex) {
        return [
            parseInt(hex.substring(1,3),16),
            parseInt(hex.substring(3,5),16),
            parseInt(hex.substring(5,7),16)
        ];
    }

    // page color
    doc.setFillColor(...hexToRGB(pageColor));
    doc.rect(0, 0, width, height, "F");

    let countX = 0;
    for (let x = drawLeft; x <= drawRight; x += spacing) {

        if (countX % majorEvery === 0) {
            doc.setLineWidth(majorThickness);
            doc.setDrawColor(...hexToRGB(majorColor));
        } else {
            doc.setLineWidth(minorThickness);
            doc.setDrawColor(...hexToRGB(minorColor));
        }

        doc.line(x, drawTop, x, drawBottom);
        countX++;
    }

    let countY = 0;
    for (let y = drawTop; y <= drawBottom; y += spacing) {

        if (countY % majorEvery === 0) {
            doc.setLineWidth(majorThickness);
            doc.setDrawColor(...hexToRGB(majorColor));
        } else {
            doc.setLineWidth(minorThickness);
            doc.setDrawColor(...hexToRGB(minorColor));
        }

        doc.line(drawLeft, y, drawRight, y);
        countY++;
    }

    return doc;
}

function generatePDF() {
    const fileName = document.getElementById("paperName").value;
    const doc = buildPDF();
    doc.save(fileName + ".pdf");
}

function previewPDF() {
    const doc = buildPDF();

    // opens at bottom
    //const blob = doc.output("blob");
    //const url = URL.createObjectURL(blob);
    //document.getElementById("pdfPreview").src = url;

    // opens in new tab
    doc.output("dataurlnewwindow");
}

function createColorPicker(displayId, panelId, inputId) {

    const colors = [
        "#000000","#444444","#666666","#999999","#cccccc","#ffffff",
        "#ff0000","#ff9900","#ffff00","#00ff00","#00ffff","#0000ff",
        "#9900ff","#ff00ff","#f4cccc","#fce5cd","#fff2cc","#d9ead3",
        "#cfe2f3","#ead1dc", "#dddddd", "#aaaaaa"
    ];

    const display = document.getElementById(displayId);
    const panel = document.getElementById(panelId);
    const input = document.getElementById(inputId);

    panel.style.display = "grid";

    colors.forEach(color => {
        const swatch = document.createElement("div");
        swatch.style.background = color;

        swatch.onclick = () => {
            display.style.background = color;
            input.value = color;
            panel.style.display = "none";
        };

        panel.appendChild(swatch);
    });

    display.onclick = () => {
        panel.style.display =
            panel.style.display === "grid" ? "none" : "grid";
    };
}

createColorPicker("minorDisplay","minorPanel","minorColor");


function buildEngineeringPDF() {

    const { jsPDF } = window.jspdf;

    const paperSize = document.getElementById("paperSize").value;
    const fileName = document.getElementById("paperName").value;

    let width, height;

    if (paperSize === "letter") {
        width = 216;
        height = 279;
    } else {
        width = 210;
        height = 297;
    }

    const doc = new jsPDF({
        unit: "mm",
        format: [width, height]
    });

    const pageColor = document.getElementById("pageColor").value;
    const m = parseFloat(document.getElementById("marg").value);

    const drawLeft = m;
    const drawRight = width - m;
    const drawTop = m;
    const drawBottom = height - m;

    const spacing = parseFloat(document.getElementById("spacing").value);

    // Engineering paper uses ONE thickness and ONE color
    const lineThickness = parseFloat(
        document.getElementById("lineThickness")?.value || 0.2
    );

    const lineColor = 
        document.getElementById("lineColor")?.value || "#b6d7a8";


    function hexToRGB(hex) {
        return [
            parseInt(hex.substring(1,3),16),
            parseInt(hex.substring(3,5),16),
            parseInt(hex.substring(5,7),16)
        ];
    }

    // Fill page
    doc.setFillColor(...hexToRGB(pageColor));
    doc.rect(0, 0, width, height, "F");

    // Set uniform line style
    doc.setLineWidth(lineThickness);
    doc.setDrawColor(...hexToRGB(lineColor));

    // Vertical lines
    for (let x = drawLeft; x <= drawRight; x += spacing) {
        doc.line(x, drawTop, x, drawBottom);
    }

    // Horizontal lines
    for (let y = drawTop; y <= drawBottom; y += spacing) {
        doc.line(drawLeft, y, drawRight, y);
    }

    // ----- ENGINEERING BORDER -----
    const borderThickness = parseFloat(
        document.getElementById("borderThickness")?.value || 0.8
    );

    const borderColor =
        document.getElementById("borderColor")?.value || "#000000";

    doc.setLineWidth(borderThickness);
    doc.setDrawColor(...hexToRGB(borderColor));

    // Draw border rectangle at margin
    doc.rect(drawLeft, drawTop,
             drawRight - drawLeft,
             drawBottom - drawTop);

    // ----- TOPS STYLE HEADER -----

    const topsEnabled = document.getElementById("topsStyle")?.checked;

    if (topsEnabled) {

        const headerHeight = spacing * 3; // height of heading area
        const topOfHeader = drawTop - headerHeight;

        doc.setLineWidth(lineThickness);
        doc.setDrawColor(...hexToRGB(lineColor));

        // 1️⃣ Draw 5 vertical header lines
        for (let i = 0; i < 5; i++) {
            let x = drawLeft + (i * spacing);
            doc.line(x, topOfHeader, x, drawTop);
        }

        // 2️⃣ Extend LEFT and RIGHT grid bounds to the top
        doc.line(drawLeft, topOfHeader, drawLeft, drawBottom);
        doc.line(drawRight, topOfHeader, drawRight, drawBottom);
    }

    return doc;
}

function generateEngineeringPDF() {
    const fileName = document.getElementById("paperName").value;
    const doc = buildEngineeringPDF();
    doc.save(fileName + ".pdf");
}

function previewEngineeringPDF() {
    const doc = buildEngineeringPDF();
    doc.output("dataurlnewwindow");
}
=======
function buildPDF() {

    const { jsPDF } = window.jspdf;

    const paperSize = document.getElementById("paperSize").value;
    const fileName = document.getElementById("paperName").value;

    let width, height;

    if (paperSize === "letter") {
        width = 216;
        height = 279;
    } else {
        width = 210;
        height = 297;
    }

    const doc = new jsPDF({
        unit: "mm",
        format: [width, height]
    });

    const pageColor = document.getElementById("pageColor").value;

    const m = parseFloat(document.getElementById("marg").value);

    const drawLeft = m;
    const drawRight = width - m;
    const drawTop = m;
    const drawBottom = height - m;

    const spacing = parseFloat(document.getElementById("spacing").value);
    const minorThickness = parseFloat(document.getElementById("minorThickness").value);
    const majorThickness = parseFloat(document.getElementById("majorThickness").value);
    const majorEvery = parseInt(document.getElementById("majorEvery").value);

    const minorColor = document.getElementById("minorColor").value;
    const majorColor = document.getElementById("majorColor").value;

    function hexToRGB(hex) {
        return [
            parseInt(hex.substring(1,3),16),
            parseInt(hex.substring(3,5),16),
            parseInt(hex.substring(5,7),16)
        ];
    }

    // page color
    doc.setFillColor(...hexToRGB(pageColor));
    doc.rect(0, 0, width, height, "F");

    let countX = 0;
    for (let x = drawLeft; x <= drawRight; x += spacing) {

        if (countX % majorEvery === 0) {
            doc.setLineWidth(majorThickness);
            doc.setDrawColor(...hexToRGB(majorColor));
        } else {
            doc.setLineWidth(minorThickness);
            doc.setDrawColor(...hexToRGB(minorColor));
        }

        doc.line(x, drawTop, x, drawBottom);
        countX++;
    }

    let countY = 0;
    for (let y = drawTop; y <= drawBottom; y += spacing) {

        if (countY % majorEvery === 0) {
            doc.setLineWidth(majorThickness);
            doc.setDrawColor(...hexToRGB(majorColor));
        } else {
            doc.setLineWidth(minorThickness);
            doc.setDrawColor(...hexToRGB(minorColor));
        }

        doc.line(drawLeft, y, drawRight, y);
        countY++;
    }

    return doc;
}

function generatePDF() {
    const fileName = document.getElementById("paperName").value;
    const doc = buildPDF();
    doc.save(fileName + ".pdf");
}

function previewPDF() {
    const doc = buildPDF();

    // opens at bottom
    //const blob = doc.output("blob");
    //const url = URL.createObjectURL(blob);
    //document.getElementById("pdfPreview").src = url;

    // opens in new tab
    doc.output("dataurlnewwindow");
}

function createColorPicker(displayId, panelId, inputId) {

    const colors = [
        "#000000","#444444","#666666","#999999","#cccccc","#ffffff",
        "#ff0000","#ff9900","#ffff00","#00ff00","#00ffff","#0000ff",
        "#9900ff","#ff00ff","#f4cccc","#fce5cd","#fff2cc","#d9ead3",
        "#cfe2f3","#ead1dc", "#dddddd", "#aaaaaa"
    ];

    const display = document.getElementById(displayId);
    const panel = document.getElementById(panelId);
    const input = document.getElementById(inputId);

    panel.style.display = "grid";

    colors.forEach(color => {
        const swatch = document.createElement("div");
        swatch.style.background = color;

        swatch.onclick = () => {
            display.style.background = color;
            input.value = color;
            panel.style.display = "none";
        };

        panel.appendChild(swatch);
    });

    display.onclick = () => {
        panel.style.display =
            panel.style.display === "grid" ? "none" : "grid";
    };
}

createColorPicker("minorDisplay","minorPanel","minorColor");


function buildEngineeringPDF() {

    const { jsPDF } = window.jspdf;

    const paperSize = document.getElementById("paperSize").value;
    const fileName = document.getElementById("paperName").value;

    let width, height;

    if (paperSize === "letter") {
        width = 216;
        height = 279;
    } else {
        width = 210;
        height = 297;
    }

    const doc = new jsPDF({
        unit: "mm",
        format: [width, height]
    });

    const pageColor = document.getElementById("pageColor").value;
    const m = parseFloat(document.getElementById("marg").value);

    const drawLeft = m;
    const drawRight = width - m;
    const drawTop = m;
    const drawBottom = height - m;

    const spacing = parseFloat(document.getElementById("spacing").value);

    // Engineering paper uses ONE thickness and ONE color
    const lineThickness = parseFloat(
        document.getElementById("lineThickness")?.value || 0.2
    );

    const lineColor = 
        document.getElementById("lineColor")?.value || "#b6d7a8";


    function hexToRGB(hex) {
        return [
            parseInt(hex.substring(1,3),16),
            parseInt(hex.substring(3,5),16),
            parseInt(hex.substring(5,7),16)
        ];
    }

    // Fill page
    doc.setFillColor(...hexToRGB(pageColor));
    doc.rect(0, 0, width, height, "F");

    // Set uniform line style
    doc.setLineWidth(lineThickness);
    doc.setDrawColor(...hexToRGB(lineColor));

    // Vertical lines
    for (let x = drawLeft; x <= drawRight; x += spacing) {
        doc.line(x, drawTop, x, drawBottom);
    }

    // Horizontal lines
    for (let y = drawTop; y <= drawBottom; y += spacing) {
        doc.line(drawLeft, y, drawRight, y);
    }

    // ----- ENGINEERING BORDER -----
    const borderThickness = parseFloat(
        document.getElementById("borderThickness")?.value || 0.8
    );

    const borderColor =
        document.getElementById("borderColor")?.value || "#000000";

    doc.setLineWidth(borderThickness);
    doc.setDrawColor(...hexToRGB(borderColor));

    // Draw border rectangle at margin
    doc.rect(drawLeft, drawTop,
             drawRight - drawLeft,
             drawBottom - drawTop);

    // ----- TOPS STYLE HEADER -----

    const topsEnabled = document.getElementById("topsStyle")?.checked;

    if (topsEnabled) {

        const headerHeight = spacing * 3; // height of heading area
        const topOfHeader = drawTop - headerHeight;

        doc.setLineWidth(lineThickness);
        doc.setDrawColor(...hexToRGB(lineColor));

        // 1️⃣ Draw 5 vertical header lines
        for (let i = 0; i < 5; i++) {
            let x = drawLeft + (i * spacing);
            doc.line(x, topOfHeader, x, drawTop);
        }

        // 2️⃣ Extend LEFT and RIGHT grid bounds to the top
        doc.line(drawLeft, topOfHeader, drawLeft, drawBottom);
        doc.line(drawRight, topOfHeader, drawRight, drawBottom);
    }

    return doc;
}

function generateEngineeringPDF() {
    const fileName = document.getElementById("paperName").value;
    const doc = buildEngineeringPDF();
    doc.save(fileName + ".pdf");
}

function previewEngineeringPDF() {
    const doc = buildEngineeringPDF();
    doc.output("dataurlnewwindow");
}
>>>>>>> cda7a25b07f93f06c98c558c17b1e7b3de17142b

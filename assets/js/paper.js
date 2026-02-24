function hexToRGB(hex) {
    return [parseInt(hex.substring(1,3),16), parseInt(hex.substring(3,5),16), parseInt(hex.substring(5,7),16)];
}

function createBasePDF() {
    const { jsPDF } = window.jspdf;

    const paperSize = document.getElementById("paperSize").value;
    const pageColor = document.getElementById("pageColor").value;
    let width, height;

    if (paperSize === "letter") {
        width = 215.9;
        height = 279.4;
    } else {
        width = 210;
        height = 297;
    }

    const doc = new jsPDF({
        unit: "mm",
        format: [width, height]
    });

    doc.pageWidth = width;
    doc.pageHeight = height;

    // Fill background
    doc.setFillColor(...hexToRGB(pageColor));
    doc.rect(0, 0, width, height, "F");

    return doc;
}

function renderGrid(doc) {
    // Margins
    let mT = parseFloat(document.getElementById("margT").value);
    let mB = parseFloat(document.getElementById("margB").value);
    let mL = parseFloat(document.getElementById("margL").value);
    let mR = parseFloat(document.getElementById("margR").value);

    const width = doc.pageWidth;
    const height = doc.pageHeight;

    const drawLeft = mL;
    const drawRight = width - mR;
    const drawTop = mT;
    const drawBottom = height - mB;

    const spacing = parseFloat(document.getElementById("spacing").value);
    const minorThickness = parseFloat(document.getElementById("minorThickness").value);
    const majorThickness = parseFloat(document.getElementById("majorThickness").value);
    const majorEvery = parseInt(document.getElementById("majorEvery").value);

    const minorColor = document.getElementById("minorColor").value;
    const majorColor = document.getElementById("majorColor").value;

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

}

function renderEngineering(doc) {
    let mT = parseFloat(document.getElementById("margT").value);
    let mB = parseFloat(document.getElementById("margB").value);
    let mL = parseFloat(document.getElementById("margL").value);
    let mR = parseFloat(document.getElementById("margR").value);

    const width = doc.pageWidth;
    const height = doc.pageHeight;
    const unitT = document.getElementById("unitToggle").value;

    if (unitT === "in") {
        // margins
        mT = mT* 25.4;
        mB = mB* 25.4;
        mL = mL* 25.4;
        mR = mR* 25.4;
    }

    const drawLeft = mL; const drawRight = width - mR; 
    const drawTop = mT; const drawBottom = height - mB;
    
    const spacing = parseFloat(document.getElementById("spacing").value);
    const usableWidth = width - (mL+mR); 
    const eng_grd_dx = usableWidth/3;

    // Line Thickness
    const lineThickness = parseFloat(document.getElementById("lineThickness")?.value || 0.2);
    const minorThickness = parseFloat(document.getElementById("minorThickness").value);
    const majorThickness = parseFloat(document.getElementById("majorThickness").value);
    const majorEvery = parseInt(document.getElementById("majorEvery").value);

    const lineColor = document.getElementById("lineColor")?.value || "#b6d7a8";

    doc.setDrawColor(...hexToRGB(lineColor));

    // Veritcal Lines
    let countX = 0;
    for (let x = drawLeft; x <= drawRight; x += spacing) {
        if (countX % majorEvery === 0) {doc.setLineWidth(majorThickness);}
        else {doc.setLineWidth(minorThickness);}
        doc.line(x, drawTop, x, drawBottom);
        countX++;
    }

    // Horizontal
    let countY = 0;
    for (let y = drawTop; y <= drawBottom; y += spacing) {
        if (countY % majorEvery === 0) {doc.setLineWidth(majorThickness);}
        else {doc.setLineWidth(minorThickness);}
        doc.line(drawLeft, y, drawRight, y);
        countY++;
    }

    // ----- ENGINEERING BORDER -----
    const borderThickness = parseFloat(
        document.getElementById("borderThickness")?.value || 0.8
    );

    const borderColor = document.getElementById("borderColor")?.value || "#b6d7a8";
    doc.setLineWidth(borderThickness);
    doc.setDrawColor(...hexToRGB(borderColor));

    // Draw border rectangle at margin
    doc.rect(drawLeft, drawTop, drawRight - drawLeft, drawBottom - drawTop);

    // ----- TOPS STYLE HEADER -----
    const topsEnabled = document.getElementById("topsStyle")?.checked;
    if (topsEnabled) {

        doc.setLineWidth(borderThickness);
        doc.setDrawColor(...hexToRGB(borderColor));

        // Draw  vertical header lines
        doc.line(mL+eng_grd_dx, 0, mL+eng_grd_dx, drawTop);
        doc.line(mL+2*eng_grd_dx, 0, mL+2*eng_grd_dx, drawTop);
        doc.line(mL+3*eng_grd_dx, 0, mL+3*eng_grd_dx, drawTop);

        // Extend LEFT and RIGHT grid bounds to the top
        doc.line(mL, 0, mL, height);
        doc.line(width - mR, 0, width - mR, height);
        doc.line(0, mT, width, mT);
    }
}

function renderIsometric(doc, config) {

    let mT = parseFloat(document.getElementById("margT").value);
    let mB = parseFloat(document.getElementById("margB").value);
    let mL = parseFloat(document.getElementById("margL").value);
    let mR = parseFloat(document.getElementById("margR").value);

    const width = doc.pageWidth;
    const height = doc.pageHeight;

    const drawLeft = mL; const drawRight = width - mR; 
    const drawTop = mT; const drawBottom = height - mB;

    const spacing = parseFloat(document.getElementById("spacing").value);
    const lineThickness = parseFloat(document.getElementById("minorThickness").value);
    const lineColor = document.getElementById("minorColor").value;

    doc.setLineWidth(lineThickness);
    doc.setDrawColor(...hexToRGB(lineColor));
    
    const spacingV = spacing * Math.sqrt(3)/2; // vertical lines are farther apart
    let usableWidth = width - (mL+mR);
    const tanValue = Math.tan(30 * Math.PI / 180);
    let dy = usableWidth*tanValue;

    // Draw vertical lines
    for (let x = drawLeft; x <= drawRight; x += spacingV) {
        doc.line(x, drawTop, x, drawBottom);
    }

    // + 30 
    for (let y = drawTop - usableWidth; y <= drawBottom + usableWidth; y += spacing) {
        // Line runs from (drawLeft, y) to (drawLeft + usableWidth, y + dy)
        let x1 = drawLeft, y1 = y;
        let x2 = x1 + usableWidth;
        let y2 = y1 - dy;

        const clipped = clipLineToRect(x1, y1, x2, y2, drawLeft, drawTop, drawRight, drawBottom);
        if (clipped) {
            doc.line(clipped[0], clipped[1], clipped[2], clipped[3]);
        }

        let y3 = y + dy;
        const clipped_m30 = clipLineToRect(x1, y1, x2, y3, drawLeft, drawTop, drawRight, drawBottom);
        if (clipped_m30) {doc.line(clipped_m30[0], clipped_m30[1], clipped_m30[2], clipped_m30[3]);}
    }

    // rectangle border
    doc.rect(drawLeft, drawTop, drawRight - drawLeft, drawBottom - drawTop);
}

function renderDot(doc) {
    let mT = parseFloat(document.getElementById("margT").value);
    let mB = parseFloat(document.getElementById("margB").value);
    let mL = parseFloat(document.getElementById("margL").value);
    let mR = parseFloat(document.getElementById("margR").value);

    const width = doc.pageWidth;
    const height = doc.pageHeight;

    const drawLeft = mL; const drawRight = width - mR; 
    const drawTop = mT; const drawBottom = height - mB;

    const spacing = parseFloat(document.getElementById("spacing").value);
    const dotSize = parseFloat(document.getElementById("minorThickness").value);
    const dotColor = document.getElementById("minorColor").value;

    doc.setLineWidth(dotSize);
    //doc.setDrawColor(...hexToRGB(dotColor));
    
    // Loop through y positions
    for (let y = drawTop; y <= drawBottom; y += spacing) {
        // Loop through x positions
        for (let x = drawLeft; x <= drawRight; x += spacing) {
            doc.setFillColor(...hexToRGB(dotColor));
            doc.circle(x, y, dotSize / 2, 'F'); // 'F' means fill the circle
        }
    }
}

function renderLined(doc) {
    let mT = parseFloat(document.getElementById("margT").value);
    let mB = parseFloat(document.getElementById("margB").value);
    let mL = parseFloat(document.getElementById("margL").value);
    let mR = parseFloat(document.getElementById("margR").value);

    const width = doc.pageWidth;
    const height = doc.pageHeight;

    const drawLeft = mL; const drawRight = width - mR; 
    const drawTop = mT; const drawBottom = height - mB;
    
    let spacing = 10; 
    const lineThickness = parseFloat(document.getElementById("lineThickness").value);
    const lineColor = document.getElementById("lineColor").value;

    if (spacing === 'college') {
        spacing = 7;
    } else if (spacing === 'wide') {
        spacing = 8;
    } else {
        spacing = parseFloat(document.getElementById("cust_spacing").value);
    }



    doc.setLineWidth(lineThickness);
    doc.setDrawColor(...hexToRGB(lineColor));
    
    for (let y = drawTop; y <= drawBottom; y += spacing) {
        doc.line(drawLeft, y, drawRight, y);
    }

    const VRLEnabled = document.getElementById("VRL")?.checked;
    if (VRLEnabled) {
        const ruleX = drawLeft + 25;
        doc.setLineWidth(0.6); // Typical thickness for rule line
        doc.setDrawColor(255, 0, 0); // Pure red
        doc.line(ruleX, drawTop, ruleX, drawBottom);
    }
}

function buildPDF(type) {
    const doc = createBasePDF();

    const renderers = {
        engineering: renderEngineering,
        grid: renderGrid,
        isometric: renderIsometric,
        dot: renderDot,
        lined: renderLined
    };

    const renderer = renderers[type];
    if (renderer) renderer(doc);
    return doc;
}

function generatePDF(type) {
    const fileName = document.getElementById("paperName").value;
    const doc = buildPDF(type);
    doc.save(fileName + ".pdf");
}

function previewPDF(type) {
    const doc = buildPDF(type);
    doc.output("dataurlnewwindow");
}

// Clip a segment to a rectangle: returns null or [x1, y1, x2, y2] for the visible segment.
function clipLineToRect(x1, y1, x2, y2, left, top, right, bottom) {
    let dx = x2 - x1, dy = y2 - y1;
    let t0 = 0, t1 = 1;

    const checks = [
        {p: -dx, q: x1 - left},
        {p:  dx, q: right - x1},
        {p: -dy, q: y1 - top},
        {p:  dy, q: bottom - y1},
    ];

    for (let i = 0; i < checks.length; i++) {
        const {p, q} = checks[i];
        if (p === 0) {
            if (q < 0) return null; // Line parallel and outside
        } else {
            const r = q / p;
            if (p < 0) {
                if (r > t1) return null;
                else if (r > t0) t0 = r;
            } else {
                if (r < t0) return null;
                else if (r < t1) t1 = r;
            }
        }
    }

    // Calculate clipped points
    let nx1 = x1 + t0 * dx;
    let ny1 = y1 + t0 * dy;
    let nx2 = x1 + t1 * dx;
    let ny2 = y1 + t1 * dy;
    return [nx1, ny1, nx2, ny2];
}
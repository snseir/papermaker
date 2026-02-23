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

    const mTB = parseFloat(document.getElementById("margTB").value);
    const mLR = parseFloat(document.getElementById("margLR").value);

    const drawLeft = mLR;
    const drawRight = width - mLR;
    const drawTop = mTB;
    const drawBottom = height - mTB;

    const spacing = parseFloat(document.getElementById("spacing").value);
    const minorThickness = parseFloat(document.getElementById("minorThickness").value);
    const majorThickness = parseFloat(document.getElementById("majorThickness").value);
    const majorEvery = parseInt(document.getElementById("majorEvery").value);

    const minorColor = document.getElementById("minorColor").value;
    const majorColor = document.getElementById("majorColor").value;

    
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

function buildEngineeringPDF() {
    const { jsPDF } = window.jspdf;

    const paperSize = document.getElementById("paperSize").value;
    const fileName = document.getElementById("paperName").value;
    const unitT = document.getElementById("unitToggle").value;

    let width, height;

    if (paperSize === "letter") {
        width = 216;
        height = 279;
    } else if (paperSize === "custom") {

    }
    else {
        width = 210;
        height = 297;
    }

    const doc = new jsPDF({
        unit: "mm",
        format: [width, height]
    });

    const pageColor = document.getElementById("pageColor").value;

    let mT = parseFloat(document.getElementById("margT").value);
    let mB = parseFloat(document.getElementById("margB").value);
    let mL = parseFloat(document.getElementById("margL").value);
    let mR = parseFloat(document.getElementById("margR").value);

    //let mT, mB, mL, mR;


    if (unitT === "in") {
        // margins
        mT = mT* 25.4;
        mB = mB* 25.4;
        mL = mL* 25.4;
        mR = mR* 25.4;
    }

    const drawLeft = mL;
    const drawRight = width - mR;
    const drawTop = mT;
    const drawBottom = height - mB;

    const spacing = parseFloat(document.getElementById("spacing").value);
    const usableWidth = width - (mL+mR); 
    const eng_grd_dx = usableWidth/3;

    // Line Thickness
    const lineThickness = parseFloat(document.getElementById("lineThickness")?.value || 0.2);
    const minorThickness = parseFloat(document.getElementById("minorThickness").value);
    const majorThickness = parseFloat(document.getElementById("majorThickness").value);
    const majorEvery = parseInt(document.getElementById("majorEvery").value);

    const lineColor = document.getElementById("lineColor")?.value || "#b6d7a8";


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

    // line color
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

    const borderColor =
        document.getElementById("borderColor")?.value || "#b6d7a8";

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

    return doc;
}

/*

function buildIsometricPDF() {}
function buildLinedPDF() {}

function generatePDF(type) {
    const fileName = document.getElementById("paperName").value;
    //const builder = builders[type] || builders.default;
    // const doc = builder();
    
    if (type = "engineering") {
        const doc = buildEngineeringPDF();
        doc.save(fileName + ".pdf");
    } 
    else if (type = "isometric") {
        buildIsometricPDF();
        doc.save(fileName + ".pdf");
    }
    else if (type = "lined") {
        buildLinedPDF();
        doc.save(fileName + ".pdf");
    }
    else {
        buildPDF();
    doc.save(fileName + ".pdf");
}
}


function previewPDF(type) {
    //const builder = builders[type] || builders.default;
    //const doc = builder();
    
    if (type = "engineering") {
        const doc = buildEngineeringPDF();
        doc.output("dataurlnewwindow");
    } 
    else if (type = "isometric") {
        buildIsometricPDF();
        doc.output("dataurlnewwindow");
    }
    else if (type = "lined") {
        buildLinedPDF();
        doc.output("dataurlnewwindow");
    }
    else {
        buildPDF();
        doc.output("dataurlnewwindow");
    }
}


*/
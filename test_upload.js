import fs from 'fs';

// Create dummy files if not exist
const createDummyFile = (name, content) => {
    if (!fs.existsSync(name)) {
        fs.writeFileSync(name, content);
    }
};

createDummyFile('dummy.glb', 'binary glb content');
createDummyFile('white.svg', '<svg>white</svg>');
createDummyFile('original.svg', '<svg>original</svg>');

async function testUpload() {
    try {
        const formData = new FormData();
        formData.append('product_details[name]', 'Test Product ' + Date.now());
        formData.append('product_details[subcategory]', '1');

        const glbBuffer = fs.readFileSync('dummy.glb');
        const whiteBuffer = fs.readFileSync('white.svg');
        const originalBuffer = fs.readFileSync('original.svg');

        const glbFile = new File([glbBuffer], 'dummy.glb', { type: 'application/octet-stream' });
        const whiteFile = new File([whiteBuffer], 'white.svg', { type: 'image/svg+xml' });
        const originalFile = new File([originalBuffer], 'original.svg', { type: 'image/svg+xml' });

        formData.append('product_details[glb]', glbFile);
        formData.append('svgdetails[0][mesh_name]', 'front');
        formData.append('svgdetails[0][white]', whiteFile);
        formData.append('svgdetails[0][original]', originalFile);

        const response = await fetch('http://localhost:5000/product/create', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        console.log("Response:", result);

    } catch (e) {
        console.error("Error:", e);
    }
}

testUpload();

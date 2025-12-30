const testSaveDesign = async () => {
    const productId = "043b8d74-f6e4-4694-9ad0-de7176f9cdff"; // Using ID from user's request
    const designData = {
        meshColors: {
            "front_body": "#ff0000"
        },
        meshStickers: {
            "front_body": [
                {
                    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
                    "position": { "x": 100, "y": 100 },
                    "scale": 1,
                    "rotation": 0
                }
            ]
        },
        materialSettings: {
            "roughness": 0.75,
            "metalness": 0,
            "sheen": 0.6,
            "sheenRoughness": 0.7,
            "fabricStrength": 0.5,
            "fabricType": "plain",
            "fabricScale": 8
        }
    };

    try {
        console.log("Sending save-design request...");
        const response = await fetch('http://localhost:5000/product/save-design', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId,
                designData,
                designName: "Test S3 Design"
            })
        });

        const data = await response.json();
        console.log("Response:", JSON.stringify(data, null, 2));

        if (data.success) {
            const savedUrl = data.data.designData.meshStickers.front_body[0].url;
            console.log("\nSUCCESS!");
            console.log("Saved Sticker URL:", savedUrl);
            if (savedUrl.startsWith('http')) {
                console.log("Verified: URL is an S3 URL (starts with http)");
            } else {
                console.log("ERROR: URL is not an S3 URL");
            }
        } else {
            console.error("Save failed:", data.message);
        }
    } catch (error) {
        console.error("Error during test:", error.message);
    }
};

testSaveDesign();


// Function to scroll the page automatically to ensure all images are loaded
async function autoScrollToBottom() {
    return new Promise((resolve) => {
        const distance = 500; // Scroll by 500px
        const delay = 300; // Delay in ms
        const interval = setInterval(() => {
            window.scrollBy(0, distance);
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                clearInterval(interval);
                resolve();
            }
        }, delay);
    });
}

// Function to download an image
async function downloadImage(url, index) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `image_${index + 1}.jpg`;
        link.click();
        URL.revokeObjectURL(link.href); // Clean up
        console.log(`Downloaded: ${url}`);
    } catch (error) {
        console.error(`Failed to download ${url}:`, error);
    }
}

// Function to extract all image URLs from the current page
function extractImageUrls() {
    const imageElements = document.querySelectorAll('div.image_layer img.absimg');
    const imageUrls = Array.from(imageElements).map(img => img.src);
    return [...new Set(imageUrls)]; // Remove duplicates
}

// Function to handle pagination (if applicable)
async function handlePagination(totalPages) {
    const allImageUrls = [];
    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        console.log(`Loading page ${currentPage}...`);

        // Simulate clicking a "next page" button
        const nextPageButton = document.querySelector('.next-page-button'); // Replace with actual selector
        if (nextPageButton) {
            nextPageButton.click();
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for the page to load
        }

        // Extract image URLs from the current page
        const imageUrls = extractImageUrls();
        imageUrls.forEach(url => {
            if (!allImageUrls.includes(url)) allImageUrls.push(url);
        });
    }
    return allImageUrls;
}

// Main function to download all images
async function downloadAllImages() {
    console.log('Starting image download process...');

    // Step 1: Scroll to the bottom to load all images (for lazy loading)
    console.log('Scrolling to the bottom of the page to load all images...');
    await autoScrollToBottom();

    // Step 2: Extract image URLs from the current page
    let imageUrls = extractImageUrls();
    console.log(`Found ${imageUrls.length} images on the first page.`);

    // Step 3: Handle pagination if needed (set totalPages based on site structure)
    const totalPages = 1; // Replace with the actual number of pages if known
    if (totalPages > 1) {
        const paginatedUrls = await handlePagination(totalPages);
        imageUrls = [...new Set([...imageUrls, ...paginatedUrls])];
        console.log(`Found a total of ${imageUrls.length} images after pagination.`);
    }

    // Step 4: Download images with a delay to avoid server restrictions
    console.log('Downloading images...');
    for (let i = 0; i < imageUrls.length; i++) {
        await downloadImage(imageUrls[i], i);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    }

    console.log('All images have been downloaded.');
}

// Run the main function
downloadAllImages();


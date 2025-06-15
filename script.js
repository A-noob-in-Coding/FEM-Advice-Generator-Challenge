let advice_id_span = document.getElementById("advice-id");
let isLoading = false;

// Hadith API configuration
const allowedEditions = [
    'eng-bukhari',
    'eng-muslim',
    'eng-nasai',
    'eng-abudawud',
    'eng-tirmidhi',
    'eng-ibnmajah',
    'eng-malik'
];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

async function fetchMetadata(edition) {
    try {
        const response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${edition}.json`);
        if (!response.ok) throw new Error('Failed to load volume data');
        return await response.json();
    } catch (error) {
        throw new Error('Failed to fetch metadata: ' + error.message);
    }
}

function getSectionsFromMetadata(metadata) {
    if (!metadata || !metadata.metadata || !metadata.metadata.sections) {
        throw new Error('No valid sections found');
    }
    return Object.entries(metadata.metadata.sections).map(([number, title]) => ({ number, title }));
}

async function fetchSectionData(edition, sectionNumber) {
    try {
        const response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${edition}/sections/${sectionNumber}.json`);
        if (!response.ok) throw new Error('Failed to load section data');
        return await response.json();
    } catch (error) {
        throw new Error('Failed to fetch section data: ' + error.message);
    }
}

async function fetchRandomAdvice() {
    // Prevent multiple clicks
    if (isLoading) return;

    const button = document.getElementById("generate-advice");

    isLoading = true;
    button.disabled = true;
    button.style.opacity = '0.5';
    button.style.cursor = 'not-allowed';

    button.classList.remove("button-animate");
    setTimeout(() => {
        button.classList.add("button-animate");
    }, 10);

    try {
        const edition = getRandomElement(allowedEditions);
        const metadata = await fetchMetadata(edition);
        console.log('Metadata response:', metadata);

        const sections = getSectionsFromMetadata(metadata);
        if (sections.length === 0) throw new Error('No sections found');

        const randomSection = getRandomElement(sections);
        const sectionData = await fetchSectionData(edition, randomSection.number);
        console.log('Section data response:', sectionData);

        const hadiths = sectionData.hadiths || [];
        if (hadiths.length === 0) throw new Error('No Hadiths found in the section');

        const randomHadith = getRandomElement(hadiths);
        console.log('Random hadith response:', randomHadith);

        const hadithText = randomHadith.text || 'Hadith text not available';
        const adviceElement = document.getElementById("advice");

        advice_id_span.innerText = randomHadith.hadithnumber || randomSection.number;

        adviceElement.innerText = hadithText;

    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        console.log('Full error response:', error);

        const adviceElement = document.getElementById("advice");
        adviceElement.innerText = "Failed to load hadith. Please try again.";
        advice_id_span.innerText = "Error";
    } finally {
        // Re-enable button
        isLoading = false;
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
    }
}

// Call the function to fetch and display hadith
fetchRandomAdvice();

document.getElementById("generate-advice").addEventListener("click", fetchRandomAdvice);
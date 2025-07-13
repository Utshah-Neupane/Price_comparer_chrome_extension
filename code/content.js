document.addEventListener("DOMContentLoaded", () => {
    let scrapePrice = document.getElementById('scrapePrice');
    let price_value = document.getElementById("price_value");

    chrome.runtime.onMessage.addListener((request) => {
        let price = request.price;
        // alert(price);

        let h1 = document.createElement('h1');
        h1.innerText =  `Price: ${price}` ;
        price_value.appendChild(h1);

    });

    scrapePrice.addEventListener("click", async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: scrapePriceFromPage,
        });
    });

    function scrapePriceFromPage() {
    let priceElem = document.querySelector(".kds-Price-promotional");

    if (priceElem) {
        // Clean up whitespace and line breaks
        let rawText = priceElem.textContent;
        let cleanPrice = rawText.replace(/\s+/g, '');  // e.g., "$1\n.\n7\n9" → "$1.79"

        chrome.runtime.sendMessage({ price: cleanPrice });
    } else {
        chrome.runtime.sendMessage({ price: "Price not found" });
    }
}


});

import axios from "axios";
import cheerio from "cheerio";

async function getExpressLombard() {
  const url = "https://expresslombard.ge/ka/valutis-kursebi";

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const rates = {};

    $("h3").each((i, el) => {
      const currencyTitle = $(el).text().trim();

      if (currencyTitle.includes("დოლარი")) {
        const box = $(el).parent();

        const official = box.find("h4").eq(0).text().trim();
        const buy = box.find("h4").eq(1).text().trim();
        const sell = box.find("h4").eq(2).text().trim();

        rates["USD"] = {
          official,
          buy,
          sell
        };
      }
    });

    return rates;
  } catch (err) {
    console.error("EXPRESS ERROR:", err.message);
    return null;
  }
}

// ==== RUN ====
(async () => {
  const express = await getExpressLombard();
  console.log("EXPRESS LOMBARD:", express);
})();

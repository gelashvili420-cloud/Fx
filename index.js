import express from "express";
import axios from "axios";
import cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 3000;

async function getExpressLombard() {
  const url = "https://expresslombard.ge/ka/valutis-kursebi";

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

      rates["USD"] = { official, buy, sell };
    }
  });

  return rates;
}

app.get("/", async (req, res) => {
  const express = await getExpressLombard();
  res.json({ express });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

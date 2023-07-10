import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://webpage-scraper-backend-django.vercel.app/tableview/"
const CORS_PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

export async function fetchTableData() {
  const res = await axios.get(BASE_URL);
  return res.data;
}

export async function addDataToTable(urlData) {
  const res = await axios.post(BASE_URL, {
    url: urlData.url,
    word_count: urlData.word_count,
    favourite: urlData.favourite,
    web_links: urlData.web_links,
    media_links: urlData.media_links,
  });
  return res.data;
}

export async function editRowInTable(id, urlData) {
  const res = await axios.put(BASE_URL + id + "/", {
    url: urlData.url,
    word_count: urlData.word_count,
    favourite: urlData.favourite,
    web_links: urlData.web_links,
    media_links: urlData.media_links,
  });
  return res.data;
}

export async function deleteRowInTable(id) {
  const res = await axios.delete(BASE_URL + id + "/");
  return res.data;
}

export async function getWebsiteInfo(url) {
  try {
    const response = await axios.get(CORS_PROXY_URL + url);
    const html = response.data;

    const $ = cheerio.load(html);
    const text = $("body").text();
    const wordCount = text.trim().split(/\s+/).length;

    const webLinks = new Set();
    const mediaLinks = new Set();

    $("a").each((index, element) => {
      const link = $(element).attr("href");
      webLinks.add(link);
    });

    $("img, video").each((index, element) => {
      const link = $(element).attr("src");
      mediaLinks.add(link);
    });

    return {
      word_count: wordCount,
      web_links: Array.from(webLinks),
      media_links: Array.from(mediaLinks),
    };
  } catch (error) {
    console.error("Error in fetching site's data:", error);
  }
}

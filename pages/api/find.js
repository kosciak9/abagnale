import { readFileSync } from "fs";
import { join } from "path";
import { some, toPairs, every, filter } from "lodash";

export default async (req, res) => {
  const filters = req.body;
  console.log(filters);

  const entitiesPath = join(".", "entities.json");
  const webPath = join(".", "web.json");

  const web = JSON.parse(readFileSync(webPath).toString());
  const languageFilteredWeb = filters.polishOnly
    ? web.filter((website) => website.lang === "pl")
    : web;
  console.log(
    `language filter reduced websites count from ${web.length} to ${languageFilteredWeb.length}.`
  );

  const keywordFilteredWeb = languageFilteredWeb.filter((website) => {
    return every(filters.groups, (group) => {
      return some(group, (keyword) => {
        return website.text.toLowerCase().includes(keyword.toLowerCase());
      });
    });
  });
  console.log(
    `keyword filter reduced websites count from ${languageFilteredWeb.length} to ${keywordFilteredWeb.length}.`
  );
  const filteredUrls = keywordFilteredWeb.map((website) => website.url);

  const entities = toPairs(
    JSON.parse(readFileSync(entitiesPath).toString())
  ).map(([title, entity]) => ({ ...entity, title }));
  const filteredEntities = entities.filter((entity) =>
    some(entity.source_urls, (url) => filteredUrls.includes(url))
  );
  console.log(
    `filters has reduced number of entities from ${entities.length} to ${filteredEntities.length}`
  );

  res.statusCode = 200;
  res.json({ results: keywordFilteredWeb, graph: filteredEntities });
};

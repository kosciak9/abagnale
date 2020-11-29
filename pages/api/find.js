import { readFileSync } from "fs";
import { join } from "path";
import { some, toPairs, every, filter } from "lodash";

const entitiesFile = require("./entities");
const webFile = require("./web");

export default async (req, res) => {
  const filters = req.body;
  console.log(filters);

  const webPath = join("pages", "api", "web.json");

  const web = webFile; // JSON.parse(readFileSync(webPath).toString());
  const languageFilteredWeb = filters.polishOnly
    ? web.filter((website) => website.lang === "pl")
    : web;
  console.log(
    `language filter reduced website count from ${web.length} to ${languageFilteredWeb.length}.`
  );

  const keywordFilteredWeb = languageFilteredWeb.filter((website) => {
    return every(filters.groups, (group) => {
      return some(group, (keyword) => {
        return website.text.toLowerCase().includes(keyword.toLowerCase());
      });
    });
  });
  console.log(
    `keyword filter reduced website count from ${languageFilteredWeb.length} to ${keywordFilteredWeb.length}.`
  );
  const filteredUrls = keywordFilteredWeb.map((website) => website.url);

  const entitiesPath = join("pages", "api", "entities.json");
  const entities = toPairs(
    entitiesFile
    // JSON.parse(readFileSync(entitiesPath).toString())
  ).map(([title, entity]) => ({ ...entity, title }));
  const filteredEntities = entities.map(
    (entity) => ({
      ...entity,
      frequency_in_search: entity.source_urls.reduce((result, url) => result + filteredUrls.includes(url) ? 1 : 0, 0)
    })
  ).filter((entity) =>
    (entity.frequency_in_search > 0)
  ).map(
    (entity) => ({
      ...entity,
      relative_frequency: entity.frequency_in_search / entity.frequency
    })
  );
  console.log(
    `filters reduced number of entities from ${entities.length} to ${filteredEntities.length}`
  );

  res.statusCode = 200;
  res.json({ results: keywordFilteredWeb.slice(0, 200), graph: filteredEntities.slice(0, 200) });
};

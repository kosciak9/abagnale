// import * as faker from "faker";
import { readFileSync } from "fs";
import { join } from "path";

import parse from "csv-parse/lib/sync";

module.exports = (req, res) => {
  const input = readFileSync(join(__dirname, "scraper", "outputs", "iosco.csv")).toString();

  const results = parse(input, {
    columns: true,
    skip_empty_lines: true,
  });

  res.statusCode = 200;
  res.json({ results });
};

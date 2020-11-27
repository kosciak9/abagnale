// import * as faker from "faker";
import { readFileSync } from "fs";
import { join } from "path";

import parse from "csv-parse/lib/sync";

export default (req, res) => {
  const input = readFileSync(join("scraper", "outputs", "iosco.csv")).toString();

  const results = parse(input, {
    columns: true,
    skip_empty_lines: true,
  });

  // const results = [];
  // for (let i = 0; i < 300; i++) {
  //   results.push({
  //     id: faker.random.uuid(),
  //     name: faker.name.firstName() + " " + faker.name.lastName(),
  //     email: faker.internet.email(),
  //     phoneNo: faker.phone.phoneNumber(),
  //     address: faker.address.streetAddress(),
  //   });
  // }

  res.statusCode = 200;
  res.json({ results });
};

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as faker from "faker";

export default (req, res) => {
  res.statusCode = 200;
  const results = [];
  for (let i = 0; i < 300; i++) {
    results.push({
      id: faker.random.uuid(),
      name: faker.name.firstName() + " " + faker.name.lastName(),
      email: faker.internet.email(),
      phoneNo: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
    });
  }

  res.json({ results });
};

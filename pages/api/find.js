// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  res.statusCode = 200;
  res.json({
    results: [
      {
        id: "1",
        name: "John Doe",
        phoneNo: "+48423423423",
        address: "ul. Karmelicka 12, 4/95, 30-220",
      },
    ],
  });
};

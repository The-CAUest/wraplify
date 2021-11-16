module.exports = {
  Todo: [
    { name: "id", mandatory: true, type: "ID" },
    { name: "name", mandatory: true, type: "String" },
    { name: "description", mandatory: false, type: "String" },
  ],
  Post: [
    { name: "id", mandatory: true, type: "ID" },
    { name: "name", mandatory: true, type: "String" },
    { name: "description", mandatory: false, type: "String" },
  ],
};

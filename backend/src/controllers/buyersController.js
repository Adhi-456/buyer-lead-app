const fs = require("fs");
const Papa = require("papaparse");

let buyers = [
  { id: 1, name: "Ravi Kumar", city: "Mumbai", budget: 8000000 },
  { id: 2, name: "Aisha Sharma", city: "Delhi", budget: 5000000 }
];

// GET buyers
exports.getBuyers = (req, res) => {
  res.json(buyers);
};

// CREATE buyer
exports.createBuyer = (req, res) => {
  const buyer = { id: buyers.length + 1, ...req.body };
  buyers.push(buyer);
  res.status(201).json(buyer);
};

// EXPORT buyers as CSV
exports.exportBuyers = (req, res) => {
  const csvHeader = "id,name,city,budget\n";
  const csvRows = buyers.map(b => `${b.id},${b.name},${b.city},${b.budget}`).join("\n");
  const csvData = csvHeader + csvRows;

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=buyers.csv");
  res.send(csvData);
};

// IMPORT buyers from CSV
exports.importBuyers = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = fs.readFileSync(req.file.path, "utf8");

  Papa.parse(file, {
    header: true,
    complete: (results) => {
      const imported = results.data.map((row, index) => ({
        id: buyers.length + index + 1,
        name: row.name,
        city: row.city,
        budget: Number(row.budget) || 0
      }));

      buyers = buyers.concat(imported);

      // Delete file after processing
      fs.unlinkSync(req.file.path);

      res.json({ message: "Buyers imported successfully", count: imported.length });
    },
    error: (err) => {
      res.status(500).json({ error: "Failed to parse CSV", details: err.message });
    }
  });
};

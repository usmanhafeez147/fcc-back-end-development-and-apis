import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html");
});

// Do not change code above this line

app.get("/api{/:date}", (req, res) => {
  const { date: input } = req.params;

  let date;
  if (input === undefined) {
    date = new Date();
  } else if (/^-?\d+$/.test(input)) {
    // A string of digits is a Unix timestamp in milliseconds
    date = new Date(Number(input));
  } else {
    // Read dates without a time zone (e.g. "05 October 2011") as UTC rather
    // than the server's local time, then fall back to the default parsing.
    date = new Date(`${input} UTC`);
    if (Number.isNaN(date.getTime())) {
      date = new Date(input);
    }
  }

  if (Number.isNaN(date.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  res.json({ unix: date.getTime(), utc: date.toUTCString() });
});

// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

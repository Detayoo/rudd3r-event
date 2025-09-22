const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

function getTodayAtLocalHour(targetHour24) {
  const now = new Date();
  const d = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    targetHour24,
    0,
    0,
    0
  );
  return d;
}

function getYesterdayAtLocalHour(targetHour24) {
  const todayAtHour = getTodayAtLocalHour(targetHour24);
  const yesterdayAtHour = new Date(todayAtHour.getTime() - 24 * 60 * 60 * 1000);
  return yesterdayAtHour;
}

function getRandomDateBetween(startDate, endDate) {
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  const randomMs = startMs + Math.random() * (endMs - startMs);
  return new Date(randomMs);
}

function formatAsIsoLocal(date) {
  return date.toISOString();
}

// GET /last-login-8am → returns today's 8:00 AM (local) as ISO string
app.get("/last-login-8am", (req, res) => {
  const eightAmToday = getTodayAtLocalHour(8);
  res.json({ lastLoginTime: formatAsIsoLocal(eightAmToday) });
});

// GET /users → returns users with lastLoginTime between 9 PM yesterday and 8 AM today
app.get("/users", (req, res) => {
  const windowStart = getYesterdayAtLocalHour(21); // 9 PM yesterday
  const windowEnd = getTodayAtLocalHour(8); // 8 AM today

  const users = [
    { id: 1, name: "Tayo Adedigba", email: 'teeydigba@gmail.com' },
    { id: 2, name: "Peter Adedigba", email:'peteradetayo21@gmail.com' },
  ].map((user) => ({
    ...user,
    lastLoginTime: formatAsIsoLocal(
      getRandomDateBetween(windowStart, windowEnd)
    ),
  }));

  res.json({
    users,
    windowStart: formatAsIsoLocal(windowStart),
    windowEnd: formatAsIsoLocal(windowEnd),
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

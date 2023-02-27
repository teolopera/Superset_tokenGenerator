const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const PORT = 3001;
const app = express();
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

async function fetchAccessToken() {
  try {
    const body = {
      username: "admin",
      password: "admin",
      provider: "db",
      refresh: true,
    }

    const response = await fetch(
      "http://localhost:8088/api/v1/security/login",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    const jsonResponse = await response.json()
    return jsonResponse?.access_token
  } catch (e) {
    console.error(error)
  }
}

async function fetchGuestToken() {
  const accessToken = await fetchAccessToken()
  try {
    const body = {
      resources: [
        {
          type: "dashboard",
          id: "628913ef-451d-4160-953d-6a6b5a6cc608",
        },
        {
          type: 'dashboard',
          id: 'bf6704c0-ed92-45fe-bc8e-9c5f5b7c44d9',
        },
      ],
      rls: [],
      user: {
        username: "guest",
        first_name: "Guest",
        last_name: "user",
      },
    }
    const response = await fetch(
      "http://localhost:8088/api/v1/security/guest_token",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    const jsonResponse = await response.json()
    return jsonResponse?.token
  } catch (error) {
    console.error(error)
  }
}

app.get("/guest-token", async (req, res) => {
  const token = await fetchGuestToken()
  res.json(token)
})
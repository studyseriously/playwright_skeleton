const url = "https://system.trypair.ai/v1/auth/login";
 const payload = {
    email: "hassansaad559966@gmail.com",
    password: "Hassan@123456"
  };

async function login() {

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // Handle HTTP errors (4xx, 5xx)
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("Login successful:", data);

    // Example: store token if returned
    if (data.token) {
      localStorage.setItem("authToken", data.token);
    }

    return data;

  } catch (error) {
    console.error("Login failed:", error.message);
  }
}

// Call the function
login();
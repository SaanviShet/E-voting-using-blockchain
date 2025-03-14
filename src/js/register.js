const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get form values
    const voter_id = document.getElementById("voter-id").value.trim();
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    console.log(voter_id, password, confirmPassword, role);
    

    // Basic validation
    if (!voter_id || !password || !confirmPassword || !role) {
      alert("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
        // Send data to backend
        const response = await fetch("http://127.0.0.1:5000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ voter_id, role, password })
        });
  
        const result = await response.json();
  
        if (response.ok) {
            localStorage.setItem("jwtTokenUser", result.token);
            window.location.replace(`http://127.0.0.1:8080/index`);
        } else {
          alert(result.message || "Registration failed!");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      }
});

  
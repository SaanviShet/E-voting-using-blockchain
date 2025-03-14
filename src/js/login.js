const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const voter_id = document.getElementById('voter-id').value;
    const password = document.getElementById('password').value;


    try {
        const response = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ voter_id, password })
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        const data = await response.json();

        if (data.token) {
            if (data.role === "admin") {
                localStorage.setItem("jwtTokenAdmin", data.token);
                window.location.replace(`http://127.0.0.1:8080/index?Authorization=Bearer ${localStorage.getItem("jwtTokenAdmin")}`);
            } else if (data.role === "user") {
                localStorage.setItem("jwtTokenVoter", data.token);
                window.location.replace(`http://127.0.0.1:8080/index?Authorization=Bearer ${localStorage.getItem("jwtTokenVoter")}`);
            }
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        console.error("Login failed:", error.message);
    }
});

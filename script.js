// DOM Elements
document.addEventListener("DOMContentLoaded", function () {
  // Register Donor Form
  const registerForm = document.getElementById("registerDonorForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegisterSubmit);
  }

  // Request Blood Form
  const requestForm = document.getElementById("requestBloodForm");
  if (requestForm) {
    requestForm.addEventListener("submit", handleRequestSubmit);
  }
});

// Handle Register Donor Form Submission
function handleRegisterSubmit(e) {
  e.preventDefault();

  // Get form data
  const formData = new FormData(e.target);
  const donorData = {
    fullName: formData.get("fullName"),
    age: formData.get("age"),
    gender: formData.get("gender"),
    bloodType: formData.get("bloodType"),
    phone: formData.get("phone"),
    email: formData.get("email") || null,
    district: formData.get("district"),
    address: formData.get("address"),
    lastDonated: formData.get("lastDonated") || null,
    availability: formData.get("availability"),
    registrationDate: new Date().toISOString(),
  };

  // Validate form data
  if (!validateDonorData(donorData)) {
    return;
  }

  // Send data to server
  registerDonor(donorData);
}

// Handle Request Blood Form Submission
function handleRequestSubmit(e) {
  e.preventDefault();

  // Get form data
  const formData = new FormData(e.target);
  const requestData = {
    district: formData.get("district"),
    bloodGroup: formData.get("bloodGroup"),
    requestDate: new Date().toISOString(),
  };

  // Validate form data
  if (!validateRequestData(requestData)) {
    return;
  }

  // Send data to server
  requestBlood(requestData);
}

// Validate Donor Data
function validateDonorData(data) {
  // Check if all required fields are filled
  if (
    !data.fullName ||
    !data.age ||
    !data.gender ||
    !data.bloodType ||
    !data.phone ||
    !data.district ||
    !data.address ||
    !data.availability
  ) {
    showMessage("Please fill in all required fields", "error");
    return false;
  }

  // Validate age
  if (data.age < 18 || data.age > 65) {
    showMessage("Age must be between 18 and 65", "error");
    return false;
  }

  // Validate phone number format (basic validation)
  if (!/^\d{10}$/.test(data.phone)) {
    showMessage("Please enter a valid 10-digit phone number", "error");
    return false;
  }

  // Validate email format if provided
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    showMessage("Please enter a valid email address", "error");
    return false;
  }

  return true;
}

// Validate Request Data
function validateRequestData(data) {
  // Check if all required fields are filled
  if (!data.district || !data.bloodGroup) {
    showMessage("Please select both district and blood group", "error");
    return false;
  }

  return true;
}

// Register donor (send data to server)
function registerDonor(donorData) {
  // This would normally be an API call to your backend
  console.log("Registering donor:", donorData);

  // Simulate API call
  setTimeout(() => {
    // In a real application, this would handle the response from the server
    showMessage(
      "Registration successful! Thank you for becoming a donor.",
      "success"
    );
    document.getElementById("registerDonorForm").reset();
  }, 1000);

  /* 
    // Example with fetch API - Uncomment and modify for your backend
    fetch('/api/donors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(donorData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        showMessage('Registration successful! Thank you for becoming a donor.', 'success');
        document.getElementById('registerDonorForm').reset();
    })
    .catch(error => {
        showMessage('Error registering: ' + error.message, 'error');
    });
    */
}

// Request blood (send data to server and show results)
function requestBlood(requestData) {
  // This would normally be an API call to your backend
  console.log("Requesting blood:", requestData);

  // Simulate API call and response
  setTimeout(() => {
    // In a real application, the server would return matching donors
    const mockDonors = [
      {
        fullName: "John Doe",
        bloodType: requestData.bloodGroup,
        phone: "1234567890",
        district: requestData.district,
      },
      {
        fullName: "Jane Smith",
        bloodType: requestData.bloodGroup,
        phone: "9876543210",
        district: requestData.district,
      },
    ];

    showDonors(mockDonors);
  }, 1000);

  /* 
    // Example with fetch API - Uncomment and modify for your backend
    fetch(`/api/donors/search?bloodGroup=${requestData.bloodGroup}&district=${requestData.district}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        showDonors(data.donors);
    })
    .catch(error => {
        showMessage('Error searching for donors: ' + error.message, 'error');
    });
    */
}

// Display matching donors
function showDonors(donors) {
  // Create results container if not exists
  let resultsContainer = document.querySelector(".donor-results");
  if (!resultsContainer) {
    resultsContainer = document.createElement("div");
    resultsContainer.className = "donor-results";
    document.querySelector(".request-blood").appendChild(resultsContainer);
  }

  // Clear previous results
  resultsContainer.innerHTML = "";

  // Show header
  const header = document.createElement("h3");
  header.textContent = `Found ${donors.length} matching donors`;
  resultsContainer.appendChild(header);

  if (donors.length === 0) {
    const noResults = document.createElement("p");
    noResults.textContent =
      "No matching donors found. Please try another district or blood group.";
    resultsContainer.appendChild(noResults);
    return;
  }

  // Create donor list
  const donorList = document.createElement("ul");
  donorList.className = "donor-list";

  donors.forEach((donor) => {
    const donorItem = document.createElement("li");
    donorItem.className = "donor-item";
    donorItem.innerHTML = `
            <div class="donor-info">
                <h4>${donor.fullName}</h4>
                <p><strong>Blood Type:</strong> ${donor.bloodType}</p>
                <p><strong>District:</strong> ${donor.district}</p>
                <p><strong>Contact:</strong> ${donor.phone}</p>
            </div>
            <button class="btn btn-outline donor-contact">Contact</button>
        `;
    donorList.appendChild(donorItem);
  });

  resultsContainer.appendChild(donorList);

  // Add event listeners to contact buttons
  document.querySelectorAll(".donor-contact").forEach((button) => {
    button.addEventListener("click", function () {
      const donorName =
        this.previousElementSibling.querySelector("h4").textContent;
      const donorPhone = this.previousElementSibling
        .querySelector("p:nth-child(3)")
        .textContent.split(":")[1]
        .trim();
      showMessage(`Contacting ${donorName} at ${donorPhone}`, "info");
    });
  });
}

// Show message (success, error, info)
function showMessage(message, type = "info") {
  // Create message container if not exists
  let messageContainer = document.querySelector(".message-container");
  if (!messageContainer) {
    messageContainer = document.createElement("div");
    messageContainer.className = "message-container";
    document.body.appendChild(messageContainer);

    // Add styles
    messageContainer.style.position = "fixed";
    messageContainer.style.top = "20px";
    messageContainer.style.right = "20px";
    messageContainer.style.zIndex = "1000";
  }

  // Create message element
  const messageElement = document.createElement("div");
  messageElement.className = `message message-${type}`;
  messageElement.textContent = message;

  // Style the message
  messageElement.style.padding = "1rem";
  messageElement.style.marginBottom = "0.5rem";
  messageElement.style.borderRadius = "5px";
  messageElement.style.color = "white";
  messageElement.style.fontWeight = "bold";

  // Set background color based on type
  switch (type) {
    case "success":
      messageElement.style.backgroundColor = "#28a745";
      break;
    case "error":
      messageElement.style.backgroundColor = "#dc3545";
      break;
    case "info":
      messageElement.style.backgroundColor = "#17a2b8";
      break;
    default:
      messageElement.style.backgroundColor = "#6c757d";
  }

  // Add close button
  const closeButton = document.createElement("span");
  closeButton.textContent = "×";
  closeButton.style.marginLeft = "10px";
  closeButton.style.cursor = "pointer";
  closeButton.style.float = "right";
  closeButton.addEventListener("click", () => {
    messageContainer.removeChild(messageElement);
  });
  messageElement.appendChild(closeButton);

  // Add to container
  messageContainer.appendChild(messageElement);

  // Remove after 5 seconds
  setTimeout(() => {
    if (messageElement.parentNode === messageContainer) {
      messageContainer.removeChild(messageElement);
    }
  }, 5000);
}

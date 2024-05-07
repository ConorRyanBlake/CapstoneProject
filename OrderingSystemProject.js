// Function to take orders
function takeOrder() {
  const ingredient = prompt(
    "Enter the main ingredient for the chef's favorite meal:"
  );

  const formattedIngredient = ingredient.toLowerCase().replace(/\s/g, "_");

  const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${formattedIngredient}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.meals === null) {
        alert(
          "No chef's favorite meals found for that ingredient. Please try again."
        );
        takeOrder();
      } else {
        const randomMealURL =
          "https://www.themealdb.com/api/json/v1/1/random.php";
        fetch(randomMealURL)
          .then((response) => response.json())
          .then((data) => {
            const randomMeal = data.meals[0];

            const order = {
              description: randomMeal.strMeal,
              orderNumber: generateOrderNumber(),
              completionStatus: "incomplete",
            };

            storeOrder(order);

          })
          .catch((error) => {
            console.error("Error:", error);
            alert(
              "An error occurred while processing your request. Please try again later."
            );
          });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(
        "An error occurred while processing your request. Please try again later."
      );
    });
}

// Function to generate a unique order number
function generateOrderNumber() {
  let lastOrderNumber = sessionStorage.getItem("lastOrderNumber");

  if (!lastOrderNumber) {
    lastOrderNumber = 0;
  }

  const newOrderNumber = parseInt(lastOrderNumber) + 1;

  sessionStorage.setItem("lastOrderNumber", newOrderNumber);

  return newOrderNumber;
}

// Function to store order details in sessionStorage
function storeOrder(order) {
  const existingOrders = JSON.parse(sessionStorage.getItem("orders")) || [];
  existingOrders.push(order);
  sessionStorage.setItem("orders", JSON.stringify(existingOrders));

  // Call the function to display incomplete orders
  displayIncompleteOrders()
}

// Function to display incomplete orders stored in sessionStorage with order number and description
function displayIncompleteOrders() {
    const existingOrders = JSON.parse(sessionStorage.getItem("orders")) || [];
    const incompleteOrders = existingOrders.filter(
      (order) => order.completionStatus === "incomplete"
    );
    incompleteOrders.forEach((order) => {
      alert(
        `Order Number: ${order.orderNumber}\nDescription: ${order.description}`
      );
    });

    // Call the function to prompt the user for order completion
    markOrderCompletion();
  }
  
// Function to prompt the user to mark an order as complete or not
function markOrderCompletion() {
  const orderNumberToComplete = prompt(
    "Enter the order number to mark as complete, or enter zero (0) to cancel:"
  );
  const orderNumber = parseInt(orderNumberToComplete);
  if (orderNumber === 0) {
    alert("Order completion canceled.");
  } else {
    const existingOrders = JSON.parse(sessionStorage.getItem("orders")) || [];
    const orderToComplete = existingOrders.find(
      (order) => order.orderNumber === orderNumber
    );
    if (orderToComplete) {
      orderToComplete.completionStatus = "complete";

      const updatedOrders = existingOrders.map((order) =>
        order.orderNumber === orderNumber ? orderToComplete : order
      );
      sessionStorage.setItem("orders", JSON.stringify(updatedOrders));
      alert(`Order ${orderNumber} marked as complete.`);
    } else {
      alert(
        `Order ${orderNumber} not found. Please enter a valid order number.`
      );
    }
  }

  // Call the function to store the sample order collection
  storeOrderCollection();
}

// Function to store order details in sessionStorage
function storeOrderCollection(order) {
  const existingOrders = JSON.parse(sessionStorage.getItem("orders")) || [];
  existingOrders.push(order);
  sessionStorage.setItem("orders", JSON.stringify(existingOrders));
  let lastOrderNumber =
    parseInt(sessionStorage.getItem("lastOrderNumber")) || 0;
  lastOrderNumber++;
  sessionStorage.setItem("lastOrderNumber", lastOrderNumber);
}

// Call the takeOrder function to start taking orders
takeOrder();




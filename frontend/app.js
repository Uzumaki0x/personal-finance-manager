console.log("Radhe Radhe");
function formatCurrency(amount, currency) {
  const amt = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  });
  return amt.format(amount);
}
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-In", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
const baseCurrency = "INR";
const exchangeRates = { USD: 83, EUR: 93, GBP: 110, INR: 1 };
function convertCurrency(amount, fromCurrency, toCurrency) {
  if (
    exchangeRates[fromCurrency] === undefined ||
    exchangeRates[toCurrency] === undefined
  ) {
    throw new Error("Currency is not available.This will be available soon.");
  }
  if (fromCurrency === toCurrency) {
    return amount;
  }
  if (toCurrency === "INR") {
    return amount * exchangeRates[fromCurrency];
  }
  if (fromCurrency === "INR") {
    return amount / exchangeRates[toCurrency];
  }
  amount = amount * exchangeRates[fromCurrency];
  amount = amount / exchangeRates[toCurrency];
  return amount;
}
async function updateTransaction(id, transactionData) {
  const response = await fetch(`http://localhost:3000/api/transactions/${id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(transactionData),
  });
  if (!response.ok) {
    const error = await response.json();
    //console.error("Update failed:", error);
    alert(`Update Failed: ${error.message}`);
    return;
  }
  const data = await response.json();
  return data.transaction;
}
const heading = document.querySelector("h1");
heading.textContent = "My Finance Dashboard";
let transactions = [];
const transactionList = document.querySelector(".transaction-list");
const form = document.querySelector("#transaction-form");
const submitButton = document.querySelector("#submit-button");
const cancelEditButton = document.querySelector("#cancel-edit-button");
let editingTransactionId = null;
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const merchantInput = form.querySelector("#merchant");
  const categoryInput = form.querySelector("#category");
  const amountInput = form.querySelector("#amount");
  const currencyInput = form.querySelector("#currency");
  const dateInput = form.querySelector("#date");
  const typeInput = form.querySelector("#type");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const amount = Number(amountInput.value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const todayString = `${year}-${month}-${day}`;
  const selectedDate = dateInput.value;
  if (selectedDate > todayString) {
    console.log("Future Dates are not allowed");
    return;
  }
  const type = typeInput.value;
  if (type !== "income" && type !== "expense") {
    return;
  }
  const transactionData = {
    merchant: merchantInput.value,
    category: categoryInput.value,
    amount: amount,
    currency: currencyInput.value,
    date: dateInput.value,
    type: type,
  };
  if (editingTransactionId !== null) {
    const updatedTransaction = await updateTransaction(
      editingTransactionId,
      transactionData,
    );
    if (!updatedTransaction) {
    console.log("update transaction stopped due to server failure!");
    return;
    }
    transactions = transactions.map((transaction) =>
      transaction.id === editingTransactionId
        ? updatedTransaction
        : transaction,
    );
    transactionList.innerHTML = "";
    for (const transaction of transactions) {
      renderTransaction(transaction);
    }
    updateSummary(transactions);
    form.reset();
    editingTransactionId = null ;
    submitButton.textContent = "Add Transaction" ;
    cancelEditButton.hidden=true;
    return;
  }
  console.log("Submitting transaction:", transactionData);
  const response = await fetch("http://localhost:3000/api/transactions", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(transactionData),
  });
  console.log("POST response status:", response.status);
  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    return;
  }
  const data = await response.json();
  transactions.push(data.transaction);
  renderTransaction(data.transaction);
  updateSummary(transactions);
  form.reset();
});
cancelEditButton.addEventListener("click",()=>{
  form.reset();
  editingTransactionId=null;
  submitButton.textContent="Add Transaction";
  cancelEditButton.hidden=true;
})
function renderTransaction(transaction) {
  const item = document.createElement("article");
  item.classList.add("transaction");
  if (transaction.type === "income") {
    item.classList.add("income");
  } else {
    item.classList.add("expense");
  }
  const merchantElement = document.createElement("p");
  merchantElement.classList.add("merchant");
  const categoryElement = document.createElement("p");
  categoryElement.classList.add("category");
  const amountElement = document.createElement("p");
  amountElement.classList.add("amount");
  const currencyElement = document.createElement("p");
  currencyElement.classList.add("currency");
  const dateElement = document.createElement("p");
  dateElement.classList.add("date");
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.dataset.id = transaction.id;
  editButton.addEventListener("click", function () {
    const id = Number(editButton.dataset.id);
    const transactionToEdit = transactions.find(
      (transaction) => transaction.id === id,
    );
    console.log(transactionToEdit);
    if (!transactionToEdit) {
      return;
    }
    editingTransactionId = transactionToEdit.id;
    cancelEditButton.hidden = false ;
    form.querySelector("#submit-button").textContent = "Update Transaction";
    form.querySelector("#merchant").value = transactionToEdit.merchant;
    form.querySelector("#category").value = transactionToEdit.category;
    form.querySelector("#amount").value = transactionToEdit.amount;
    form.querySelector("#currency").value = transactionToEdit.currency;
    form.querySelector("#date").value = new Date(
      transactionToEdit.date,
    ).toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    form.querySelector("#type").value = transactionToEdit.type;
  });
  deleteButton.dataset.id = transaction.id;
  deleteButton.addEventListener("click", async function (event) {
    const id = Number(deleteButton.dataset.id);
    const response = await fetch(
      `http://localhost:3000/api/transactions/${id}`,
      { method: "DELETE" },
    );
    if (!response.ok) {
      const error = await response.json();
      console.error("Delete Failed:", error);
      return;
    }
    transactions = transactions.filter((transaction) => transaction.id !== id);
    item.remove();
    updateSummary(transactions);
  });
  merchantElement.textContent = transaction.merchant;
  categoryElement.textContent = transaction.category;
  if (transaction.type === "income") {
    amountElement.textContent = `+${formatCurrency(transaction.amount, transaction.currency)}`;
  } else {
    amountElement.textContent = `-${formatCurrency(transaction.amount, transaction.currency)}`;
  }
  currencyElement.textContent = transaction.currency;
  dateElement.textContent = formatDate(transaction.date);
  const transactionInfo = document.createElement("div");
  transactionInfo.classList.add("transaction-info");
  const transactionDetail = document.createElement("div");
  transactionDetail.classList.add("transaction-details");
  transactionInfo.append(merchantElement, categoryElement);
  transactionDetail.append(amountElement, currencyElement, dateElement);
  item.append(transactionInfo, transactionDetail, deleteButton, editButton);
  transactionList.append(item);
}
function updateSummary(transactions) {
  const totalIncome = transactions.reduce((total, transaction) => {
    if (transaction.type === "income") {
      return total + transaction.baseAmount;
    }
    return total;
  }, 0);
  const totalExpense = transactions.reduce((total, transaction) => {
    if (transaction.type === "expense") {
      return total + transaction.baseAmount;
    }
    return total;
  }, 0);

  const cards = document.querySelectorAll(".summary-card");
  const balance = cards[0].querySelector("p");
  const income = cards[1].querySelector("p");
  const expense = cards[2].querySelector("p");
  const totalBalance = totalIncome - totalExpense;
  balance.textContent = formatCurrency(totalBalance, baseCurrency);
  income.textContent = formatCurrency(totalIncome, baseCurrency);
  expense.textContent = formatCurrency(totalExpense, baseCurrency);
}
updateSummary(transactions);
async function loadTransactions() {
  const response = await fetch("http://localhost:3000/api/transactions");
  if (!response.ok) {
    console.error("Failed to load transactions");
    return;
  }
  const data = await response.json();
  transactions = data.transactions;
  transactionList.innerHTML = "";
  for (const transaction of transactions) {
    renderTransaction(transaction);
  }
  updateSummary(transactions);
}
loadTransactions();
fetch("http://localhost:3000/")
  .then((response) => response.text())
  .then((data) => {
    console.log(data);
  });
// fetch("http://localhost:3000/api/transactions",{
//     method : "POST" ,
//     headers : { "Content-type" : "application/json" } ,
//     body : JSON.stringify({
//         merchant : "radhe" ,
//         amount : 100 ,
//         category : "shopping" ,
//         currency : "USD" ,
//         type : "expense" ,
//         date : "2026-09-20"
//     })
// })
// .then(response => response.json())
// .then(data => {console.log(data);})

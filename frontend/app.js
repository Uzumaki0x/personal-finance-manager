console.log("Radhe Radhe");
function formatCurrency(amount){
    return `₹${amount.toLocaleString("en-IN")}`
}
function formatDate(dateString){
    const date = new Date(dateString);
    return date.toLocaleDateString("en-In",{day: "2-digit", month: "short" , year: "numeric"});
}
const heading = document.querySelector("h1");
heading.textContent = "My Finance Dashboard" ;
let transactions = [
    {
        id : 1,
    merchant : "Amazon" ,
    category : "Shopping" ,
    amount : 5000 ,
    currency : "INR" ,
    date : "29 AUG 2026" ,
    type : "expense",
    },
    {
        id : 2,
    merchant : "Radhe" ,
    category : "Shopping" ,
    amount : 10000 ,
    currency : "INR" ,
    date : "1 SEP 2026" ,
    type : "expense",
    },
    { 
        id : 3,
    merchant : "Krishna" ,
    category : "Grocery" ,
    amount : 50000 ,
    currency : "INR" ,
    date : "13 SEP 2026" ,
    type : "income",
    }
]
const transactionList = document.querySelector(".transaction-list");
const form = document.querySelector("#transaction-form");
form.addEventListener("submit",function(event){
    event.preventDefault();
    const merchantInput = form.querySelector("#merchant");
    const categoryInput = form.querySelector("#category");
    const amountInput = form.querySelector("#amount");
    const currencyInput = form.querySelector("#currency");
    const dateInput = form.querySelector("#date");
    const typeInput = form.querySelector("#type");
    if(!form.checkValidity()){
        form.reportValidity();
        return ;
    }
    const amount = Number(amountInput.value);
    if(!Number.isFinite(amount)||amount<=0){
        return ;
    }
    const today = new Date();
    const selectedDate = new Date(dateInput.value);
    if(selectedDate>today){
        return ;
    }
    const type = typeInput.value ;
    if(type !== "income" && type !== "expense"){
        return ;
    }
    const transaction = { 
    id : Date.now() ,
    merchant : merchantInput.value,
    category : categoryInput.value,
    amount : amount,
    currency : currencyInput.value,
    date : dateInput.value,
    type : type
};

transactions.push(transaction);
renderTransaction(transaction);
updateSummary(transactions);
form.reset();
});
function renderTransaction(transaction){
    const item = document.createElement("article");
    item.classList.add("transaction");
    if(transaction.type==="income"){
        item.classList.add("income");
    }
    else{
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
    deleteButton.textContent = "Delete" ;
    deleteButton.dataset.id = transaction.id ;
    deleteButton.addEventListener("click",function(event){
    const id = Number(deleteButton.dataset.id);
    transactions = transactions.filter(transaction => transaction.id !== id);
    item.remove();
    updateSummary(transactions);
});
    merchantElement.textContent = transaction.merchant ;
    categoryElement.textContent = transaction.category ;
    if(transaction.type==="income"){
    amountElement.textContent =  `+${formatCurrency(transaction.amount)}` ;
    }
    else{
        amountElement.textContent = `-${formatCurrency(transaction.amount)}` ;
    }
    currencyElement.textContent = transaction.currency ;
    dateElement.textContent = formatDate(transaction.date);
    const transactionInfo = document.createElement("div");
    transactionInfo.classList.add("transaction-info");
    const transactionDetail = document.createElement("div");
    transactionDetail.classList.add("transaction-details");
    transactionInfo.append(merchantElement,categoryElement);
    transactionDetail.append(amountElement,currencyElement,dateElement); 
    item.append(
    transactionInfo,transactionDetail,deleteButton
    );
    transactionList.append(item);
}
for(const transaction of transactions){
    renderTransaction(transaction);    
}
function updateSummary(transactions){
const totalIncome = transactions.reduce((total,transaction)=>{
    if(transaction.type==="income"){
    return total+transaction.amount;
}
    return total;
},0);
const totalExpense = transactions.reduce((total,transaction)=>{
    if(transaction.type==="expense"){
        return total+transaction.amount ;
    }
    return total; 
},0)
const cards = document.querySelectorAll(".summary-card");
const balance = cards[0].querySelector("p");
const income = cards[1].querySelector("p");
const expense = cards[2].querySelector("p");
const totalBalance = totalIncome - totalExpense ;
balance.textContent = formatCurrency(totalBalance) ;
income.textContent = formatCurrency(totalIncome);
expense.textContent = formatCurrency(totalExpense);
}
updateSummary(transactions);

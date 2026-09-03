console.log("Radhe Radhe");
function formatCurrency(amount){
    return `₹${amount.toLocaleString("en-IN")}`
}
const heading = document.querySelector("h1");
heading.textContent = "My Finance Dashboard" ;
const transactions = [
    {
    merchant : "Amazon" ,
    category : "Shopping" ,
    amount : 5000 ,
    currency : "INR" ,
    date : "29 AUG 2026" ,
    type : "expense",
    },
    {
    merchant : "Radhe" ,
    category : "Shopping" ,
    amount : 10000 ,
    currency : "INR" ,
    date : "1 SEP 2026" ,
    type : "expense",
    },
    {
    merchant : "Krishna" ,
    category : "Grocery" ,
    amount : 50000 ,
    currency : "INR" ,
    date : "13 SEP 2026" ,
    type : "income",
    }
]
const transactionList = document.querySelector(".transaction-list");
function renderTransaction(transaction){
    const item = document.createElement("article");
    item.classList.add("transaction");
    if(transaction.type=="income"){
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
    merchantElement.textContent = transaction.merchant ;
    categoryElement.textContent = transaction.category ;
    if(transaction.type==="income"){
    amountElement.textContent =  `+${formatCurrency(transaction.amount)}` ;
    }
    else{
        amountElement.textContent = `-${formatCurrency(transaction.amount)}` ;
    }
    currencyElement.textContent = transaction.currency ;
    dateElement.textContent = transaction.date ;
    const transactionInfo = document.createElement("div");
    transactionInfo.classList.add("transaction-info");
    const transactionDetail = document.createElement("div");
    transactionDetail.classList.add("transaction-details");
    transactionInfo.append(merchantElement,categoryElement);
    transactionDetail.append(amountElement,currencyElement,dateElement); 
    item.append(
    transactionInfo,transactionDetail
    );
    transactionList.append(item);
}
for(const transaction of transactions){
    renderTransaction(transaction);    
}
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
let totalBalance = totalIncome - totalExpense ;
balance.textContent = formatCurrency(totalBalance) ;
income.textContent = formatCurrency(totalIncome);
expense.textContent = formatCurrency(totalExpense);
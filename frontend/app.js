console.log("Radhe Radhe");
const heading = document.querySelector("h1");
console.log(heading);
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
const transactionList = document.querySelector(".transactions-section");
for(const transaction of transactions){
    const item = document.createElement("article");
    item.classList.add("transaction");
    const merchantElement = document.createElement("p");
    const categoryElement = document.createElement("p");
    const amountElement = document.createElement("p");
    const currencyElement = document.createElement("p");
    const dateElement = document.createElement("p");
    merchantElement.textContent = transaction.merchant ;
    categoryElement.textContent = transaction.category ;
    amountElement.textContent = `₹${transaction.amount}` ;
    currencyElement.textContent = transaction.currency ;
    dateElement.textContent = transaction.date ;
    item.append(
    merchantElement,
    categoryElement,
    amountElement,
    currencyElement,
    dateElement
    );
    transactionList.append(item);
    console.log(item);
}
let totalIncome = 0 ;
for (const transaction of transactions){
    if(transaction.type === "income" ){
        totalIncome+=transaction.amount ;
    }
}
console.log(totalIncome);
let totalExpense = 0 ;
for ( const transaction of transactions ){
    if(transaction.type === "expense"){
        totalExpense+=transaction.amount;
    }
}
const cards = document.querySelectorAll(".summary-card");
console.log(cards);
const balance = cards[0].querySelector("p");
console.log(totalExpense);
let totalBalance = totalIncome - totalExpense ;
console.log(totalBalance);
balance.textContent = totalBalance ;
const income = cards[1].querySelector("p");
income.textContent = totalIncome ;
const expense = cards[2].querySelector("p");
expense.textContent = totalExpense;
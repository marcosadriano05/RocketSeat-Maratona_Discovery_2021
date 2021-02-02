const Modal = {
    open(){
        //Abrir modal adicionando a classe active ao modal
        document
        .querySelector(".modal-overlay")
        .classList
        .add("active")
    },
    close(){
        //Fechar modal removendo a classe active do modal
        document
        .querySelector(".modal-overlay")
        .classList
        .remove("active")
    }
}

const transactions = [
    {
        id: 1,
        description: "Luz",
        amount: -50000,
        date: "18/01/2020"
    },
    {
        id: 2,
        description: "Website",
        amount: 500000,
        date: "18/01/2020"
    },
    {
        id: 3,
        description: "Aluguel",
        amount: -150000,
        date: "18/01/2020"
    },
]

const Transaction = {
    all: transactions,
    add(transaction) {
        Transaction.all.push(transaction)
        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },
    incomes() {
        let income = 0
        Transaction.all.forEach((transaction) => {
            if(transaction.amount > 0) {
                income += transaction.amount
            }
        })
        return income
    },
    expenses() {
        let expense = 0
        Transaction.all.forEach((transaction) => {
            if(transaction.amount < 0) {
                expense += transaction.amount
            }
        })
        return expense
    },
    total() {
        return Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody"),
    addTransactions(transaction) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction) {
        const CSSClass = transaction.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSClass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
            <img src="./assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html
    },
    updateBalance() {
        const incomes = Transaction.incomes()
        const expenses = Transaction.expenses()
        const total = Transaction.total()
        document.getElementById("incomeBalance").innerHTML = Utils.formatCurrency(incomes)
        document.getElementById("expenseBalance").innerHTML = Utils.formatCurrency(expenses)
        document.getElementById("totalBalance").innerHTML = Utils.formatCurrency(total)
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")
        value = Number(value)/100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const App = {
    init() {
        Transaction.all.forEach((transaction) => DOM.addTransactions(transaction))
        DOM.updateBalance()
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()

Transaction.add({
    id: 10,
    description: "abc",
    amount: 8000,
    date: "12/03/2020"
})

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
    incomes() {
        let income = 0
        transactions.forEach((transaction) => {
            if(transaction.amount > 0) {
                income += transaction.amount
            }
        })
        return income
    },
    expenses() {
        let expense = 0
        transactions.forEach((transaction) => {
            if(transaction.amount < 0) {
                expense += transaction.amount
            }
        })
        return expense
    },
    total() {
        return Transaction.incomes() - Transaction.expenses()
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

transactions.forEach((transaction) => DOM.addTransactions(transaction))
DOM.updateBalance()

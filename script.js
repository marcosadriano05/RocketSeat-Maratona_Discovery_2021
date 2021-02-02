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

const Transaction = {
    all: [
            {
                description: "Luz",
                amount: -50000,
                date: "18/01/2020"
            },
            {
                description: "Website",
                amount: 500000,
                date: "18/01/2020"
            },
            {
                description: "Aluguel",
                amount: -150000,
                date: "18/01/2020"
            },
        ],
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
    },
    formatAmount(value) {
        value = Number(value.replace(/\,\./g, "")) * 100
        return value
    },
    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),
    getValue() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    validateForm() {
        const { description, amount, date} = Form.getValue()
        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos.")
        }
    },
    formatFields() {
        let { description, amount, date} = Form.getValue()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return {
            description,
            amount,
            date
        }
    },
    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    submit(event) {
        event.preventDefault()
        try {
            Form.validateForm()
            const transaction = Form.formatFields()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
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

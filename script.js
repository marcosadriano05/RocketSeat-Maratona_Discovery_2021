const Modal = {
    open(value){
        //Abrir modal adicionando a classe active ao modal
        document
        .querySelector(value)
        .classList
        .add("active")
    },
    close(value){
        //Fechar modal removendo a classe active do modal
        document
        .querySelector(value)
        .classList
        .remove("active")
    },

}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),
    /*
    all: [
        {
            description: "Luz",
            amount: -5000,
            date: "21/02/2021"
        },
        {
            description: "App",
            amount: 500000,
            date: "21/02/2021"
        }
    ],
    */
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

const Options = {
    optionsContainer: {
        all: document.querySelector("#label-1"),
        income: document.querySelector("#label-2"),
        expense: document.querySelector("#label-3")
    },
    getValue() {
        return {
            all: Options.optionsContainer.all.value,
            income: Options.optionsContainer.income.value,
            expense: Options.optionsContainer.expense.value
        }
    },
    selectAll() {
        Options.optionsContainer.all.classList.add("select")
        Options.optionsContainer.income.classList.remove("select")
        Options.optionsContainer.expense.classList.remove("select")
    },
    selectIncomes() {
        Options.optionsContainer.income.classList.add("select")
        Options.optionsContainer.all.classList.remove("select")
        Options.optionsContainer.expense.classList.remove("select")
    },
    selectExpenses() {
        Options.optionsContainer.expense.classList.add("select")
        Options.optionsContainer.all.classList.remove("select")
        Options.optionsContainer.income.classList.remove("select")
    }
}

const Table = {
    isChecked: [],
    captureTransactionEvent(event) {
        if(event.target.checked) {
            Table.isChecked.push(event.target.id)
        } else {
            const index = Table.isChecked.indexOf(event.target.id)
            Table.isChecked.splice(index, 1)
        }
        console.log(Table.isChecked)
    }
}

const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody"),
    addTransactions(transaction, index) {
        const tr = document.createElement('tr')
        tr.dataset.index = index
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index) {
        const description = transaction.description
        const CSSClass = transaction.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
            <td>
                <label for="index_${index}" class="sr-only">Selecionar transação ${transaction.description}</label>
                <input type="checkbox" id="index_${index}" onchange="Table.captureTransactionEvent(event)" />
            </td>
            <td class="description">${transaction.description}</td>
            <td class="${CSSClass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
            <img onclick="Modal.open('.modal-overlay-remove'), RemoveForm.setTransaction('${description}',${index})" src="./assets/minus.svg" alt="Remover transação">
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
    },
    //Opções
    optionAll() {
        DOM.clearTransactions()
        Transaction.all.forEach((transaction, index) => DOM.addTransactions(transaction, index))
        Options.selectAll()
    },
    optionIncome() {
        DOM.clearTransactions()
        Transaction.all.forEach((transaction, index) => {
            if(transaction.amount > 0) {
                DOM.addTransactions(transaction, index)
            }
        })
        Options.selectIncomes()
    },
    optionExpense() {
        DOM.clearTransactions()
        Transaction.all.forEach((transaction, index) => {
            if(transaction.amount < 0) {
                DOM.addTransactions(transaction, index)
            }
        })
        Options.selectExpenses()
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
            Modal.close(".modal-overlay")
        } catch (error) {
            alert(error.message)
        }
    }
}

const RemoveForm = {
    transaction: {
        description: "",
        index: 0
    },
    setTransaction(description, index) {
        RemoveForm.transaction.description = description
        RemoveForm.transaction.index = index
        document.querySelector("#form-remove h2")
        .innerHTML = `Deseja apagar a transação: ${description}?`
    },
    submit(event) {
        event.preventDefault()
        Transaction.remove(RemoveForm.transaction.index)
        Modal.close(".modal-overlay-remove")
    }
}

const App = {
    init() {
        Transaction.all.forEach((transaction, index) => DOM.addTransactions(transaction, index))
        DOM.updateBalance()
        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()

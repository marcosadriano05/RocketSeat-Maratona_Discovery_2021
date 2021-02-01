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

const Transacrion = {
    incomes() {},
    expenses() {},
    total() {}
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
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSClass}">${transaction.amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
            <img src="./assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html
    },
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
    }
}

transactions.forEach((transaction) => DOM.addTransactions(transaction))

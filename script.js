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

const transacrions = [
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
    innerHTMLTransaction() {
        const html = `
            <tr>
                <td class="description">Luz</td>
                <td class="expense">-R$500,00</td>
                <td class="date">18/01/2021</td>
                <td>
                <img src="./assets/minus.svg" alt="Remover transação">
                </td>
            </tr>
        `
    },
}

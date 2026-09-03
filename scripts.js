// seleciona os elementos do formulario 
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// seleciona os elementos da lista 
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// captura o evento de input para formatar o valor
amount.oninput = () => {
  // obtem o valor atual do input e remove os caracteres nao numericos
  let value = amount.value.replace(/\D/g, "")
  
  // transforma o valor em centavos 
  value = Number(value)/100
  
  // atualiza o valor do input
  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
  // formata o valor no padrao BRL 
  value = value.toLocaleString("pt-BR", {
    style:"currency",
    currency:"BRL", 
  })
  
  // retorna o valor do formulario 
  return value
}

// captura o evento de submit do formulario para obter os valores
form.onsubmit = (event) => {
  // previne o comportamento padrao de recarregar a pagina 
  event.preventDefault ()
  
  // cria um objeto com os detalhes na nova despesa 
  const newExpense = {
    id: new Date() .getTime(),
    expense: expense.value,
    category_id: category.value, 
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }
  
  // chama a funcao que vai adicionar o item na lista
  expenseAdd(newExpense)
}

// adiciona um novo item na lista
function expenseAdd(newExpense) {
  try { 
    // cria o elemento para adicionar o item (li)  na lista (ul)
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")
    
    // cria o icone da categoria 
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)
    
    // cria a informacao da despesa 
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")
    
    // cria o nome da despesa 
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense
    
    // cria a categoria da despesa 
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name
    
    // adiciona nome e categoria na div das informacoes da despesa
    expenseInfo.append(expenseName, expenseCategory)
    
    // cria o valor da despesa 
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML =` <small> R$ </small>${newExpense.amount
      .toUpperCase()
      .replace("R$" , "")}`
      
      // cria o icone de remover 
      const removeIcon = document.createElement("img")
      removeIcon.classList.add("remove-icon")
      removeIcon.setAttribute("src", "img/remove.svg")
      removeIcon.setAttribute("alt", "remover")
      
      // adiciona as informacoes no item 
      expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)
      
      // adiciona o item na lista 
      expenseList.append(expenseItem)
      
      // limpa o formulario para adicionar um novo item
      formClear()
      
      // atualiza o total 
      updateTotal()
      
    } catch(error){
      alert("Não foi possível atualizar a lista de despesas.")
      console.log(error)
    }
  }
  
  // atualiza o valor total 
  function updateTotal(){
    try {
      // recupera todos os itens(li) da lista(ul) 
      const items = expenseList.children
      
      // atualiza a quantidade de itens da lista
      expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`
      
      //  variavel para incrementar o total 
      let total = 0
      
      // percorre cada item (li) da lista (ul)
      for(let item = 0; item < items.length; item++) {
        const itemAmount = items[item].querySelector(".expense-amount")
        
        // remove caracteres nao numericos e substitui a virgula pelo ponto 
        let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")
        
        // converte o valor para float 
        value = parseFloat(value)
        
        // verificar se o numero e valido 
        if (isNaN(value)){
          return alert("Não foi possível calcular o total. O valor não parece ser um número.")
        }
        
        // incrementa o valor total
        total += Number(value)
        
        
      }
      
      // cria a span para adicionar o RS formatado 
      const symbolBRL = document.createElement("small")
      symbolBRL.textContent = "R$" 
      
      // formara o valor e remove o RS que sera exibido pela small com um estilo customizado
      total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")
      
      // limpa o conteudo do elemento 
      expensesTotal.innerHTML = ""
      
      // adiciona o simbolo da moeda e o valor total formatado 
      expensesTotal.append(symbolBRL, total)
      
    } catch (error){
      console.log(error)
      alert("Não foi possível atualizar o total.")
    }
  }
  
  //evento que captura o clique nos itens da lista
  expenseList.addEventListener("click", function(event){
    
    // verifica se o elemento clicado e o icone de remover
    if (event.target.classList.contains("remove-icon")){
      //obtem a li pai do elemento clicado 
      const item = event.target.closest(".expense")
      
      // remove o item da lista
      item.remove()
    }
    // atualiza o total 
    updateTotal()
  })
  
  function formClear (){
    // limpa os inputs
    expense.value = ""
    category.value = ""
    amount.value = ""
    
    // coloca o foco no input de amount
    expense.focus()
  }
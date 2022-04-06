let cart = []
let modalQt = 0
let key = 0

const a = el => document.querySelector(el)
const al = el => document.querySelectorAll(el)
// ADICIONANDO LISTRA DE PRODUTOS A PARTIR DO PRODUCTS.JS//
productsJson.forEach((item, index) => {
  let productItem = document
    .querySelector('.models .models-item')
    .cloneNode(true)
  productItem.setAttribute('data-key', index)
  productItem.querySelector('.models-item-img img').src = item.img[0].src
  productItem.querySelector(
    '.models-item--price'
  ).innerHTML = `R$ ${item.price.toFixed(2)}`
  productItem.querySelector('.models-item--name').innerHTML = item.name
  productItem.querySelector('.models-item--desc').innerHTML = item.description

  productItem.querySelector('a').addEventListener('click', e => {
    e.preventDefault()
    key = e.target.closest('.models-item ').getAttribute('data-key', index)
    productQt = 1
    // CAROUSEL DE IMAGEM//
    al('.carousel-item img').forEach((imgItem, imgIndex) => {
      imgItem.src = productsJson[key].img[imgIndex].src
    })
    a('.modelsInfo h1').innerHTML = productsJson[key].name
    a('.modelsInfo--desc').innerHTML = productsJson[key].description
    a('.modelsInfo--actualPrice').innerHTML = `R$ ${productsJson[
      key
    ].price.toFixed(2)}`
    al('.modelsInfo--size').forEach((size, sizeIndex) => {
      size.innerHTML = productsJson[key].sizes[sizeIndex]
    })
    a('.modelsInfo--qt').innerHTML = productQt
    a('.modelsWindowArea').style.display = 'flex'
    a('body').style.overflow = 'hidden'
  })

  document.querySelector('.models-area').append(productItem)
})
// FECHANDO O MODAL//
function closeWindowProduct() {
  a('.modelsWindowArea').style.opacity = 0
  setTimeout(() => {
    a('.modelsWindowArea').style.display = 'none'
  }, 200)
}
// ADICIONANDO E REMOVENDO SCROLL DO BODY CONFORME MODAL SE ABRE//
al(
  '.modelsinfo--cancelbutton, .modelsInfo--cancelMobileButton, .modelsInfo--addbutton'
).forEach(item => {
  item.addEventListener('click', () => {
    let body = document.querySelector('body')

    if (body.style.overflow == 'hidden') {
      body.style.overflow = 'auto'
    } else {
    }
    closeWindowProduct()
  })
})
// QUANTIDADE DE PRODUTOS//
a('.modelsInfo--qtmenos').addEventListener('click', () => {
  if (productQt > 1) {
    productQt--
  }
  a('.modelsInfo--qt').innerHTML = productQt
})
a('.modelsInfo--qtmais').addEventListener('click', () => {
  productQt++
  a('.modelsInfo--qt').innerHTML = productQt
})
// TAMANHOS DOS PRODUTOS//
al('.modelsInfo--size').forEach((size, sizeIndex) => {
  size.addEventListener('click', size => {
    a('.modelsInfo--size.selected').classList.remove('selected')
    size.target.classList.add('selected')
  })
})

a('.modelsInfo--addbutton').addEventListener('click', () => {
  clearInput()
  let size = parseInt(a('.modelsInfo--size.selected').getAttribute('data-key'))
  let identifier = productsJson[key].id + '@' + size
  let locaId = cart.findIndex(item => item.identifier == identifier)
  if (locaId > -1) {
    cart[locaId].qt += productQt
  } else {
    cart.push({
      identifier,
      id: productsJson[key].id,
      size,
      qt: productQt
    })
  }
  cartShow()
  closeWindowProduct()
})
// ABRIR E FECHAR DO CARINHO DE COMPRA//
a('.menu-openner').addEventListener('click', () => {
  if (cart.length > 0) {
    a('aside').style.left = '0'
  }
})
a('.menu-openner ').addEventListener('click', () => {
  if (cart.length > 0) {
    a('.menu-desktop').classList.add('ativo')
  }
})

a('.menu-close i').addEventListener('click', () => {
  a('aside').style.left = '150vw'
})
a('.menu-close i').addEventListener('click', () => {
  a('.menu-desktop').classList.remove('ativo')
})
// FINALIZAR COMPRA //
a('.cart--finalizar').addEventListener('click', () => {
  cart = []
  cartShow()
  location.reload()
  alert('COMPRA FINALIZADA')
})
// ADICIONANDO PRODUTOS E INFORMAÇÕES DENTRO DO CARRINHO//
function cartShow() {
  a('.menu-openner span').innerHTML = cart.length
  if (cart.length > 0) {
    a('aside').classList.add('show')
    a('.menu-desktop').classList.add('ativo')
    a('.cart').innerHTML = ''
    let subtotal = 0
    let desconto = 0
    let total = 0
    cart.forEach((itemCart, index) => {
      let modelItem = productsJson.find(itemBD => itemBD.id == itemCart.id)
      subtotal += modelItem.price * itemCart.qt
      let cartItem = a('.models .cart--item').cloneNode(true)
      let modelSizeName
      switch (itemCart.size) {
        case 0:
          modelSizeName = 'P'
          break
        case 1:
          modelSizeName = 'M'
          break
        case 2:
          modelSizeName = 'G'
      }
      cartItem.querySelector('img').src = modelItem.img[0].src
      cartItem.querySelector(
        '.cart--item-nome'
      ).innerHTML = `${modelItem.name} - (${modelSizeName})`

      cartItem.querySelector('.cart--item--qt').innerHTML = itemCart.qt
      cartItem
        .querySelector('.cart--item-qtmenos')
        .addEventListener('click', () => {
          if (itemCart.qt > 1) {
            itemCart.qt--
          } else {
            cart.splice(index, 1)
          }
          cartShow()
          clearInput()
        })
      cartItem
        .querySelector('.cart--item--qtmais')
        .addEventListener('click', () => {
          itemCart.qt++
          cartShow()
          clearInput()
        })

      a('.cart').append(cartItem)

      a('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
      a('.total span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
      // VALIDANDO CUPOM DE DESCONTO//
      let cupom = document.querySelector('input')

      cupom.addEventListener('input', event => {
        let buttonAplicar = document.querySelector('.buttonAplicar')

        buttonAplicar.addEventListener('click', () => {
          desconto = subtotal * 0.1
          total = subtotal - desconto
          let codCupom = 'LADODICA10'
          let inputValue = event.target.value
          if (inputValue == codCupom) {
            a('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(
              2
            )}`
            a('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
            cupom.setAttribute('style', 'box-shadow: 0 0 15px #95d8d4')
            a('.msgError').style.display = 'none'
          } else {
            clearInput()
            cupom.setAttribute('style', 'box-shadow: 0 0 15px red')
            a('.msgError').style.display = 'block'
            a('.desconto span:last-child').innerHTML = 'R$--'
            a('.total span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
          }
        })
      })
    })
  } else {
    a('aside').classList.remove('show')
    a('.menu-desktop').classList.remove('ativo')
    a('aside').style.left = '150vw'
  }
}
//LIMPANDO CUPOM DE DESCONTO//
function clearInput() {
  let input = document.querySelector('input')
  input.getAttribute('value')
  input = input.value = ''
  a('.desconto span:last-child').innerHTML = 'R$--'
}

clearInput()

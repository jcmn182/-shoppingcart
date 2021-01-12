const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCart = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        paintCart()
    }
});
cards.addEventListener('click', e =>{
    addCarrito(e);
})

items.addEventListener('click' , e =>{
    btnaccion(e);
});
const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
       paintCards(data);
    }
    catch (error){
        console.log(error);
    }
}

const paintCards = data => {
     //console.log(data);
     data.forEach(product => {
         templateCard.querySelector('h5').textContent = product.title
         templateCard.querySelector('p').textContent = product.precio
         templateCard.querySelector('img').setAttribute('src', product.thumbnailUrl)
         templateCard.querySelector('.btn-dark').dataset.id = product.id
         const clone = templateCard.cloneNode(true)
         fragment.appendChild(clone)
     });
     cards.appendChild(fragment);
}

const addCarrito = e => {
    //console.log(e.target.classList.contains('btn-dark'));
    if (e.target.classList.contains('btn-dark')){
       // console.log(e.target.parentElement);
       setShoppingCart(e.target.parentElement);
    }
    e.stopPropagation();
}

const setShoppingCart = objeto => {

    const product = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    //console.log(product);
    if (carrito.hasOwnProperty(product.id)){
        product.cantidad = carrito[product.id].cantidad + 1;
    }
    carrito[product.id] = {...product}
    paintCart();
}

const paintCart = () =>{
    
    items.innerHTML = ''
    Object.values(carrito).forEach(producto =>
        {  
            templateCart.querySelector('th').textContent = producto.id
            templateCart.querySelectorAll('td')[0].textContent = producto.title
            templateCart.querySelectorAll('td')[1].textContent = producto.cantidad
            templateCart.querySelector('.btn-info').dataset.id = producto.id
            templateCart.querySelector('.btn-danger').dataset.id = producto.id
            templateCart.querySelector('span').textContent = producto.cantidad * producto.precio
            const clone = templateCart.cloneNode(true);
            fragment.appendChild(clone);
            
        }
        )
        items.appendChild(fragment);
        paintfooter();
        localStorage.setItem('carrito',JSON.stringify(carrito))
}

const paintfooter = () => {
    footer.innerHTML = ''
    
    if ( Object.keys(carrito).length === 0){
        footer.innerHTML =`
        <th scope="row" colspan="5"> vacío - comience a comprar!</th>
        `
        return
    }
    
    
    const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad,precio}) => acc + cantidad * precio, 0)
    
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio
    
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const emptycart = document.getElementById('vaciar-carrito')
    emptycart.addEventListener('click',() => {
        carrito = {}
        paintCart()
    })
    
    
}

const btnaccion = e => {
    if (e.target.classList.contains('btn-info')){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto};
        paintCart()
    }
    if (e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--
        if (producto.cantidad===0){
                delete carrito[e.target.dataset.id]
        }
        paintCart()
    }
    e.stopPropagation();
}
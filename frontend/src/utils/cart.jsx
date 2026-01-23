export function loadCart() {

    let cart = localStorage.getItem('cart')

    function formatDate(date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    function getDefaultCart() {
        return {
            orderedItems: [],
            days: 1,
            startingDate: formatDate(new Date()),
            endingDate: formatDate(new Date())
        }
    }

    if(cart == null) {
        cart = getDefaultCart()
        const cartString = JSON.stringify(cart)
        localStorage.setItem('cart', cartString)
        return cart
    }

    try {
        cart = JSON.parse(cart)
        // Validate cart structure - ensure orderedItems exists and is an array
        if (!cart || !Array.isArray(cart.orderedItems)) {
            cart = getDefaultCart()
            localStorage.setItem('cart', JSON.stringify(cart))
        }
    } catch (e) {
        cart = getDefaultCart()
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    
    return cart

}

export function addToCart(key, qty){
    const cart = loadCart()

    for(let i = 0; i < cart.orderedItems.length; i++){
        if(cart.orderedItems[i].key === key){
            cart.orderedItems[i].qty += qty
            const cartString = JSON.stringify(cart)
            localStorage.setItem('cart', cartString)
            return
        }
    }

    cart.orderedItems.push({key: key, qty: qty})
    const cartString = JSON.stringify(cart)
    localStorage.setItem('cart', cartString)
}

export function removeFromCart(key){
    const cart = loadCart()

    for(let i = 0; i < cart.orderedItems.length; i++){
        if(cart.orderedItems[i].key === key){
            cart.orderedItems.splice(i, 1)
            const cartString = JSON.stringify(cart)
            localStorage.setItem('cart', cartString)
            return
        }
    }
}

export function clearCart(){
    function formatDate(date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const cart = {
        orderedItems: [],
        days: 1,
        startingDate: formatDate(new Date()),
        endingDate: formatDate(new Date())
    }
    localStorage.setItem('cart', JSON.stringify(cart))
}

export function updateCartQty(key, newQty){
    const cart = loadCart()

    for(let i = 0; i < cart.orderedItems.length; i++){
        if(cart.orderedItems[i].key === key){
            if(newQty <= 0){
                cart.orderedItems.splice(i, 1)
            } else {
                cart.orderedItems[i].qty = newQty
            }
            const cartString = JSON.stringify(cart)
            localStorage.setItem('cart', cartString)
            return
        }
    }
}
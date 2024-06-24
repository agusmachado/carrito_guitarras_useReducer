import { db } from "../data/db";
import { CartItem, Guitar } from "../types";

export type CartActions =
    { type: 'add-to-cart', payload: {item: Guitar}} |
    { type: 'remove-from-cart', payload: {id: Guitar['id']}} |
    { type: 'decrease-quantity', payload: {id: Guitar['id']}} | 
    { type: 'increase-quantity', payload: {id: Guitar['id']}} |
    { type: 'clear-cart' }

export type CartState = {
    data: Guitar[]
    cart: CartItem[]
}

// Trabajamos sobre el local storage
const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
}

export const initialState : CartState = {
    data: db,
    cart: initialCart()
}

    const MIN_ITEMS = 1
    const MAX_ITEMS = 5

// Para tener buen autocompletado en el reducer
export const cartReducer = (
    state: CartState = initialState,
    action: CartActions
) => {
    if (action.type === "add-to-cart") {
        //console.log('Desde add-to-cart')
        //Cambiamos findIndex por find
        const itemExists = state.cart.find(guitar => guitar.id === action.payload.item.id)
        console.log(itemExists)

        let updatedCart : CartItem[] = []
        if( itemExists ) { // existe en el carrito
            updatedCart = state.cart.map( item => {
               if (item.id === action.payload.item.id) {
                if (item.quantity < MAX_ITEMS) {
                    //Si todavía no llegamos a MAX_ITEMS, podemos continuar agregando items
                    return { ...item, quantity: item.quantity + 1 }
                } else {
                    //Este item lo retornamos si ya pasamos los MAX_ITEMS
                    return item
                }
               } else {
                //Este es el elemento que no estamos agregando como repetido, pero que no queremos perder
                return item
               }
            })
        } else {
            const newItem : CartItem = {...action.payload.item, quantity : 1}
            updatedCart = [...state.cart, newItem]
        }
        return{
            ...state,
            cart: updatedCart
        }
    }

    if (action.type === "remove-from-cart") {
        const cart = state.cart.filter( item => item.id !== action.payload.id )
        return{
            ...state,
            cart
        }
    }

    if (action.type === "decrease-quantity") {
        
        const cart = state.cart.map( item => {
            if(item.id === action.payload.id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        return{
            ...state,
            cart
        }
    }

    if (action.type === "increase-quantity") {

        const cart = state.cart.map( item => {
            if(item.id === action.payload.id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        return{
            ...state,
            cart
        }
    }

    if (action.type === "clear-cart") {
        
        return{
            ...state,
            cart: []
        }
    }
    return state
}
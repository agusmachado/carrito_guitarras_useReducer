import { db } from "../data/db";
import { CartItem, Guitar } from "../types";

// Definimos los tipos de acciones que puede manejar el reducer
export type CartActions =
    { type: 'add-to-cart', payload: {item: Guitar}} |
    { type: 'remove-from-cart', payload: {id: Guitar['id']}} |
    { type: 'decrease-quantity', payload: {id: Guitar['id']}} | 
    { type: 'increase-quantity', payload: {id: Guitar['id']}} |
    { type: 'clear-cart' }

// Definimos el tipo del estado del carrito
export type CartState = {
    data: Guitar[]
    cart: CartItem[]
}

// Función para obtener el carrito inicial desde localStorage
const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
}

// Estado inicial del reducer
export const initialState : CartState = {
    data: db,
    cart: initialCart()
}

// Constantes para límites de cantidad de items en el carrito
const MIN_ITEMS = 1
const MAX_ITEMS = 5


// Reducer para manejar las acciones del carrito
// Para tener buen autocompletado en el reducer
export const cartReducer = (
    state: CartState = initialState,
    action: CartActions
) => {
    if (action.type === "add-to-cart") {
        //console.log('Desde add-to-cart')
        // Verificamos si el item ya existe en el carrito
        //Cambiamos findIndex por find
        const itemExists = state.cart.find(guitar => guitar.id === action.payload.item.id)
        console.log(itemExists)

        let updatedCart : CartItem[] = []
        if( itemExists ) { // Si el item ya existe en el carrito
            updatedCart = state.cart.map( item => {
               if (item.id === action.payload.item.id) {
                if (item.quantity < MAX_ITEMS) {
                    //Si todavía no llegamos a MAX_ITEMS, podemos continuar agregando items
                    return { ...item, quantity: item.quantity + 1 }
                } else {
                    //Este item lo retornamos si ya alcanzamos el máximo => MAX_ITEMS
                    return item
                }
               } else {
                //Este es el elemento que no estamos agregando como repetido, pero que no queremos perder
                // Retornamos los demás items sin cambios
                return item
               }
            })
        } else {
            // Si el item no existe en el carrito
            const newItem : CartItem = {...action.payload.item, quantity : 1}
            updatedCart = [...state.cart, newItem]
        }
        return{
            ...state,
            cart: updatedCart
        }
    }

    if (action.type === "remove-from-cart") {
        // Filtramos el item removido del carrito
        const cart = state.cart.filter( item => item.id !== action.payload.id )
        return{
            ...state,
            cart
        }
    }

    if (action.type === "decrease-quantity") {
        // Disminuimos la cantidad del item si es mayor que el mínimo permitido
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
        // Aumentamos la cantidad del item si es menor que el máximo permitido
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
        // Limpiamos el carrito
        return{
            ...state,
            cart: []
        }
    }
    // Retornamos el estado sin cambios si la acción no coincide
    return state
}
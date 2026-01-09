import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getCart, addToCartApi, updateCartItemApi, removeFromCartApi, syncCartApi, clearCartApi } from '../api'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export function CartProvider({ children }) {
    const [cart, setCart] = useState([])
    const { user } = useAuth()
    const token = user?.token

    const fetchRemoteCart = useCallback(async () => {
        if (!token) return
        try {
            // First sync local items if any
            const localCartString = localStorage.getItem("cart")
            if (localCartString) {
                try {
                    const localCart = JSON.parse(localCartString)
                    if (localCart.length > 0) {
                        await syncCartApi(localCart)
                    }
                    localStorage.removeItem("cart") // Clear after sync attempt (success or empty)
                } catch (syncErr) {
                    console.error("Failed to sync cart", syncErr)
                    // If it's a parse error or something else, we might want to clear it anyway to avoid loops
                    // If it's 401, it will be handled by auth
                }
            }

            const remoteCart = await getCart()
            // Transform remote cart structure to match local structure if needed
            const formattedCart = remoteCart.items.map(item => ({
                ...item.product,
                image: item.product.image_url,
                price: item.product.selling_price_with_gst,
                quantity: item.quantity
            }))
            setCart(formattedCart)
        } catch (err) {
            console.error("Failed to fetch cart", err)
        }
    }, [token])

    // Load cart from local storage on mount if no token
    useEffect(() => {
        if (!token) {
            const savedCart = localStorage.getItem("cart")
            if (savedCart) {
                setCart(JSON.parse(savedCart))
            } else {
                setCart([])
            }
        } else {
            fetchRemoteCart()
        }
    }, [token, fetchRemoteCart])

    // Save to local storage when cart changes (only if not logged in)
    useEffect(() => {
        if (!token) {
            localStorage.setItem("cart", JSON.stringify(cart))
        }
    }, [cart, token])

    const refreshCart = fetchRemoteCart

    const addToCart = useCallback(async (product) => {
        if (token) {
            try {
                await addToCartApi(product.id, 1)
                await fetchRemoteCart() // Refresh to get latest state
            } catch (err) {
                console.error("Failed to add to remote cart", err)
            }
        } else {
            setCart(prev => {
                const existing = prev.find(item => item.id === product.id)
                if (existing) {
                    return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
                }
                return [...prev, { ...product, quantity: 1 }]
            })
        }
    }, [token, fetchRemoteCart])

    const removeFromCart = useCallback(async (productId) => {
        if (token) {
            try {
                await removeFromCartApi(productId)
                await fetchRemoteCart()
            } catch (err) {
                console.error("Failed to remove from remote cart", err)
            }
        } else {
            setCart(prev => prev.filter(item => item.id !== productId))
        }
    }, [token, fetchRemoteCart])

    const updateQuantity = useCallback(async (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }

        if (token) {
            try {
                await updateCartItemApi(productId, quantity)
                await fetchRemoteCart()
            } catch (err) {
                console.error("Failed to update remote cart", err)
            }
        } else {
            setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item))
        }
    }, [token, fetchRemoteCart, removeFromCart])

    const clearCart = useCallback(async () => {
        if (token) {
            try {
                await clearCartApi() // backend clear
                setCart([])
            } catch (err) {
                console.error("Failed to clear remote cart", err)
            }
        } else {
            setCart([])
            localStorage.removeItem("cart")
        }
    }, [token])

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)



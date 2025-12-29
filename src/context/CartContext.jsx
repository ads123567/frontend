import { createContext, useContext, useState, useEffect } from 'react'
import { getCart, addToCartApi, updateCartItemApi, removeFromCartApi, syncCartApi } from '../api'

const CartContext = createContext()

export function CartProvider({ children }) {
    const [cart, setCart] = useState([])
    const [token, setToken] = useState(localStorage.getItem("token"))

    // Load cart from local storage on mount if no token
    useEffect(() => {
        if (!token) {
            const savedCart = localStorage.getItem("cart")
            if (savedCart) {
                setCart(JSON.parse(savedCart))
            }
        } else {
            fetchRemoteCart()
        }
    }, [token])

    // Save to local storage when cart changes (only if not logged in)
    useEffect(() => {
        if (!token) {
            localStorage.setItem("cart", JSON.stringify(cart))
        }
    }, [cart, token])

    // Listen for login/logout
    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem("token"))
        }
        window.addEventListener('storage', handleStorageChange)
        // Custom event for same-window login
        window.addEventListener('login-success', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('login-success', handleStorageChange)
        }
    }, [])

    const fetchRemoteCart = async () => {
        try {
            // First sync local items if any
            const localCart = JSON.parse(localStorage.getItem("cart") || "[]")
            if (localCart.length > 0) {
                await syncCartApi(token, localCart)
                localStorage.removeItem("cart") // Clear local after sync
            }

            const remoteCart = await getCart(token)
            // Transform remote cart structure to match local structure if needed
            // Remote: { items: [{ product: {...}, quantity: 1 }] }
            // Local: [{ id: 1, name: "...", quantity: 1 }]
            const formattedCart = remoteCart.items.map(item => ({
                ...item.product,
                quantity: item.quantity
            }))
            setCart(formattedCart)
        } catch (err) {
            console.error("Failed to fetch cart", err)
        }
    }

    const addToCart = async (product) => {
        if (token) {
            try {
                await addToCartApi(token, product.id, 1)
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
    }

    const removeFromCart = async (productId) => {
        if (token) {
            try {
                await removeFromCartApi(token, productId)
                await fetchRemoteCart()
            } catch (err) {
                console.error("Failed to remove from remote cart", err)
            }
        } else {
            setCart(prev => prev.filter(item => item.id !== productId))
        }
    }

    const updateQuantity = async (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }

        if (token) {
            try {
                await updateCartItemApi(token, productId, quantity)
                await fetchRemoteCart()
            } catch (err) {
                console.error("Failed to update remote cart", err)
            }
        } else {
            setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item))
        }
    }

    const clearCart = () => {
        setCart([])
        if (!token) localStorage.removeItem("cart")
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)

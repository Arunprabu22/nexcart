import React from 'react'

const CartContext = React.createContext({
  cartList: [],
  addCartItem: () => {},
  deleteCartItem: () => {},
  incrementCartItemQuantity: () => {},
  decrementCartItemQuantity: () => {},
  budgetLimit: 0,
  setBudgetLimit: () => {},
  // --- NEW: COMPARE CONTEXT ---
  compareList: [],
  addCompareItem: () => {},
  removeCompareItem: () => {},
})

export default CartContext

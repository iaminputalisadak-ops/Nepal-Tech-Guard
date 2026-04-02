import React, { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId && i.variantId === (action.payload.variantId || null)
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }] };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.payload.productId && i.variantId === (action.payload.variantId ?? null)
            ? { ...i, quantity: Math.max(0, action.payload.quantity) }
            : i
        ).filter((i) => i.quantity > 0),
      };
    case 'REMOVE':
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.productId === action.payload.productId && i.variantId === (action.payload.variantId ?? null))
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

const stored = (() => {
  try {
    const s = localStorage.getItem('nepal_techguard_cart');
    return s ? JSON.parse(s) : { items: [] };
  } catch {
    return { items: [] };
  }
})();

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, stored);

  const persist = useCallback(() => {
    try {
      localStorage.setItem('nepal_techguard_cart', JSON.stringify({ items: state.items }));
    } catch (_) {}
  }, [state.items]);

  React.useEffect(() => persist(), [persist]);

  const addItem = useCallback((item) => {
    dispatch({
      type: 'ADD',
      payload: {
        productId: item.productId,
        variantId: item.variantId ?? null,
        productName: item.productName,
        variantName: item.variantName ?? null,
        imageUrl: item.imageUrl ?? null,
        unitPrice: item.unitPrice,
        quantity: item.quantity ?? 1,
      },
    });
  }, []);

  const updateQty = useCallback((productId, variantId, quantity) => {
    dispatch({ type: 'UPDATE_QTY', payload: { productId, variantId, quantity } });
  }, []);

  const removeItem = useCallback((productId, variantId = null) => {
    dispatch({ type: 'REMOVE', payload: { productId, variantId } });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = state.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  const value = {
    items: state.items,
    totalItems,
    totalAmount,
    addItem,
    updateQty,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

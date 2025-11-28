import {Component} from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import {supabase} from './lib/supabaseClient'

import LoginForm from './components/LoginForm'
import SignUpForm from './components/SignUpForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'
import SmartBudgetBundle from './components/SmartBudgetBundle'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
    user: null,
    budgetLimit: 0,
    compareList: [], // New State for Comparison
  }

  componentDidMount() {
    this.checkSession()
    this.authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        this.setState({user: session.user}, this.fetchUserCart)
      } else if (event === 'SIGNED_OUT') {
        this.setState({
          cartList: [],
          user: null,
          budgetLimit: 0,
          compareList: [],
        })
      }
    })
  }

  componentWillUnmount() {
    if (
      this.authListener &&
      this.authListener.data &&
      this.authListener.data.subscription
    ) {
      this.authListener.data.subscription.unsubscribe()
    }
  }

  checkSession = async () => {
    const {
      data: {session},
    } = await supabase.auth.getSession()
    if (session) {
      this.setState({user: session.user}, this.fetchUserCart)
    }
  }

  fetchUserCart = async () => {
    const {user} = this.state
    if (!user) return
    const {data, error} = await supabase
      .from('users')
      .select('cart')
      .eq('id', user.id)
      .single()
    if (!error && data && data.cart) {
      this.setState({cartList: data.cart})
    }
  }

  syncCartToDB = async newCartList => {
    const {user} = this.state
    if (!user) return
    await supabase.from('users').update({cart: newCartList}).eq('id', user.id)
  }

  calculateTotal = cartList =>
    cartList.reduce((acc, item) => acc + item.price * item.quantity, 0)

  setBudgetLimit = amount => {
    this.setState({budgetLimit: parseInt(amount, 10)})
  }

  // --- CART ACTIONS ---

  addCartItem = product => {
    this.setState(prevState => {
      const {cartList, budgetLimit} = prevState
      let potentialTotal = 0
      const productObject = cartList.find(item => item.id === product.id)

      if (productObject) {
        potentialTotal =
          this.calculateTotal(cartList) + product.price * product.quantity
      } else {
        potentialTotal =
          this.calculateTotal(cartList) + product.price * product.quantity
      }

      if (budgetLimit > 0 && potentialTotal > budgetLimit) {
        // eslint-disable-next-line no-alert
        alert(
          `⚠️ Budget Warning!\n\nAdding this item will exceed your budget of ₹${budgetLimit}.`,
        )
      }

      let updatedCartList
      if (productObject) {
        updatedCartList = cartList.map(eachCartItem => {
          if (productObject.id === eachCartItem.id) {
            const updatedQuantity = eachCartItem.quantity + product.quantity
            return {...eachCartItem, quantity: updatedQuantity}
          }
          return eachCartItem
        })
      } else {
        updatedCartList = [...cartList, product]
      }

      this.syncCartToDB(updatedCartList)
      return {cartList: updatedCartList}
    })
  }

  deleteCartItem = id => {
    this.setState(prevState => {
      const updatedCartList = prevState.cartList.filter(
        eachCartItem => eachCartItem.id !== id,
      )
      this.syncCartToDB(updatedCartList)
      return {cartList: updatedCartList}
    })
  }

  incrementCartItemQuantity = id => {
    this.setState(prevState => {
      const {cartList, budgetLimit} = prevState
      const item = cartList.find(i => i.id === id)
      const currentTotal = this.calculateTotal(cartList)

      if (budgetLimit > 0 && currentTotal + item.price > budgetLimit) {
        // eslint-disable-next-line no-alert
        alert(`⚠️ Budget Exceeded!\n\nYou set a limit of ₹${budgetLimit}.`)
      }

      const updatedCartList = cartList.map(eachCartItem => {
        if (id === eachCartItem.id) {
          const updatedQuantity = eachCartItem.quantity + 1
          return {...eachCartItem, quantity: updatedQuantity}
        }
        return eachCartItem
      })
      this.syncCartToDB(updatedCartList)
      return {cartList: updatedCartList}
    })
  }

  decrementCartItemQuantity = id => {
    this.setState(prevState => {
      const updatedCartList = prevState.cartList.map(eachCartItem => {
        if (id === eachCartItem.id) {
          const updatedQuantity = eachCartItem.quantity - 1
          if (updatedQuantity < 1) return eachCartItem
          return {...eachCartItem, quantity: updatedQuantity}
        }
        return eachCartItem
      })
      this.syncCartToDB(updatedCartList)
      return {cartList: updatedCartList}
    })
  }

  // --- NEW: COMPARE LOGIC ---
  addCompareItem = product => {
    this.setState(prevState => {
      const {compareList} = prevState
      if (compareList.find(item => item.id === product.id)) {
        // eslint-disable-next-line no-alert
        alert('Item already in compare list!')
        return null
      }
      if (compareList.length >= 2) {
        // eslint-disable-next-line no-alert
        alert('You can only compare 2 products at a time. Remove one first.')
        return null
      }
      return {compareList: [...compareList, product]}
    })
  }

  removeCompareItem = id => {
    this.setState(prevState => ({
      compareList: prevState.compareList.filter(item => item.id !== id),
    }))
  }

  render() {
    const {cartList, budgetLimit, compareList} = this.state
    return (
      <BrowserRouter>
        <CartContext.Provider
          value={{
            cartList,
            addCartItem: this.addCartItem,
            deleteCartItem: this.deleteCartItem,
            incrementCartItemQuantity: this.incrementCartItemQuantity,
            decrementCartItemQuantity: this.decrementCartItemQuantity,
            budgetLimit,
            setBudgetLimit: this.setBudgetLimit,
            compareList,
            addCompareItem: this.addCompareItem,
            removeCompareItem: this.removeCompareItem,
          }}
        >
          <Switch>
            <Route exact path="/login" component={LoginForm} />
            <Route exact path="/register" component={SignUpForm} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute exact path="/products" component={Products} />
            <ProtectedRoute
              exact
              path="/products/:id"
              component={ProductItemDetails}
            />
            <ProtectedRoute exact path="/cart" component={Cart} />
            <ProtectedRoute
              exact
              path="/smart-bundle"
              component={SmartBudgetBundle}
            />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="not-found" />
          </Switch>
        </CartContext.Provider>
      </BrowserRouter>
    )
  }
}

export default App

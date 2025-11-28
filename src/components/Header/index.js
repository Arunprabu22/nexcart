import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {supabase} from '../../lib/supabaseClient'
import CartContext from '../../context/CartContext'
import './index.css'

const Header = props => {
  const onClickLogout = async () => {
    const {history} = props
    await supabase.auth.signOut()
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const renderCartItemsCount = () => (
    <CartContext.Consumer>
      {value => {
        const {cartList} = value
        const cartItemsCount = cartList.length
        return (
          <>
            {cartItemsCount > 0 ? (
              <span className="cart-count-badge">{cartList.length}</span>
            ) : null}
          </>
        )
      }}
    </CartContext.Consumer>
  )

  return (
    <CartContext.Consumer>
      {value => {
        const {budgetLimit, setBudgetLimit} = value

        const onChangeBudget = e => {
          setBudgetLimit(e.target.value)
        }

        return (
          <nav className="nav-header">
            <div className="nav-content">
              <div className="nav-bar-mobile-logo-container">
                <Link to="/" style={{textDecoration: 'none'}}>
                  <h1
                    style={{
                      color: '#0b69ff',
                      fontFamily: 'Roboto',
                      fontWeight: 'bold',
                      fontSize: '24px',
                      margin: 0,
                    }}
                  >
                    NexCart
                  </h1>
                </Link>
                <button type="button" className="nav-mobile-btn">
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png"
                    alt="nav logout"
                    className="nav-bar-image"
                    onClick={onClickLogout}
                  />
                </button>
              </div>

              <div className="nav-bar-large-container">
                <Link to="/" style={{textDecoration: 'none'}}>
                  <h1
                    style={{
                      color: '#0b69ff',
                      fontFamily: 'Roboto',
                      fontWeight: 'bold',
                      fontSize: '24px',
                      margin: 0,
                    }}
                  >
                    NexCart
                  </h1>
                </Link>
                <ul className="nav-menu">
                  <li className="nav-menu-item">
                    <Link to="/" className="nav-link">
                      Home
                    </Link>
                  </li>
                  <li className="nav-menu-item">
                    <Link to="/products" className="nav-link">
                      Products
                    </Link>
                  </li>

                  {/* --- NEW: BUDGET INPUT --- */}
                  <li
                    className="nav-menu-item"
                    style={{display: 'flex', alignItems: 'center'}}
                  >
                    <span
                      style={{
                        marginRight: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#475569',
                      }}
                    >
                      Max Budget:
                    </span>
                    <input
                      type="number"
                      placeholder="Set Limit"
                      className="budget-setter-input"
                      value={budgetLimit > 0 ? budgetLimit : ''}
                      onChange={onChangeBudget}
                    />
                  </li>
                  {/* ------------------------- */}

                  <li className="nav-menu-item">
                    <Link to="/cart" className="nav-link">
                      Cart
                      {renderCartItemsCount()}
                    </Link>
                  </li>
                </ul>
                <button
                  type="button"
                  className="logout-desktop-btn"
                  onClick={onClickLogout}
                >
                  Logout
                </button>
              </div>
            </div>
            {/* Mobile Nav (Simplified) */}
            <div className="nav-menu-mobile">
              <ul className="nav-menu-list-mobile">
                <li className="nav-menu-item-mobile">
                  <Link to="/" className="nav-link">
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-home-icon.png"
                      alt="nav home"
                      className="nav-bar-image"
                    />
                  </Link>
                </li>
                <li className="nav-menu-item-mobile">
                  <Link to="/products" className="nav-link">
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-products-icon.png"
                      alt="nav products"
                      className="nav-bar-image"
                    />
                  </Link>
                </li>
                <li className="nav-menu-item-mobile">
                  <Link to="/cart" className="nav-link">
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-cart-icon.png"
                      alt="nav cart"
                      className="nav-bar-image"
                    />
                    {renderCartItemsCount()}
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        )
      }}
    </CartContext.Consumer>
  )
}

export default withRouter(Header)

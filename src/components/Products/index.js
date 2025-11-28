import {Component} from 'react'
import {supabase} from '../../lib/supabaseClient'
import CartContext from '../../context/CartContext'

import AllProductsSection from '../AllProductsSection'
import PrimeDealsSection from '../PrimeDealsSection'
import Header from '../Header'
import CompareModal from '../CompareModal' // Import Modal

import './index.css'

class Products extends Component {
  state = {
    isPrimeUser: false,
    isLoading: true,
    showCompareModal: false, // State to toggle modal
  }

  componentDidMount() {
    this.checkUserStatus()
  }

  checkUserStatus = async () => {
    const {
      data: {user},
    } = await supabase.auth.getUser()

    if (user && user.user_metadata && user.user_metadata.is_prime) {
      this.setState({isPrimeUser: true, isLoading: false})
    } else {
      this.setState({isPrimeUser: false, isLoading: false})
    }
  }

  toggleCompareModal = () => {
    this.setState(prevState => ({
      showCompareModal: !prevState.showCompareModal,
    }))
  }

  renderNonPrimePoster = () => (
    <div
      className="prime-poster-container"
      style={{
        backgroundImage: 'linear-gradient(to right, #6b21a8, #a855f7)',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      }}
    >
      <div>
        <h1 style={{fontSize: '32px', margin: '0 0 10px 0'}}>
          Join Prime Today!
        </h1>
        <p style={{fontSize: '18px', margin: 0}}>
          Get Exclusive Access to Limited Time Deals & Fast Delivery.
        </p>
        <button
          type="button"
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: 'white',
            color: '#6b21a8',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Upgrade Now
        </button>
      </div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
        alt="prime exclusive"
        style={{height: '150px', objectFit: 'contain'}}
      />
    </div>
  )

  render() {
    const {isPrimeUser, isLoading, showCompareModal} = this.state

    return (
      <CartContext.Consumer>
        {value => {
          const {compareList} = value
          return (
            <>
              <Header />
              <div className="product-sections">
                {!isLoading &&
                  (isPrimeUser ? (
                    <PrimeDealsSection />
                  ) : (
                    this.renderNonPrimePoster()
                  ))}

                <AllProductsSection />

                {/* COMPARE MODAL & TRIGGER */}
                {showCompareModal && (
                  <CompareModal onClose={this.toggleCompareModal} />
                )}

                {compareList.length > 0 && !showCompareModal && (
                  <div className="compare-floating-bar">
                    <p>{compareList.length} item(s) selected for comparison</p>
                    <button
                      type="button"
                      className="compare-trigger-btn"
                      onClick={this.toggleCompareModal}
                    >
                      Compare Now
                    </button>
                  </div>
                )}
              </div>
            </>
          )
        }}
      </CartContext.Consumer>
    )
  }
}

export default Products

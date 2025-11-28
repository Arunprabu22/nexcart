import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProductCard from '../ProductCard'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class SmartBudgetBundle extends Component {
  state = {
    budget: '',
    generatedBundle: [],
    bundleTotal: 0,
    apiStatus: apiStatusConstants.initial,
    productsList: [],
  }

  componentDidMount() {
    this.getAllProducts()
  }

  getAllProducts = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    // 1. Silent Login to get Academy Token
    let academyToken = ''
    try {
      const loginRes = await fetch('https://apis.ccbp.in/login', {
        method: 'POST',
        body: JSON.stringify({username: 'rahul', password: 'rahul@2021'}),
      })
      const loginData = await loginRes.json()
      if (loginRes.ok) academyToken = loginData.jwt_token
    } catch (e) {
      console.error('Token fetch failed', e)
    }

    // 2. Fetch Products sorted by price (Low to High helps the algorithm)
    const apiUrl = `https://apis.ccbp.in/products?sort_by=PRICE_LOW`
    const options = {
      headers: {Authorization: `Bearer ${academyToken}`},
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  // --- ALGORITHM: Smart Bundle Logic ---
  generateBundle = () => {
    const {budget, productsList} = this.state
    const budgetAmount = parseInt(budget, 10)

    if (!budgetAmount || budgetAmount <= 0) {
      // eslint-disable-next-line no-alert
      alert('Please enter a valid budget!')
      return
    }

    let currentTotal = 0
    const bundle = []
    // Shuffle products to get a different combo every time
    const shuffledProducts = [...productsList].sort(() => 0.5 - Math.random())

    // Simple Greedy Algorithm: Add items until budget runs out
    shuffledProducts.forEach(product => {
      if (currentTotal + product.price <= budgetAmount) {
        bundle.push(product)
        currentTotal += product.price
      }
    })

    if (bundle.length === 0) {
      // eslint-disable-next-line no-alert
      alert('Your budget is too low for our premium products!')
    }

    this.setState({generatedBundle: bundle, bundleTotal: currentTotal})
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="error-view">
      <h1>Oops! Could not load data.</h1>
    </div>
  )

  renderBundleView = () => {
    const {generatedBundle, bundleTotal, budget} = this.state

    return (
      <div className="bundle-container">
        <div className="budget-input-section">
          <h1 className="bundle-heading">Smart Budget Bundle 🧠</h1>
          <p className="bundle-description">
            Enter your total budget, and our AI algorithm will curate the
            perfect shopping package for you.
          </p>

          <div className="input-wrapper">
            <input
              type="number"
              className="budget-input"
              placeholder="Enter Amount (e.g. 5000)"
              value={budget}
              onChange={e => this.setState({budget: e.target.value})}
            />
            <button
              className="generate-btn"
              type="button"
              onClick={this.generateBundle}
            >
              Generate Bundle
            </button>
          </div>
        </div>

        {generatedBundle.length > 0 && (
          <div className="bundle-results">
            <div className="results-header">
              <h2>Your Curated Package</h2>
              <div className="price-badge">
                Total: Rs {bundleTotal}/-{' '}
                <span className="saved-badge">
                  (Saved: Rs {parseInt(budget, 10) - bundleTotal})
                </span>
              </div>
            </div>

            <ul className="products-list">
              {generatedBundle.map(product => (
                <ProductCard productData={product} key={product.id} />
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state
    return (
      <>
        <Header />
        <div className="smart-bundle-page">
          {apiStatus === apiStatusConstants.inProgress &&
            this.renderLoadingView()}
          {apiStatus === apiStatusConstants.failure && this.renderFailureView()}
          {apiStatus === apiStatusConstants.success && this.renderBundleView()}
        </div>
      </>
    )
  }
}

export default SmartBudgetBundle

import {Link} from 'react-router-dom'
import CartContext from '../../context/CartContext'
import './index.css'

const ProductCard = props => {
  const {productData} = props
  const {title, brand, imageUrl, rating, price, id} = productData

  return (
    <CartContext.Consumer>
      {value => {
        const {addCompareItem, compareList, removeCompareItem} = value

        // Check if this specific product is already in the comparison list
        const isSelected = compareList.find(item => item.id === id)

        const onCompareClick = e => {
          e.preventDefault() // Prevent Link navigation
          if (isSelected) {
            removeCompareItem(id)
          } else {
            addCompareItem(productData)
          }
        }

        return (
          <Link to={`/products/${id}`} className="link-item">
            <li className="product-item">
              <div
                className="thumbnail-container"
                style={{position: 'relative'}}
              >
                <img src={imageUrl} alt="product" className="thumbnail" />

                {/* COMPARE TOGGLE BUTTON */}
                <button
                  type="button"
                  onClick={onCompareClick}
                  className={`compare-toggle-btn ${isSelected ? 'active' : ''}`}
                  title={isSelected ? 'Remove from Compare' : 'Add to Compare'}
                >
                  {isSelected ? '✓' : '+'} VS
                </button>
              </div>

              <h1 className="title">{title}</h1>
              <p className="brand">by {brand}</p>
              <div className="product-details">
                <p className="price">Rs {price}/-</p>
                <div className="rating-container">
                  <p className="rating">{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star"
                  />
                </div>
              </div>
            </li>
          </Link>
        )
      }}
    </CartContext.Consumer>
  )
}
export default ProductCard

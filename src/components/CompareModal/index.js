import {AiOutlineClose} from 'react-icons/ai'
import CartContext from '../../context/CartContext'
import './index.css'

const CompareModal = props => (
  <CartContext.Consumer>
    {value => {
      const {compareList, removeCompareItem} = value
      const {onClose} = props

      if (compareList.length === 0) return null

      return (
        <div className="compare-modal-overlay">
          <div className="compare-modal-container">
            <div className="compare-header">
              <h2>Compare Products ({compareList.length}/2)</h2>
              <button
                type="button"
                className="close-modal-btn"
                onClick={onClose}
              >
                <AiOutlineClose size={24} />
              </button>
            </div>

            <div className="compare-grid">
              {compareList.map(product => (
                <div key={product.id} className="compare-card">
                  <div className="compare-image-wrapper">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="compare-image"
                    />
                    <button
                      type="button"
                      className="remove-compare-btn"
                      onClick={() => removeCompareItem(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <h3 className="compare-title">{product.title}</h3>
                  <p className="compare-price">Rs {product.price}/-</p>
                  <div className="compare-stats">
                    <div className="stat-row">
                      <span className="stat-label">Brand</span>
                      <span className="stat-value">{product.brand}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Rating</span>
                      <span className="stat-value">{product.rating} ★</span>
                    </div>
                  </div>
                </div>
              ))}

              {compareList.length === 1 && (
                <div className="compare-card empty-slot">
                  <p>Add another product to compare</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }}
  </CartContext.Consumer>
)

export default CompareModal

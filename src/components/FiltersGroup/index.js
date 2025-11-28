import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import './index.css'

class FiltersGroup extends Component {
  onEnterSearchInput = event => {
    const {enterSearchInput} = this.props
    if (event.key === 'Enter') {
      enterSearchInput()
    }
  }

  onChangeSearchInput = event => {
    const {changeSearchInput} = this.props
    changeSearchInput(event.target.value)
  }

  renderSearchInput = () => {
    const {searchInput} = this.props
    return (
      <div className="search-input-container">
        <input
          value={searchInput}
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <BsSearch className="search-icon" />
      </div>
    )
  }

  renderRatingsFiltersList = () => {
    const {ratingsList} = this.props
    return ratingsList.map(rating => {
      const {changeRating, activeRatingId} = this.props
      const onClickRatingItem = () => changeRating(rating.ratingId)
      const ratingClassName =
        activeRatingId === rating.ratingId ? `and-up active-rating` : `and-up`
      return (
        <li
          className="rating-item"
          key={rating.ratingId}
          onClick={onClickRatingItem}
        >
          <img
            src={rating.imageUrl}
            alt={`rating ${rating.ratingId}`}
            className="rating-image"
          />
          <p className={ratingClassName}>& up</p>
        </li>
      )
    })
  }

  renderRatingsFilters = () => (
    <div>
      <h1 className="rating-heading">Rating</h1>
      <ul className="ratings-list">{this.renderRatingsFiltersList()}</ul>
    </div>
  )

  renderCategoriesList = () => {
    const {categoryOptions} = this.props
    return categoryOptions.map(category => {
      const {changeCategory, activeCategoryId} = this.props
      const onClickCategoryItem = () => changeCategory(category.categoryId)
      const isActive = category.categoryId === activeCategoryId
      const categoryClassName = isActive
        ? `category-name active-category-name`
        : `category-name`
      return (
        <li
          className="category-item"
          key={category.categoryId}
          onClick={onClickCategoryItem}
        >
          <p className={categoryClassName}>{category.name}</p>
        </li>
      )
    })
  }

  renderProductCategories = () => (
    <>
      <h1 className="category-heading">Category</h1>
      <ul className="categories-list">{this.renderCategoriesList()}</ul>
    </>
  )

  renderPriceFilters = () => {
    const {minPrice, maxPrice, changeMinPrice, changeMaxPrice} = this.props
    return (
      <div className="price-filter-container">
        <h1 className="rating-heading">Price Range</h1>
        <div className="price-inputs-container">
          <input
            type="number"
            className="price-input"
            placeholder="Min"
            value={minPrice}
            onChange={e => changeMinPrice(e.target.value)}
          />
          <span className="price-separator">-</span>
          <input
            type="number"
            className="price-input"
            placeholder="Max"
            value={maxPrice}
            onChange={e => changeMaxPrice(e.target.value)}
          />
        </div>
      </div>
    )
  }

  render() {
    const {clearFilters} = this.props

    return (
      <div className="filters-group-container">
        {this.renderSearchInput()}
        {this.renderProductCategories()}
        {this.renderPriceFilters()}
        {this.renderRatingsFilters()}
        <button
          type="button"
          className="clear-filters-btn"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>
    )
  }
}

export default FiltersGroup

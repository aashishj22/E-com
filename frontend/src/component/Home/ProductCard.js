import React from 'react';
import { Link } from 'react-router-dom';
import { Rating } from '@material-ui/lab';

const ProductCard = ({ product }) => {
  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <>
      <Link className="productCard" to={`/product/${product._id}`}>
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0].url} alt={product.name} />
        ) : (
          <img src="placeholder_image_url" alt="Placeholder" />
        )}
        <p>{product.name}</p>
        <div>
          <Rating {...options} />{' '}
          <span className="productCardSpan">
            {' '}
            ({product.numOfReviews} Reviews)
          </span>
        </div>
        <span>{`₹${product.price}`}</span>
      </Link>
    </>
  );
};

export default ProductCard;

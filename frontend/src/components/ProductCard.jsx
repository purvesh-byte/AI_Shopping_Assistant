import React from 'react';

const ProductCard = ({ product, isSelected, onToggleSelect }) => {
  return (
    <div className={`glass-panel product-card ${isSelected ? 'selected' : ''}`} style={isSelected ? { borderColor: 'var(--accent-purple)', boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' } : {}}>
      <div className="product-image-container">
        <div className="product-badge">{product.category}</div>
        {product.platform && (
          <div className="platform-badge" title={`Sourced from ${product.platform}`}>
            {product.platformBadgeUrl ? <img src={product.platformBadgeUrl} alt={product.platform} /> : <span>{product.platform}</span>}
          </div>
        )}
        <img 
          src={product.imageUrl || `https://source.unsplash.com/400x300/?${product.category || 'tech'}`} 
          alt={product.name} 
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80';
          }}
        />
      </div>
      
      <div className="product-header">
        <div>
          <h3 className="product-title">{product.name}</h3>
          <p className="product-brand">{product.brand}</p>
        </div>
        <div className="product-price">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
        </div>
      </div>
      
      <ul className="attributes-list">
        {product.attributes && Object.entries(product.attributes).map(([key, value]) => (
          <li key={key}>
            <span className="attr-key">{key}</span>
            <span className="attr-val">{value}</span>
          </li>
        ))}
      </ul>
      
      <button 
        className="btn-compare"
        onClick={() => onToggleSelect(product)}
        style={isSelected ? { background: '#ef4444' } : {}}
      >
        {isSelected ? 'Remove from Comparison' : 'Add to Comparison'}
      </button>
    </div>
  );
};

export default ProductCard;

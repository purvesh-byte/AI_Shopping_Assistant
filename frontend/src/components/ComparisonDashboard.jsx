import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const mockData = [
  {
    _id: '1',
    name: 'ProVision X1',
    brand: 'TechNova',
    price: 105000,
    category: 'Laptops',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
    attributes: {
      'Processor': 'M2 Max',
      'RAM': '32GB Unified',
      'Storage': '1TB NVMe',
      'Display': '14" Mini-LED 120Hz'
    }
  },
  {
    _id: '2',
    name: 'ZenBook Ultra',
    brand: 'Aura',
    price: 95500,
    category: 'Laptops',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
    attributes: {
      'Processor': 'Core i9 13th Gen',
      'RAM': '16GB DDR5',
      'Storage': '512GB PCIe 4.0',
      'Display': '15.6" OLED 90Hz'
    }
  },
  {
    _id: '3',
    name: 'Stealth Blade 15',
    brand: 'Rogue',
    price: 155000,
    category: 'Laptops',
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80',
    attributes: {
      'Processor': 'Ryzen 9 7900',
      'RAM': '32GB DDR5',
      'Storage': '2TB NVMe',
      'Display': '15" QHD 240Hz'
    }
  }
];

const ComparisonDashboard = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonData, setComparisonData] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let data = mockData;
        let endpoint = 'http://localhost:5000/api/products';
        
        if (searchQuery) {
          endpoint = `http://localhost:5000/api/products/external-search?query=${encodeURIComponent(searchQuery)}`;
          data = []; // Clear mock data for active searches so we see actual results (or empty state)
        }

        try {
          const res = await fetch(endpoint);
          if (res.ok) {
            const json = await res.json();
            if (json.data && json.data.length > 0) {
              data = json.data;
            } else if (searchQuery) {
              // Empty search result from active backend
              data = [];
            }
          }
        } catch (e) {
          console.log('Backend not completely hooked up yet. Showing fallback if available.');
        }

        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    // Add slight fake delay for premium loading animation
    const timerId = setTimeout(fetchProducts, searchQuery ? 300 : 800);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products/recommendations');
        if (res.ok) {
          const json = await res.json();
          setRecommendations(json.data || []);
        }
      } catch (e) {
        setRecommendations([]);
      }
    };
    fetchRecommendations();
  }, []);

  const toggleSelect = (product) => {
    setSelectedForCompare(prev => {
      const isSelected = prev.some(p => p._id === product._id);
      if (isSelected) {
        return prev.filter(p => p._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const executeComparison = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: selectedForCompare.map(p => p._id),
          category: selectedForCompare[0]?.category || 'mixed'
        })
      });
      
      if (res.ok) {
        const json = await res.json();
        setComparisonData(json.data || selectedForCompare);
      } else {
        setComparisonData(selectedForCompare);
      }
      setIsComparing(true);
    } catch (e) {
      console.error(e);
      setComparisonData(selectedForCompare);
      setIsComparing(true);
    }
  };

  if (loading && !products.length) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (isComparing) {
    const allAttributes = new Set();
    comparisonData.forEach(p => {
      if (p.attributes) {
        Object.keys(p.attributes).forEach(k => allAttributes.add(k));
      }
    });
    const attributeKeys = Array.from(allAttributes);

    return (
      <div className="comparison-view glass-panel fade-in">
        <div className="comparison-header">
          <button className="back-btn" onClick={() => setIsComparing(false)}>
            ← Back to Dashboard
          </button>
          <h2 className="section-title">AI Product Comparison</h2>
        </div>
        
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="feature-col-header">Features</th>
                {comparisonData.map(p => (
                  <th key={p._id} className="product-col-header">
                    <div className="compare-img-container">
                      <img src={p.imageUrl} alt={p.name} className="compare-img" />
                      {p.platform && <span className="platform-badge compare-badge">{p.platform}</span>}
                    </div>
                    <h3 className="compare-title">{p.name}</h3>
                    <div className="compare-brand">{p.brand}</div>
                    <div className="compare-price">₹{p.price?.toLocaleString('en-IN') || 'N/A'}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attributeKeys.map(key => (
                <tr key={key}>
                  <td className="attribute-key">{key}</td>
                  {comparisonData.map(p => (
                    <td key={p._id} className="attribute-val">
                      {p.attributes?.[key] || <span className="text-muted">-</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }


  return (
    <div>
      {!searchQuery && recommendations.length > 0 && (
        <div className="recommendations-section">
          <h2 className="section-title">Recommended Based on Your Behavior</h2>
          <div className="dashboard-grid" style={{ marginBottom: '3rem' }}>
            {recommendations.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                isSelected={selectedForCompare.some(p => p._id === product._id)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>
          <hr className="section-divider" />
        </div>
      )}

      <div className="dashboard-grid">
        {products.map(product => (
          <ProductCard 
            key={product._id} 
            product={product} 
            isSelected={selectedForCompare.some(p => p._id === product._id)}
            onToggleSelect={toggleSelect}
          />
        ))}
      </div>

      <div className={`comparison-tray ${selectedForCompare.length > 0 ? 'active' : ''}`}>
        <div className="tray-title">
          {selectedForCompare.length} Product{selectedForCompare.length > 1 ? 's' : ''} Selected for AI Comparison
        </div>
        <button 
          className="tray-btn" 
          disabled={selectedForCompare.length < 2}
          onClick={executeComparison}
          style={{ opacity: selectedForCompare.length < 2 ? 0.5 : 1 }}
        >
          {selectedForCompare.length < 2 ? 'Select at least 2' : 'Compare Now'}
        </button>
      </div>
    </div>
  );
};

export default ComparisonDashboard;

import React from 'react';

const ShopEmptyState: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => (
  <div className="text-center py-12">
    <div className={`text-6xl mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>🔍</div>
    <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Aucun produit trouvé</h3>
    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Essayez de modifier vos critères de recherche.</p>
  </div>
);

export default ShopEmptyState;

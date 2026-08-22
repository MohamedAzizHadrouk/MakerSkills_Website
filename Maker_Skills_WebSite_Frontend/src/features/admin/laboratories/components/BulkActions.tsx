import React from 'react';
import { Trash2, X } from 'lucide-react';
import { BulkActionsProps } from '../types/laboratory';
import { ConfirmDialog } from '../../../../shared';

const BulkActions: React.FC<BulkActionsProps> = ({
  theme,
  selectedLaboratories,
  onBulkDelete,
  onClearSelection
}) => {
  if (selectedLaboratories.length === 0) {
    return null;
  }

  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = React.useState(false);

  const handleBulkDelete = () => {
    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = () => {
    onBulkDelete();
    setShowBulkDeleteConfirm(false);
  };

  const cancelBulkDelete = () => {
    setShowBulkDeleteConfirm(false);
  };

  return (
    <>
      <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-2xl rounded-xl border ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      } p-4`}>
        <div className="flex items-center space-x-4">
          <div className={`text-sm font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {selectedLaboratories.length} laboratoire(s) sélectionné(s)
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleBulkDelete}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
              title="Supprimer les laboratoires sélectionnés"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer</span>
            </button>

            <button
              onClick={onClearSelection}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Effacer la sélection"
            >
              <X className="w-4 h-4" />
              <span>Effacer</span>
            </button>
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={showBulkDeleteConfirm}
        title="Supprimer les laboratoires sélectionnés"
        message={`Êtes-vous sûr de vouloir supprimer ${selectedLaboratories.length} laboratoire(s) ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        onConfirm={confirmBulkDelete}
        onCancel={cancelBulkDelete}
      />
    </>
  );
};

export default BulkActions;


import React from 'react';
import { Trash2, Eye, EyeOff, X } from 'lucide-react';
import { BulkActionsProps } from '../types/service';
import { ConfirmDialog } from '../../../../shared';

const BulkActions: React.FC<BulkActionsProps> = ({
  theme,
  selectedServices,
  onBulkDelete,
  onBulkActivate,
  onBulkDeactivate,
  onClearSelection
}) => {
  if (selectedServices.length === 0) {
    return null;
  }

  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = React.useState(false);
  const [showBulkActivateConfirm, setShowBulkActivateConfirm] = React.useState(false);
  const [showBulkDeactivateConfirm, setShowBulkDeactivateConfirm] = React.useState(false);

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

  const handleBulkActivate = () => {
    setShowBulkActivateConfirm(true);
  };

  const confirmBulkActivate = () => {
    onBulkActivate();
    setShowBulkActivateConfirm(false);
  };

  const cancelBulkActivate = () => {
    setShowBulkActivateConfirm(false);
  };

  const handleBulkDeactivate = () => {
    setShowBulkDeactivateConfirm(true);
  };

  const confirmBulkDeactivate = () => {
    onBulkDeactivate();
    setShowBulkDeactivateConfirm(false);
  };

  const cancelBulkDeactivate = () => {
    setShowBulkDeactivateConfirm(false);
  };

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-2xl rounded-xl border ${
      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
    } p-4`}>
      <div className="flex items-center space-x-4">
        <div className={`text-sm font-medium ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {selectedServices.length} service(s) sélectionné(s)
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleBulkActivate}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
            title="Activer les services sélectionnés"
          >
            <Eye className="w-4 h-4" />
            <span>Activer</span>
          </button>

          <button
            onClick={handleBulkDeactivate}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
            }`}
            title="Désactiver les services sélectionnés"
          >
            <EyeOff className="w-4 h-4" />
            <span>Désactiver</span>
          </button>

          <button
            onClick={handleBulkDelete}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
            title="Supprimer les services sélectionnés"
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
      <ConfirmDialog
        isOpen={showBulkDeleteConfirm}
        title="Supprimer les services sélectionnés"
        message={`Êtes-vous sûr de vouloir supprimer ${selectedServices.length} service(s) ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        onConfirm={confirmBulkDelete}
        onCancel={cancelBulkDelete}
      />
      <ConfirmDialog
        isOpen={showBulkActivateConfirm}
        title="Activer les services sélectionnés"
        message={`Êtes-vous sûr de vouloir activer ${selectedServices.length} service(s) ?`}
        confirmText="Activer"
        cancelText="Annuler"
        type="info"
        onConfirm={confirmBulkActivate}
        onCancel={cancelBulkActivate}
      />
      <ConfirmDialog
        isOpen={showBulkDeactivateConfirm}
        title="Désactiver les services sélectionnés"
        message={`Êtes-vous sûr de vouloir désactiver ${selectedServices.length} service(s) ?`}
        confirmText="Désactiver"
        cancelText="Annuler"
        type="warning"
        onConfirm={confirmBulkDeactivate}
        onCancel={cancelBulkDeactivate}
      />
    </div>
  );
};

export default BulkActions; 
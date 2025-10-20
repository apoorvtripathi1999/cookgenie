'use client';

import React from 'react';
import { Package, Edit, Trash2, Calendar } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { InventoryItem } from '@/lib/types';
import { formatDate, getDaysUntilExpiry, getExpiryStatusText, getExpiryStatusColor } from '@/lib/utils';

interface InventoryListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: number) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ items, onEdit, onDelete }) => {
  if (items.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No items yet</h3>
          <p className="text-gray-600">Add your first inventory item to get started!</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const daysUntilExpiry = item.expiry_date ? getDaysUntilExpiry(item.expiry_date) : null;
        const expiryStatus = daysUntilExpiry !== null ? getExpiryStatusText(daysUntilExpiry) : null;
        const expiryColor = daysUntilExpiry !== null ? getExpiryStatusColor(daysUntilExpiry) : '';
        
        return (
          <Card key={item.id} hover className="animate-fade-in">
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                  {item.category && (
                    <Badge variant="default" className="mt-1">
                      {item.category}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium text-gray-900">
                    {item.quantity} {item.unit}
                  </span>
                </div>
                
                {item.expiry_date && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Expiry:</span>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{formatDate(item.expiry_date)}</span>
                    </div>
                  </div>
                )}
                
                {expiryStatus && (
                  <div className={`text-xs font-medium px-2 py-1 rounded ${expiryColor}`}>
                    {expiryStatus}
                  </div>
                )}
                
                {item.notes && (
                  <p className="text-sm text-gray-600 italic">{item.notes}</p>
                )}
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default InventoryList;


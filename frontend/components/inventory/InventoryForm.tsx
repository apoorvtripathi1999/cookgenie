'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { InventoryItem, UnitType } from '@/lib/types';

interface InventoryFormProps {
  profileId: number;
  item?: InventoryItem | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ profileId, item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: UnitType.PIECE,
    category: '',
    expiry_date: '',
    purchase_date: '',
    notes: '',
  });
  
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        quantity: item.quantity.toString(),
        unit: item.unit,
        category: item.category || '',
        expiry_date: item.expiry_date || '',
        purchase_date: item.purchase_date || '',
        notes: item.notes || '',
      });
    }
  }, [item]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      profile_id: profileId,
      name: formData.name,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      category: formData.category || null,
      expiry_date: formData.expiry_date || null,
      purchase_date: formData.purchase_date || null,
      notes: formData.notes || null,
    };
    
    onSubmit(submitData);
  };
  
  const unitOptions = Object.values(UnitType).map((unit) => ({
    value: unit,
    label: unit.charAt(0).toUpperCase() + unit.slice(1),
  }));
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Item Name"
        placeholder="e.g., Tomatoes"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Quantity"
          type="number"
          step="0.1"
          placeholder="0"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          required
        />
        
        <Select
          label="Unit"
          options={unitOptions}
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value as UnitType })}
          required
        />
      </div>
      
      <Input
        label="Category (Optional)"
        placeholder="e.g., Vegetable, Dairy, Spice"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Purchase Date (Optional)"
          type="date"
          value={formData.purchase_date}
          onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
        />
        
        <Input
          label="Expiry Date (Optional)"
          type="date"
          value={formData.expiry_date}
          onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
        />
      </div>
      
      <Input
        label="Notes (Optional)"
        placeholder="Any additional notes..."
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
      />
      
      <div className="flex space-x-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          {item ? 'Update Item' : 'Add Item'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default InventoryForm;


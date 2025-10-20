'use client';

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import InventoryList from '@/components/inventory/InventoryList';
import InventoryForm from '@/components/inventory/InventoryForm';
import { profileAPI, inventoryAPI } from '@/lib/api';
import { InventoryItem, Profile } from '@/lib/types';
import toast from 'react-hot-toast';

export default function InventoryPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const profilesRes = await profileAPI.getAll();
      let currentProfile = profilesRes.data[0];
      
      if (!currentProfile) {
        const newProfile = await profileAPI.create({ name: 'Default User' });
        currentProfile = newProfile.data;
      }
      
      setProfile(currentProfile);

      const inventoryRes = await inventoryAPI.getByProfile(currentProfile.id);
      setItems(inventoryRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load inventory');
      setLoading(false);
    }
  };

  const handleAddItem = async (data: any) => {
    try {
      await inventoryAPI.create(data);
      toast.success('Item added successfully!');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  };

  const handleUpdateItem = async (data: any) => {
    if (!editingItem) return;

    try {
      await inventoryAPI.update(editingItem.id, data);
      toast.success('Item updated successfully!');
      setIsModalOpen(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await inventoryAPI.delete(id);
      toast.success('Item deleted successfully!');
      loadData();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kitchen Inventory</h1>
          <p className="text-gray-600 mt-1">Manage your ingredients and supplies</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Item
        </Button>
      </div>

      <InventoryList items={items} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Item' : 'Add New Item'}
        size="md"
      >
        {profile && (
          <InventoryForm
            profileId={profile.id}
            item={editingItem}
            onSubmit={editingItem ? handleUpdateItem : handleAddItem}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>
    </div>
  );
}


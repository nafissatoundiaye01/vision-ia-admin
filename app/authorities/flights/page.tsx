'use client';

import { useState } from 'react';
import CustomSelect from '@/app/components/ui/CustomSelect';

interface Authority {
  id: number;
  name: string;
  type: string;
  location: string;
  status: 'active' | 'inactive' | 'pending';
  cases: number;
  officer: string;
  contact: string;
  lastUpdate: string;
}

export default function FlightsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedAuthority, setSelectedAuthority] = useState<Authority | null>(null);
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('active');

  const authorities: Authority[] = [
    {
      id: 1,
      name: 'Police Department NYC',
      type: 'Law Enforcement',
      location: 'New York, NY',
      status: 'active',
      cases: 145,
      officer: 'John Smith',
      contact: '+1 (212) 555-0100',
      lastUpdate: '2 hours ago'
    },
    {
      id: 2,
      name: 'Fire Department LA',
      type: 'Emergency Services',
      location: 'Los Angeles, CA',
      status: 'active',
      cases: 89,
      officer: 'Sarah Johnson',
      contact: '+1 (213) 555-0200',
      lastUpdate: '5 hours ago'
    },
    {
      id: 3,
      name: 'Coast Guard Miami',
      type: 'Maritime Security',
      location: 'Miami, FL',
      status: 'pending',
      cases: 34,
      officer: 'Michael Brown',
      contact: '+1 (305) 555-0300',
      lastUpdate: '1 day ago'
    },
    {
      id: 4,
      name: 'Border Patrol TX',
      type: 'Border Security',
      location: 'El Paso, TX',
      status: 'active',
      cases: 201,
      officer: 'Emily Davis',
      contact: '+1 (915) 555-0400',
      lastUpdate: '3 hours ago'
    },
    {
      id: 5,
      name: 'FBI Field Office',
      type: 'Federal Agency',
      location: 'Washington, DC',
      status: 'active',
      cases: 312,
      officer: 'Robert Wilson',
      contact: '+1 (202) 555-0500',
      lastUpdate: '1 hour ago'
    },
    {
      id: 6,
      name: 'DEA Regional Office',
      type: 'Drug Enforcement',
      location: 'Atlanta, GA',
      status: 'inactive',
      cases: 67,
      officer: 'Lisa Anderson',
      contact: '+1 (404) 555-0600',
      lastUpdate: '2 days ago'
    },
  ];

  const filteredAuthorities = authorities.filter((auth) => {
    const matchesSearch = auth.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auth.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auth.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || auth.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✓';
      case 'inactive': return '✕';
      case 'pending': return '⏳';
      default: return '•';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Authorities Management</h1>
        <p className="text-slate-600">Manage and monitor all registered authorities</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search Bar */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search authorities, type, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 pl-12 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl">
                🔍
              </span>
            </div>
          </div>

          {/* Status Filter */}
          <CustomSelect
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'inactive', label: 'Inactive' }
            ]}
            placeholder="Sélectionner un statut"
          />

          {/* Add New Button */}
          <button
            onClick={() => {
              setSelectedAuthority(null);
              setShowModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg flex items-center space-x-2"
          >
            <span className="text-xl">+</span>
            <span>Add Authority</span>
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-600 font-semibold mb-1">Total</p>
            <p className="text-2xl font-bold text-blue-800">{authorities.length}</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
            <p className="text-sm text-green-600 font-semibold mb-1">Active</p>
            <p className="text-2xl font-bold text-green-800">
              {authorities.filter(a => a.status === 'active').length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4">
            <p className="text-sm text-yellow-600 font-semibold mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-800">
              {authorities.filter(a => a.status === 'pending').length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
            <p className="text-sm text-gray-600 font-semibold mb-1">Inactive</p>
            <p className="text-2xl font-bold text-gray-800">
              {authorities.filter(a => a.status === 'inactive').length}
            </p>
          </div>
        </div>
      </div>

      {/* Authorities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAuthorities.map((authority) => (
          <div
            key={authority.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer"
            onClick={() => {
              setSelectedAuthority(authority);
              setShowModal(true);
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {authority.name.substring(0, 2)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{authority.name}</h3>
                  <p className="text-sm text-slate-500">{authority.type}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(authority.status)} flex items-center space-x-1`}>
                <span>{getStatusIcon(authority.status)}</span>
                <span>{authority.status.toUpperCase()}</span>
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-slate-600">
                <span className="text-lg">📍</span>
                <span className="text-sm">{authority.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <span className="text-lg">👤</span>
                <span className="text-sm">{authority.officer}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <span className="text-lg">📞</span>
                <span className="text-sm">{authority.contact}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500 mb-1">Total Cases</p>
                <p className="text-2xl font-bold text-slate-800">{authority.cases}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-1">Last Update</p>
                <p className="text-sm font-semibold text-yellow-600">{authority.lastUpdate}</p>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAuthority(authority);
                  setShowModal(true);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-semibold transition-colors"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert('Delete functionality');
                }}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">
                {selectedAuthority ? 'Edit Authority' : 'Add New Authority'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Authority Name
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedAuthority?.name}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter authority name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Type
                  </label>
                  <CustomSelect
                    value={selectedType || selectedAuthority?.type || ''}
                    onChange={setSelectedType}
                    options={[
                      { value: 'Law Enforcement', label: 'Law Enforcement' },
                      { value: 'Emergency Services', label: 'Emergency Services' },
                      { value: 'Maritime Security', label: 'Maritime Security' },
                      { value: 'Border Security', label: 'Border Security' },
                      { value: 'Federal Agency', label: 'Federal Agency' },
                      { value: 'Drug Enforcement', label: 'Drug Enforcement' }
                    ]}
                    placeholder="Sélectionner un type"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedAuthority?.location}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Officer in Charge
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedAuthority?.officer}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter officer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    defaultValue={selectedAuthority?.contact}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter contact number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>
                  <CustomSelect
                    value={selectedStatus || selectedAuthority?.status || 'active'}
                    onChange={setSelectedStatus}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'inactive', label: 'Inactive' }
                    ]}
                    placeholder="Sélectionner un statut"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg"
                  >
                    {selectedAuthority ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

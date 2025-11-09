'use client';

import { useState } from 'react';
import CustomSelect from '@/app/components/ui/CustomSelect';

export default function WalletPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  const transactions = [
    {
      id: 1,
      type: 'expense',
      category: 'Equipment',
      description: 'New patrol vehicles',
      amount: 45000,
      date: '2024-06-15',
      authority: 'Police Department NYC',
      status: 'approved'
    },
    {
      id: 2,
      type: 'income',
      category: 'Budget Allocation',
      description: 'Q2 2024 Budget',
      amount: 150000,
      date: '2024-06-01',
      authority: 'Federal Treasury',
      status: 'completed'
    },
    {
      id: 3,
      type: 'expense',
      category: 'Training',
      description: 'Officer training program',
      amount: 12000,
      date: '2024-06-10',
      authority: 'Fire Department LA',
      status: 'pending'
    },
    {
      id: 4,
      type: 'expense',
      category: 'Maintenance',
      description: 'Facility repairs',
      amount: 8500,
      date: '2024-06-05',
      authority: 'Coast Guard Miami',
      status: 'approved'
    },
  ];

  const budgetCategories = [
    { name: 'Personnel', allocated: 250000, spent: 180000, color: 'bg-blue-500' },
    { name: 'Equipment', allocated: 100000, spent: 75000, color: 'bg-green-500' },
    { name: 'Operations', allocated: 80000, spent: 65000, color: 'bg-yellow-500' },
    { name: 'Training', allocated: 50000, spent: 32000, color: 'bg-purple-500' },
    { name: 'Maintenance', allocated: 40000, spent: 28000, color: 'bg-red-500' },
  ];

  const totalAllocated = budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalAllocated - totalSpent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Budget & Finance</h1>
          <p className="text-slate-600">Track and manage authority budgets</p>
        </div>
        <div className="flex items-center space-x-4">
          <CustomSelect
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            options={[
              { value: 'This Month', label: 'This Month' },
              { value: 'This Quarter', label: 'This Quarter' },
              { value: 'This Year', label: 'This Year' }
            ]}
            placeholder="Sélectionner une période"
          />
          <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg">
            + New Transaction
          </button>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">💰</span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Total</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Allocated</p>
          <p className="text-4xl font-bold mb-2">${(totalAllocated / 1000).toFixed(0)}K</p>
          <p className="text-xs opacity-75">For {selectedPeriod}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">📊</span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Spent</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Spent</p>
          <p className="text-4xl font-bold mb-2">${(totalSpent / 1000).toFixed(0)}K</p>
          <p className="text-xs opacity-75">{((totalSpent / totalAllocated) * 100).toFixed(1)}% of budget</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">💎</span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Available</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Remaining Budget</p>
          <p className="text-4xl font-bold mb-2">${(remaining / 1000).toFixed(0)}K</p>
          <p className="text-xs opacity-75">{((remaining / totalAllocated) * 100).toFixed(1)}% remaining</p>
        </div>
      </div>

      {/* Budget Categories & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Budget Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Budget by Category</h2>
          <div className="space-y-5">
            {budgetCategories.map((category, index) => {
              const percentage = (category.spent / category.allocated) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">{category.name}</span>
                    <span className="text-sm text-slate-600">
                      ${(category.spent / 1000).toFixed(0)}K / ${(category.allocated / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full ${category.color} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="text-xs text-white font-semibold">{percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Monthly Spending Trend</h2>
          <div className="h-64 flex items-end justify-between space-x-3">
            {[65, 72, 58, 81, 69, 75].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-xl relative"
                  style={{ height: `${(value / 100) * 200}px` }}
                >
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-slate-600">
                    ${value}K
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-600 mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Recent Transactions</h2>
          <button className="text-sm text-yellow-600 font-semibold hover:text-yellow-700">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Description</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Authority</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Date</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Amount</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      transaction.type === 'income'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'income' ? '↓' : '↑'} {transaction.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-700 font-semibold">{transaction.category}</td>
                  <td className="py-4 px-4 text-slate-600">{transaction.description}</td>
                  <td className="py-4 px-4 text-slate-600 text-sm">{transaction.authority}</td>
                  <td className="py-4 px-4 text-slate-500 text-sm">{transaction.date}</td>
                  <td className={`py-4 px-4 text-right font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      transaction.status === 'approved' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

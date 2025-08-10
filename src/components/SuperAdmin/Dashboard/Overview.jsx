import React from 'react';
import DashboardLayout from './DashboardLayout';
import { BarChart, Users, FileText, ArrowUp } from 'lucide-react';
import { useThemeColors } from '../Theme/useThemeColors';

const StatCard = ({ title, value, icon: Icon, trend }) => {
  const colors = useThemeColors();
  
  return (
    <div 
      className="rounded-lg p-6 shadow-sm"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p 
            className="text-sm font-medium"
            style={{ color: colors.text.secondary }}
          >
            {title}
          </p>
          <p 
            className="text-2xl font-semibold mt-2"
            style={{ color: colors.text.primary }}
          >
            {value}
          </p>
        </div>
        <div 
          className="p-3 rounded-full"
          style={{ backgroundColor: `${colors.accent.primary}20` }}
        >
          <Icon 
            className="h-6 w-6"
            style={{ color: colors.accent.primary }}
          />
        </div>
      </div>
      {trend && (
        <div 
          className="flex items-center mt-4"
          style={{ color: colors.accent.success }}
        >
          <ArrowUp className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">{trend} increase</span>
        </div>
      )}
    </div>
  );
};

const Overview = () => {
  const colors = useThemeColors();
  const stats = [
    { title: 'Total Users', value: '1,234', icon: Users, trend: '12%' },
    { title: 'Active Sessions', value: '567', icon: BarChart, trend: '8%' },
    { title: 'Documents Processed', value: '892', icon: FileText, trend: '24%' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 
          className="text-2xl font-semibold"
          style={{ color: colors.text.primary }}
        >
          Dashboard Overview
        </h1>
        <p 
          className="mt-1"
          style={{ color: colors.text.secondary }}
        >
          Welcome to your admin dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Add more dashboard content here */}
    </DashboardLayout>
  );
};

export default Overview;
